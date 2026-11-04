import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

productCategorySchema.index({ organizationId: 1, name: 1 }, { unique: true });

export const ProductCategory = mongoose.model("ProductCategory", productCategorySchema);

const unitSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    decimalAllowed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

unitSchema.index({ organizationId: 1, code: 1 }, { unique: true });

export const Unit = mongoose.model("Unit", unitSchema);

const productSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory", default: null },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    sku: { type: String, default: null, trim: true },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: null },
    plantVariety: { type: String, default: null },
    plantSize: { type: String, default: null },
    defaultRate: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ organizationId: 1, sku: 1 }, { unique: true, sparse: true });
productSchema.index({ organizationId: 1, name: 1 });

export const Product = mongoose.model("Product", productSchema);

