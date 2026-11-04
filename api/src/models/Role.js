import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true },
    isSystem: { type: Boolean, default: false },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

roleSchema.index({ organizationId: 1, key: 1 }, { unique: true });

export const Role = mongoose.model("Role", roleSchema);

