import { z } from "zod";
import { Invoice, DocumentSequence, Customer } from "../../models/index.js";
import { recordLedgerEntry } from "../../shared/ledger.service.js";

const itemSchema = z.object({
  productId: z.string().optional().nullable(),
  plantName: z.string().optional().nullable(),
  plantSize: z.string().optional().nullable(),
  variety: z.string().optional().nullable(),
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitName: z.string().default("PCS"),
  unitPrice: z.number().nonnegative(),
  discountAmount: z.number().nonnegative().default(0),
  lineTotal: z.number().nonnegative(),
  customFields: z.record(z.any()).optional().default({}),
  sortOrder: z.number().default(0),
});

const chargeSchema = z.object({
  chargeType: z.enum(["LOADING", "UNLOADING", "TRANSPORT", "LABOUR", "PACKAGING", "VEHICLE", "OTHER"]),
  name: z.string().min(1),
  calculationType: z.enum(["FIXED", "PER_UNIT", "PER_BAG", "PER_TONNE", "PER_VEHICLE", "PER_DAY", "PER_WORKER", "PERCENTAGE"]).default("FIXED"),
  quantity: z.number().default(1),
  rate: z.number().default(0),
  amount: z.number().nonnegative(),
});

const invoiceCreateSchema = z.object({
  branchId: z.string().min(1),
  customerId: z.string().min(1),
  invoiceDate: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1),
  charges: z.array(chargeSchema).default([]),
  discountAmount: z.number().default(0),
  visibleColumns: z.array(z.string()).optional(),
  notes: z.string().optional().nullable(),
});

export async function listInvoices(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { branchId, customerId, status, search } = request.query || {};
  const filter = { organizationId: orgId };

  if (branchId) filter.branchId = branchId;
  if (customerId) filter.customerId = customerId;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { invoiceNumber: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }

  const invoices = await Invoice.find(filter)
    .populate("customerId", "name businessName phone customerCode")
    .populate("branchId", "name code")
    .sort({ createdAt: -1 });

  return reply.send({ success: true, data: invoices });
}

export async function getInvoiceById(request, reply) {
  const orgId = request.headers["x-organization-id"];
  const invoice = await Invoice.findOne({ _id: request.params.id, organizationId: orgId })
    .populate("customerId")
    .populate("branchId")
    .populate("organizationId", "name phone email address logoUrl currency");

  if (!invoice) return reply.code(404).send({ success: false, message: "Invoice not found" });
  return reply.send({ success: true, data: invoice });
}

export async function createInvoice(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = invoiceCreateSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const { branchId, customerId, invoiceDate, dueDate, items, charges, discountAmount, visibleColumns, notes } = parsed.data;

  const customer = await Customer.findOne({ _id: customerId, organizationId: orgId });
  if (!customer) return reply.code(404).send({ success: false, message: "Customer not found" });

  const year = new Date().getFullYear();
  const financialYear = `${year}-${year + 1}`;

  // Atomic sequence numbering
  const seq = await DocumentSequence.findOneAndUpdate(
    { organizationId: orgId, branchId, documentType: "INVOICE", financialYear },
    { $inc: { nextNumber: 1 }, $setOnInsert: { prefix: "INV" } },
    { upsert: true, new: true }
  );

  const invoiceNumber = `${seq.prefix || "INV"}-${financialYear}-${String(seq.nextNumber).padStart(4, "0")}`;

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const chargesTotal = charges.reduce((sum, ch) => sum + ch.amount, 0);
  const grandTotal = Math.max(0, subtotal - discountAmount + chargesTotal);

  const sanitizedItems = items.map((it) => ({
    ...it,
    productId: it.productId && it.productId.trim() !== "" ? it.productId : null,
  }));

  const invoice = await Invoice.create({
    organizationId: orgId,
    branchId,
    customerId,
    invoiceNumber,
    status: "ISSUED",
    invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
    dueDate: dueDate ? new Date(dueDate) : null,
    subtotal,
    discountAmount,
    chargesTotal,
    grandTotal,
    amountPaid: 0,
    balanceDue: grandTotal,
    customerSnapshot: {
      name: customer.name,
      businessName: customer.businessName,
      phone: customer.phone,
      address: customer.billingAddress,
    },
    visibleColumns: visibleColumns || ["plantName", "plantSize", "quantity", "unitPrice", "lineTotal"],
    notes,
    items: sanitizedItems,
    charges,
    issuedAt: new Date(),
  });

  // Post debit ledger entry for customer
  try {
    await recordLedgerEntry({
      organizationId: orgId,
      branchId,
      customerId,
      entryType: "INVOICE_DEBIT",
      debit: grandTotal,
      credit: 0,
      referenceType: "INVOICE",
      referenceId: invoice._id.toString(),
      description: `Non-GST Invoice issued: ${invoiceNumber}`,
    });
  } catch (err) {
    // Non-blocking
  }

  return reply.code(201).send({
    success: true,
    message: `Invoice ${invoiceNumber} created and posted to customer ledger`,
    data: invoice,
  });
}

