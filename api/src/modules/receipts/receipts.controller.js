import { Payment } from "../../models/Payment.js";

// List all payment receipts with customer and branch details
export async function listReceipts(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { customerId, branchId } = request.query || {};
  const query = { organizationId: orgId };
  if (customerId) query.customerId = customerId;
  if (branchId) query.branchId = branchId;

  const receipts = await Payment.find(query)
    .populate("customerId", "name customerCode phone businessName")
    .populate("branchId", "name code")
    .sort({ paymentDate: -1 });

  return reply.send({ success: true, data: receipts });
}

// Get single receipt details
export async function getReceiptById(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const receipt = await Payment.findOne({ _id: request.params.id, organizationId: orgId })
    .populate("customerId", "name customerCode phone businessName address")
    .populate("branchId", "name code address phone")
    .populate("allocations.invoiceId", "invoiceNumber grandTotal status invoiceDate");

  if (!receipt) return reply.code(404).send({ success: false, message: "Receipt not found" });

  return reply.send({ success: true, data: receipt });
}
