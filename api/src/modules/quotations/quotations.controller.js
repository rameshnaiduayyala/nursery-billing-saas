import { z } from "zod";
import { Quotation, Invoice, DocumentSequence } from "../../models/index.js";

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

const quotationCreateSchema = z.object({
  branchId: z.string().min(1),
  customerId: z.string().min(1),
  quotationDate: z.string().optional(),
  validUntil: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1),
  discountAmount: z.number().default(0),
  notes: z.string().optional().nullable(),
  termsText: z.string().optional().nullable(),
});

export async function listQuotations(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const quotations = await Quotation.find({ organizationId: orgId })
    .populate("customerId", "name businessName phone")
    .populate("branchId", "name code")
    .sort({ createdAt: -1 });

  return reply.send({ success: true, data: quotations });
}

export async function createQuotation(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = quotationCreateSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const { branchId, customerId, items, discountAmount, notes, termsText, validUntil } = parsed.data;

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const financialYear = "2026-27";
  const seq = await DocumentSequence.findOneAndUpdate(
    { organizationId: orgId, branchId, documentType: "QUOTATION", financialYear },
    { $inc: { nextNumber: 1 }, $setOnInsert: { prefix: "QT" } },
    { upsert: true, new: true }
  );
  const quotationNumber = `${seq.prefix || "QT"}-${seq.nextNumber.toString().padStart(4, "0")}`;

  const quotation = await Quotation.create({
    organizationId: orgId,
    branchId,
    customerId,
    quotationNumber,
    status: "SENT",
    subtotal,
    discountAmount,
    chargesTotal: 0,
    grandTotal,
    items,
    charges: [],
    notes,
    termsText,
    validUntil: validUntil ? new Date(validUntil) : null,
  });

  return reply.code(201).send({ success: true, data: quotation });
}

export async function convertQuotationToInvoice(request, reply) {
  const orgId = request.headers["x-organization-id"];
  const quotationId = request.params.id;

  const quotation = await Quotation.findOne({ _id: quotationId, organizationId: orgId });
  if (!quotation) return reply.code(404).send({ success: false, message: "Quotation not found" });

  const financialYear = "2026-27";
  const seq = await DocumentSequence.findOneAndUpdate(
    { organizationId: orgId, branchId: quotation.branchId, documentType: "INVOICE", financialYear },
    { $inc: { nextNumber: 1 }, $setOnInsert: { prefix: "INV" } },
    { upsert: true, new: true }
  );
  const invoiceNumber = `${seq.prefix || "INV"}-${seq.nextNumber.toString().padStart(4, "0")}`;

  const invoice = await Invoice.create({
    organizationId: orgId,
    branchId: quotation.branchId,
    customerId: quotation.customerId,
    quotationId: quotation._id,
    invoiceNumber,
    status: "ISSUED",
    invoiceDate: new Date(),
    subtotal: quotation.subtotal,
    discountAmount: quotation.discountAmount,
    chargesTotal: quotation.chargesTotal,
    grandTotal: quotation.grandTotal,
    amountPaid: 0,
    balanceDue: quotation.grandTotal,
    notes: quotation.notes,
    items: quotation.items,
    charges: quotation.charges,
    issuedAt: new Date(),
  });

  quotation.status = "CONVERTED";
  quotation.invoiceId = invoice._id;
  await quotation.save();

  return reply.send({
    success: true,
    message: "Quotation converted to Invoice successfully",
    data: { invoiceId: invoice._id, invoiceNumber: invoice.invoiceNumber },
  });
}

