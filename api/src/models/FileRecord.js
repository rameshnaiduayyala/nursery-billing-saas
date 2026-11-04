import mongoose from "mongoose";

const fileRecordSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    category: {
      type: String,
      enum: ["PLANT_IMAGE", "BUSINESS_DOC", "INVOICE_PDF", "RECEIPT_PDF", "QUOTATION_PDF", "EXPENSE_RECEIPT", "GENERAL"],
      default: "GENERAL",
    },
    entityType: { type: String, default: null }, // e.g. "Product", "Invoice", "Expense", "Organization"
    entityId: { type: String, default: null },
  },
  { timestamps: true }
);

fileRecordSchema.index({ organizationId: 1, category: 1 });
fileRecordSchema.index({ entityType: 1, entityId: 1 });

export const FileRecord = mongoose.model("FileRecord", fileRecordSchema);
