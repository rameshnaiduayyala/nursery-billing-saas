import Fastify from "fastify";
import mongoosePlugin from "./plugins/mongoose.plugin.js";
import { registerSecurity } from "./plugins/security.plugin.js";
import healthRoutes from "./modules/health/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/products/products.routes.js";
import customerRoutes from "./modules/customers/customers.routes.js";
import quotationRoutes from "./modules/quotations/quotations.routes.js";
import invoiceRoutes from "./modules/invoices/invoices.routes.js";
import paymentRoutes from "./modules/payments/payments.routes.js";
import reportRoutes from "./modules/reports/reports.routes.js";
import branchRoutes from "./modules/branches/branches.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
    trustProxy: true,
    bodyLimit: 1_048_576,
  });

  await registerSecurity(app);
  await app.register(mongoosePlugin);

  // Register API modules under /api/v1
  await app.register(healthRoutes, { prefix: "/api/v1" });
  await app.register(authRoutes, { prefix: "/api/v1" });
  await app.register(branchRoutes, { prefix: "/api/v1" });
  await app.register(productRoutes, { prefix: "/api/v1" });
  await app.register(customerRoutes, { prefix: "/api/v1" });
  await app.register(quotationRoutes, { prefix: "/api/v1" });
  await app.register(invoiceRoutes, { prefix: "/api/v1" });
  await app.register(paymentRoutes, { prefix: "/api/v1" });
  await app.register(reportRoutes, { prefix: "/api/v1" });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    const statusCode = error.statusCode && error.statusCode < 500 ? error.statusCode : 500;
    reply.code(statusCode).send({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  });

  return app;
}
