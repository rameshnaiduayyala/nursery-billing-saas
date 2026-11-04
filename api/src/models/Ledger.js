import mongoose from "mongoose";

const customerLedgerEntrySchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    entryType: {
      type: String,
      enum: ["OPENING_BALANCE", "INVOICE", "PAYMENT", "ADVANCE", "REFUND", "ADJUSTMENT_DEBIT", "ADJUSTMENT_CREDIT"],
      required: true,
    },
    transactionDate: { type: Date, default: Date.now },
    referenceType: { type: String, enum: ["INVOICE", "PAYMENT", "ADJUSTMENT", "MANUAL"], default: "MANUAL" },
    referenceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    referenceNumber: { type: String, default: null },
    description: { type: String, required: true },
    debitAmount: { type: Number, default: 0 },
    creditAmount: { type: Number, default: 0 },
    runningBalance: { type: Number, required: true },
  },
  { timestamps: true }
);

customerLedgerEntrySchema.index({ customerId: 1, transactionDate: 1 });
customerLedgerEntrySchema.index({ organizationId: 1, transactionDate: -1 });

export const CustomerLedgerEntry = mongoose.model("CustomerLedgerEntry", customerLedgerEntrySchema);

