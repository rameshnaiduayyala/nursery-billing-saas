import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    status: {
      type: String,
      enum: ["INVITED", "ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
    branchAccess: [
      {
        branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

membershipSchema.index({ userId: 1, organizationId: 1 }, { unique: true });
membershipSchema.index({ organizationId: 1, status: 1 });

export const Membership = mongoose.model("Membership", membershipSchema);

