import { z } from "zod";
import { Invoice, DocumentSequence, Customer } from "../../models/index.js";
import { recordLedgerEntry } from "../../shared/ledger.service.js";

const itemSchema = z.object({
  productId: z.string().optional().nullable(),
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitName: z.string().default("PCS"),
  unitPrice: z.number().nonnegative(),
  discountAmount: z.number().nonnegative().default(0),
  lineTotal: z.number().nonnegative(),
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
  notes: z.string().optional().nullable(),
});

export default async function invoiceRoutes(app) {
  // List Invoices with filters
  app.get("/invoices", async (request, reply) => {
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
      .populate("customerId", "name businessName phone")
      .populate("branchId", "name code")
      .sort({ createdAt: -1 });

    return reply.send({ success: true, data: invoices });
  });

  // Get Single Invoice with details & immutable snapshot
  app.get("/invoices/:id", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    const invoice = await Invoice.findOne({ _id: request.params.id, organizationId: orgId })
      .populate("customerId")
      .populate("branchId")
      .populate("organizationId", "name phone email address logoUrl currency");

    if (!invoice) return reply.code(404).send({ success: false, message: "Invoice not found" });
    return reply.send({ success: true, data: invoice });
  });

  // Create Invoice (with automatic loading/transport calculations and Ledger debit)
  app.post("/invoices", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const parsed = invoiceCreateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
    }

    const { branchId, customerId, items, charges, discountAmount, notes, dueDate } = parsed.data;

    const customer = await Customer.findOne({ _id: customerId, organizationId: orgId });
    if (!customer) return reply.code(404).send({ success: false, message: "Customer not found" });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const chargesTotal = charges.reduce((sum, ch) => sum + ch.amount, 0);
    const grandTotal = Math.max(0, subtotal - discountAmount + chargesTotal);

    // Numbering sequence
    const financialYear = "2026-27";
    const seq = await DocumentSequence.findOneAndUpdate(
      { organizationId: orgId, branchId, documentType: "INVOICE", financialYear },
      { $inc: { nextNumber: 1 }, $setOnInsert: { prefix: "INV" } },
      { upsert: true, new: true }
    );
    const invoiceNumber = `${seq.prefix || "INV"}-${seq.nextNumber.toString().padStart(4, "0")}`;

    const invoice = await Invoice.create({
      organizationId: orgId,
      branchId,
      customerId,
      invoiceNumber,
      status: "ISSUED",
      invoiceDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      subtotal,
      discountAmount,
      chargesTotal,
      grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      notes,
      items,
      charges,
      customerSnapshot: {
        name: customer.name,
        businessName: customer.businessName,
        phone: customer.phone,
        billingAddress: customer.billingAddress,
      },
      issuedAt: new Date(),
    });

    // Record Debit in Customer Ledger
    await recordLedgerEntry({
      organizationId: orgId,
      branchId,
      customerId,
      entryType: "INVOICE",
      transactionDate: invoice.invoiceDate,
      referenceType: "INVOICE",
      referenceId: invoice._id,
      referenceNumber: invoice.invoiceNumber,
      description: `Invoice issued #${invoice.invoiceNumber} (Plants: ₹${subtotal}, Freight/Charges: ₹${chargesTotal})`,
      debitAmount: grandTotal,
      creditAmount: 0,
    });

    return reply.code(201).send({ success: true, data: invoice });
  });

  // Cancel an issued invoice (records adjustment in ledger)
  app.post("/invoices/:id/cancel", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    const invoice = await Invoice.findOne({ _id: request.params.id, organizationId: orgId });

    if (!invoice) return reply.code(404).send({ success: false, message: "Invoice not found" });
    if (invoice.status === "CANCELLED") {
      return reply.code(400).send({ success: false, message: "Invoice is already cancelled" });
    }
    if (invoice.amountPaid > 0) {
      return reply.code(400).send({
        success: false,
        message: "Cannot cancel an invoice with payments allocated. Reallocate or refund payments first.",
      });
    }

    invoice.status = "CANCELLED";
    invoice.cancelledAt = new Date();
    await invoice.save();

    // Reverse debit in Customer Ledger with a Credit Adjustment
    await recordLedgerEntry({
      organizationId: orgId,
      branchId: invoice.branchId,
      customerId: invoice.customerId,
      entryType: "ADJUSTMENT_CREDIT",
      transactionDate: new Date(),
      referenceType: "INVOICE",
      referenceId: invoice._id,
      referenceNumber: invoice.invoiceNumber,
      description: `Reversal / Cancellation of Invoice #${invoice.invoiceNumber}`,
      debitAmount: 0,
      creditAmount: invoice.grandTotal,
    });

    return reply.send({ success: true, message: "Invoice cancelled and customer ledger adjusted successfully", data: invoice });
  });
}
