import { z } from "zod";
import { Payment, Invoice, DocumentSequence, Customer } from "../../models/index.js";
import { recordLedgerEntry } from "../../shared/ledger.service.js";

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

export async function listPayments(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { customerId, branchId } = request.query || {};
  const filter = { organizationId: orgId };
  if (customerId) filter.customerId = customerId;
  if (branchId) filter.branchId = branchId;

  const payments = await Payment.find(filter)
    .populate("customerId", "name businessName phone")
    .populate("branchId", "name code")
    .populate("allocations.invoiceId", "invoiceNumber grandTotal balanceDue")
    .sort({ createdAt: -1 });

  return reply.send({ success: true, data: payments });
}

export async function recordPayment(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = paymentCreateSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const { branchId, customerId, amount, paymentMethod, reference, notes, allocations } = parsed.data;

  const customer = await Customer.findOne({ _id: customerId, organizationId: orgId });
  if (!customer) return reply.code(404).send({ success: false, message: "Customer not found" });

  const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
  if (totalAllocated > amount) {
    return reply.code(400).send({
      success: false,
      message: `Total invoice allocations (₹${totalAllocated}) cannot exceed received payment amount (₹${amount})`,
    });
  }

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

  const unallocated = amount - totalAllocated;
  const desc = unallocated > 0
    ? `Payment received #${paymentNumber} (${paymentMethod}) - ₹${totalAllocated} allocated, ₹${unallocated} advance balance`
    : `Payment received #${paymentNumber} (${paymentMethod})`;

  await recordLedgerEntry({
    organizationId: orgId,
    branchId,
    customerId,
    entryType: unallocated === amount ? "ADVANCE" : "PAYMENT",
    transactionDate: payment.paymentDate,
    referenceType: "PAYMENT",
    referenceId: payment._id,
    referenceNumber: payment.paymentNumber,
    description: desc,
    debitAmount: 0,
    creditAmount: amount,
  });

  return reply.code(201).send({
    success: true,
    message: "Payment recorded and receipt generated successfully",
    data: payment,
  });
}

export async function getReceiptById(request, reply) {
  const orgId = request.headers["x-organization-id"];
  const receipt = await Payment.findOne({ _id: request.params.id, organizationId: orgId })
    .populate("customerId")
    .populate("branchId")
    .populate("organizationId", "name phone email address")
    .populate("allocations.invoiceId", "invoiceNumber grandTotal invoiceDate");

  if (!receipt) return reply.code(404).send({ success: false, message: "Receipt not found" });
  return reply.send({ success: true, data: receipt });
}

