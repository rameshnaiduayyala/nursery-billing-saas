import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    plantName: { type: String, default: null },
    plantSize: { type: String, default: null },
    variety: { type: String, default: null },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitName: { type: String, default: "PCS" },
    unitPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    lineTotal: { type: Number, required: true },
    customFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true }
);

const invoiceChargeSchema = new mongoose.Schema(
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

const invoiceSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation", default: null },
    invoiceNumber: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [
        "DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED",
        "ISSUED", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED", "CONVERTED"
      ],
      default: "DRAFT",
    },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: null },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    chargesTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, required: true },
    customerSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
    branchSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
    visibleColumns: [{ type: String }],
    notes: { type: String, default: null },
    issuedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    items: [invoiceItemSchema],
    charges: [invoiceChargeSchema],
  },
  { timestamps: true }
);

invoiceSchema.index({ organizationId: 1, branchId: 1, invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ organizationId: 1, customerId: 1, status: 1 });
invoiceSchema.index({ branchId: 1, invoiceDate: -1 });

export const Invoice = mongoose.model("Invoice", invoiceSchema);
