import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    category: {
      type: String,
      enum: ["LABOUR", "TRANSPORTATION", "FUEL", "PACKAGING", "PLANT_PURCHASES", "ELECTRICITY", "RENT", "MAINTENANCE", "OTHER"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"],
      default: "CASH",
    },
    expenseDate: { type: Date, default: Date.now },
    reference: { type: String, default: null },
    receiptUrl: { type: String, default: null },
    notes: { type: String, default: null },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

expenseSchema.index({ organizationId: 1, expenseDate: -1 });
expenseSchema.index({ branchId: 1, category: 1 });

export const Expense = mongoose.model("Expense", expenseSchema);

