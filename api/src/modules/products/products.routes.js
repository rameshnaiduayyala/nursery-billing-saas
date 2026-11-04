import { z } from "zod";
import { Product, Unit, ProductCategory } from "../../models/index.js";

const productSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  unitId: z.string().min(1),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  plantVariety: z.string().optional().nullable(),
  plantSize: z.string().optional().nullable(),
  defaultRate: z.number().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export default async function productRoutes(app) {
  // Get all products for an organization
  app.get("/products", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const products = await Product.find({ organizationId: orgId })
      .populate("categoryId", "name")
      .populate("unitId", "name code")
      .sort({ createdAt: -1 });

    return reply.send({ success: true, data: products });
  });

  // Create product
  app.post("/products", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const parsed = productSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, message: "Invalid product data", errors: parsed.error.flatten() });
    }

    const product = await Product.create({
      ...parsed.data,
      organizationId: orgId,
    });

    return reply.code(201).send({ success: true, data: product });
  });

  // Get master Units & Categories for creation forms
  app.get("/products/meta", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    const [categories, units] = await Promise.all([
      ProductCategory.find(orgId ? { organizationId: orgId } : {}),
      Unit.find(orgId ? { organizationId: orgId } : {}),
    ]);

    return reply.send({ success: true, data: { categories, units } });
  });

  // Seed default units if empty
  app.post("/products/seed-defaults", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const defaultUnits = [
      { name: "Piece / Bag", code: "PCS", decimalAllowed: false },
      { name: "Pot", code: "POT", decimalAllowed: false },
      { name: "Bundle", code: "BDL", decimalAllowed: false },
      { name: "Kilogram", code: "KG", decimalAllowed: true },
      { name: "Tonne", code: "TON", decimalAllowed: true },
    ];

    for (const u of defaultUnits) {
      await Unit.findOneAndUpdate(
        { organizationId: orgId, code: u.code },
        { ...u, organizationId: orgId },
        { upsert: true }
      );
    }

    const defaultCategories = ["Fruit Plants", "Flowering Shrubs", "Indoor Plants", "Avenue Trees", "Medicinal Plants"];
    for (const name of defaultCategories) {
      await ProductCategory.findOneAndUpdate(
        { organizationId: orgId, name },
        { name, organizationId: orgId },
        { upsert: true }
      );
    }

    return reply.send({ success: true, message: "Defaults seeded successfully" });
  });
}

