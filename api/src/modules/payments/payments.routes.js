import { z } from "zod";
import { Payment, Invoice, DocumentSequence } from "../../models/index.js";

const allocationSchema = z.object({
  invoiceId: z.string().min(1),
  allocatedAmount: z.number().positive(),
});

const paymentCreateSchema = z.object({
  branchId: z.string().min(1),
  customerId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"]),
  reference: z.string().optional().nullable(),
  paymentDate: z.string().optional(),
  notes: z.string().optional().nullable(),
  allocations: z.array(allocationSchema).default([]),
});

export default async function paymentRoutes(app) {
  // List Payments
  app.get("/payments", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const payments = await Payment.find({ organizationId: orgId })
      .populate("customerId", "name businessName phone")
      .populate("branchId", "name code")
      .populate("allocations.invoiceId", "invoiceNumber grandTotal balanceDue")
      .sort({ createdAt: -1 });

    return reply.send({ success: true, data: payments });
  });

  // Record Payment & update invoice balances
  app.post("/payments", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const parsed = paymentCreateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
    }

    const { branchId, customerId, amount, paymentMethod, reference, notes, allocations } = parsed.data;

    // Sequence for Receipt / Payment Number
    const financialYear = "2026-27";
    const seq = await DocumentSequence.findOneAndUpdate(
      { organizationId: orgId, branchId, documentType: "PAYMENT", financialYear },
      { $inc: { nextNumber: 1 }, $setOnInsert: { prefix: "RCPT" } },
      { upsert: true, new: true }
    );
    const paymentNumber = `${seq.prefix || "RCPT"}-${seq.nextNumber.toString().padStart(4, "0")}`;

    const payment = await Payment.create({
      organizationId: orgId,
      branchId,
      customerId,
      paymentNumber,
      amount,
      paymentMethod,
      reference,
      notes,
      allocations,
      paymentDate: new Date(),
    });

    // Update invoices allocated
    for (const alloc of allocations) {
      const inv = await Invoice.findOne({ _id: alloc.invoiceId, organizationId: orgId });
      if (inv) {
        inv.amountPaid = (inv.amountPaid || 0) + alloc.allocatedAmount;
        inv.balanceDue = Math.max(0, inv.grandTotal - inv.amountPaid);
        if (inv.balanceDue === 0) {
          inv.status = "PAID";
        } else if (inv.amountPaid > 0) {
          inv.status = "PARTIALLY_PAID";
        }
        await inv.save();
      }
    }

    return reply.code(201).send({ success: true, data: payment });
  });
}

