import mongoose from "mongoose";

const paymentAllocationSchema = new mongoose.Schema(
  {
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    allocatedAmount: { type: Number, required: true },
  },
  { _id: true }
);

const paymentSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    paymentNumber: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"],
      required: true,
    },
    reference: { type: String, default: null },
    paymentDate: { type: Date, default: Date.now },
    notes: { type: String, default: null },
    allocations: [paymentAllocationSchema],
  },
  { timestamps: true }
);

paymentSchema.index({ organizationId: 1, branchId: 1, paymentNumber: 1 }, { unique: true });
paymentSchema.index({ organizationId: 1, customerId: 1, paymentDate: -1 });

export const Payment = mongoose.model("Payment", paymentSchema);

