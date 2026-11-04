import mongoose from "mongoose";

const quotationItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitName: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    lineTotal: { type: Number, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true }
);

const quotationChargeSchema = new mongoose.Schema(
  {
    chargeType: {
      type: String,
      enum: ["LOADING", "UNLOADING", "TRANSPORT", "LABOUR", "PACKAGING", "VEHICLE", "OTHER"],
      required: true,
    },
    name: { type: String, required: true },
    calculationType: {
      type: String,
      enum: ["FIXED", "PER_UNIT", "PER_BAG", "PER_TONNE", "PER_VEHICLE", "PER_DAY", "PER_WORKER", "PERCENTAGE"],
      default: "FIXED",
    },
    quantity: { type: Number, default: 1 },
    rate: { type: Number, default: 0 },
    amount: { type: Number, required: true },
  },
  { _id: true }
);

const quotationSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    quotationNumber: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [
        "DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED",
        "ISSUED", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED", "CONVERTED"
      ],
      default: "DRAFT",
    },
    quotationDate: { type: Date, default: Date.now },
    validUntil: { type: Date, default: null },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    chargesTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    notes: { type: String, default: null },
    termsText: { type: String, default: null },
    items: [quotationItemSchema],
    charges: [quotationChargeSchema],
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", default: null },
  },
  { timestamps: true }
);

quotationSchema.index({ organizationId: 1, branchId: 1, quotationNumber: 1 }, { unique: true });
quotationSchema.index({ organizationId: 1, customerId: 1, status: 1 });
quotationSchema.index({ branchId: 1, quotationDate: -1 });

export const Quotation = mongoose.model("Quotation", quotationSchema);

