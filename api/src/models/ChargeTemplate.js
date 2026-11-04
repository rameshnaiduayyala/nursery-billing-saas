import mongoose from "mongoose";

const chargeTemplateSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    chargeType: {
      type: String,
      enum: ["LOADING", "UNLOADING", "TRANSPORT", "LABOUR", "PACKAGING", "VEHICLE", "OTHER"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    calculationType: {
      type: String,
      enum: ["FIXED", "PER_UNIT", "PER_BAG", "PER_TONNE", "PER_VEHICLE", "PER_DAY", "PER_WORKER", "PERCENTAGE"],
      default: "FIXED",
    },
    defaultRate: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

chargeTemplateSchema.index({ organizationId: 1, chargeType: 1 });

export const ChargeTemplate = mongoose.model("ChargeTemplate", chargeTemplateSchema);

