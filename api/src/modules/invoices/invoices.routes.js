import { z } from "zod";
import { Invoice, DocumentSequence, Customer } from "../../models/index.js";

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
  // List Invoices
  app.get("/invoices", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const invoices = await Invoice.find({ organizationId: orgId })
      .populate("customerId", "name businessName phone")
      .populate("branchId", "name code")
      .sort({ createdAt: -1 });

    return reply.send({ success: true, data: invoices });
  });

  // Get Single Invoice with details
  app.get("/invoices/:id", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    const invoice = await Invoice.findOne({ _id: request.params.id, organizationId: orgId })
      .populate("customerId")
      .populate("branchId")
      .populate("organizationId", "name phone email address logoUrl currency");

    if (!invoice) return reply.code(404).send({ success: false, message: "Invoice not found" });
    return reply.send({ success: true, data: invoice });
  });

  // Create Invoice (with automatic loading/transport calculations)
  app.post("/invoices", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const parsed = invoiceCreateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
    }

    const { branchId, customerId, items, charges, discountAmount, notes, dueDate } = parsed.data;

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
      issuedAt: new Date(),
    });

    return reply.code(201).send({ success: true, data: invoice });
  });
}