export async function cancelInvoice(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { id } = request.params;
  const invoice = await Invoice.findOne({ _id: id, organizationId: orgId });
  if (!invoice) return reply.code(404).send({ success: false, message: "Invoice not found" });

  if (invoice.status === "CANCELLED") {
    return reply.code(400).send({ success: false, message: "Invoice is already cancelled" });
  }

  invoice.status = "CANCELLED";
  invoice.cancelledAt = new Date();
  invoice.cancellationReason = request.body?.reason || "Cancelled by user";
  await invoice.save();

  // Reverse ledger entry with credit
  try {
    await recordLedgerEntry({
      organizationId: orgId,
      branchId: invoice.branchId?.toString(),
      customerId: invoice.customerId?.toString(),
      entryType: "INVOICE_CANCEL_CREDIT",
      debit: 0,
      credit: invoice.grandTotal,
      referenceType: "INVOICE",
      referenceId: invoice._id.toString(),
      description: `Cancelled Invoice ${invoice.invoiceNumber}`,
    });
  } catch (err) {
    // Non-blocking
  }

  return reply.send({
    success: true,
    message: `Invoice ${invoice.invoiceNumber} cancelled successfully`,
    data: invoice,
  });
}

export async function updateInvoice(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { id } = request.params;
  const invoice = await Invoice.findOne({ _id: id, organizationId: orgId });
  if (!invoice) return reply.code(404).send({ success: false, message: "Invoice not found" });

  if (invoice.status === "CANCELLED") {
    return reply.code(400).send({ success: false, message: "Cannot edit a cancelled invoice" });
  }

  const parsed = invoiceCreateSchema.partial().safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const {
    branchId,
    customerId,
    invoiceDate,
    dueDate,
    items,
    charges,
    discountAmount,
    visibleColumns,
    notes,
  } = parsed.data;

  const previousGrandTotal = invoice.grandTotal;

  if (branchId) invoice.branchId = branchId;
  if (customerId) {
    invoice.customerId = customerId;
    const cust = await Customer.findOne({ _id: customerId, organizationId: orgId });
    if (cust) {
      invoice.customerSnapshot = {
        name: cust.name,
        businessName: cust.businessName,
        phone: cust.phone,
        address: cust.billingAddress,
      };
    }
  }

  if (invoiceDate) invoice.invoiceDate = new Date(invoiceDate);
  if (dueDate !== undefined) invoice.dueDate = dueDate ? new Date(dueDate) : null;
  if (visibleColumns) invoice.visibleColumns = visibleColumns;
  if (notes !== undefined) invoice.notes = notes;

  if (items) {
    invoice.items = items.map((it) => ({
      ...it,
      productId: it.productId && it.productId.trim() !== "" ? it.productId : null,
    }));
    invoice.subtotal = items.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0);
  }

  if (charges) {
    invoice.charges = charges;
    invoice.chargesTotal = charges.reduce((sum, ch) => sum + (Number(ch.amount) || 0), 0);
  }

  if (discountAmount !== undefined) {
    invoice.discountAmount = Number(discountAmount) || 0;
  }

  invoice.grandTotal = Math.max(0, invoice.subtotal - invoice.discountAmount + invoice.chargesTotal);
  invoice.balanceDue = Math.max(0, invoice.grandTotal - (invoice.amountPaid || 0));

  await invoice.save();

  // Reconcile delta ledger adjustment if grandTotal changed
  const delta = invoice.grandTotal - previousGrandTotal;
  if (delta !== 0) {
    try {
      await recordLedgerEntry({
        organizationId: orgId,
        branchId: invoice.branchId?.toString(),
        customerId: invoice.customerId?.toString(),
        entryType: delta > 0 ? "INVOICE_UPDATE_DEBIT" : "INVOICE_UPDATE_CREDIT",
        debit: delta > 0 ? delta : 0,
        credit: delta < 0 ? Math.abs(delta) : 0,
        referenceType: "INVOICE",
        referenceId: invoice._id.toString(),
        description: `Adjustment for modified Invoice ${invoice.invoiceNumber}`,
      });
    } catch (err) {
      // Non-blocking
    }
  }

  return reply.send({
    success: true,
    message: `Invoice ${invoice.invoiceNumber} updated successfully`,
    data: invoice,
  });
}

export async function deleteInvoice(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { id } = request.params;
  const invoice = await Invoice.findOne({ _id: id, organizationId: orgId });
  if (!invoice) return reply.code(404).send({ success: false, message: "Invoice not found" });

  // Reverse ledger entry before removal if not already cancelled
  if (invoice.status !== "CANCELLED") {
    try {
      await recordLedgerEntry({
        organizationId: orgId,
        branchId: invoice.branchId?.toString(),
        customerId: invoice.customerId?.toString(),
        entryType: "INVOICE_DELETE_CREDIT",
        debit: 0,
        credit: invoice.grandTotal,
        referenceType: "INVOICE",
        referenceId: invoice._id.toString(),
        description: `Reversal for deleted Invoice ${invoice.invoiceNumber}`,
      });
    } catch (err) {
      // Non-blocking
    }
  }

  await Invoice.deleteOne({ _id: id, organizationId: orgId });

  return reply.send({
    success: true,
    message: `Invoice ${invoice.invoiceNumber} deleted successfully`,
  });
}
