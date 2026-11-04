import {
  listProducts,
  createProduct,
  getProductMeta,
  seedProductDefaults,
} from "./products.controller.js";

export default async function productRoutes(app) {
  app.get("/products", listProducts);
  app.post("/products", createProduct);
  app.get("/products/meta", getProductMeta);
  app.post("/products/seed-defaults", seedProductDefaults);
}
