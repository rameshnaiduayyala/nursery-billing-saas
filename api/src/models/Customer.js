import mongoose from "mongoose";

const customerUserSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPrimary: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["INVITED", "ACTIVE", "SUSPENDED"],
      default: "INVITED",
    },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    customerCode: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true, index: true },
    businessName: { type: String, default: null },
    phone: { type: String, required: true, trim: true, index: true },
    alternatePhone: { type: String, default: null },
    email: { type: String, default: null },
    customerType: { type: String, default: "INDIVIDUAL" },
    billingAddress: { type: mongoose.Schema.Types.Mixed, default: null },
    shippingAddress: { type: mongoose.Schema.Types.Mixed, default: null },
    creditLimit: { type: Number, default: 0 },
    openingBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    portalUsers: [customerUserSchema],
  },
  { timestamps: true }
);

customerSchema.index({ organizationId: 1, customerCode: 1 }, { unique: true });
customerSchema.index({ organizationId: 1, name: 1 });
customerSchema.index({ organizationId: 1, phone: 1 });

export const Customer = mongoose.model("Customer", customerSchema);

