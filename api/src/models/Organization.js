import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "PENDING",
      index: true,
    },
    currency: { type: String, default: "INR" },
    timezone: { type: String, default: "Asia/Kolkata" },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    logoUrl: { type: String, default: null },
    address: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

organizationSchema.index({ status: 1, createdAt: -1 });

export const Organization = mongoose.model("Organization", organizationSchema);

