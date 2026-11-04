import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    phone: { type: String, default: null },
    address: { type: mongoose.Schema.Types.Mixed, default: null },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

branchSchema.index({ organizationId: 1, code: 1 }, { unique: true });
branchSchema.index({ organizationId: 1, isActive: 1 });

export const Branch = mongoose.model("Branch", branchSchema);

