import mongoose from "mongoose";

export default async function healthRoutes(app) {
  const getSystemDetails = () => {
    const mongoStatusMap = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
    };

    const mongoState = mongoose.connection.readyState;

    return {
      success: true,
      service: "Nursery Management SaaS API",
      status: "online",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      database: {
        engine: "MongoDB",
        status: mongoStatusMap[mongoState] || "Unknown",
        connected: mongoState === 1,
      },
      server: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsageMb: {
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        },
      },
      availableEndpoints: {
        root: "/",
        health: "/health",
        apiHealth: "/api/v1/health",
        auth: "/api/v1/auth",
        branches: "/api/v1/branches",
        products: "/api/v1/products",
        customers: "/api/v1/customers",
        quotations: "/api/v1/quotations",
        invoices: "/api/v1/invoices",
        payments: "/api/v1/payments",
        expenses: "/api/v1/expenses",
        charges: "/api/v1/charges",
        reports: "/api/v1/reports",
        admin: "/api/v1/admin",
      },
    };
  };

  // Root health / details route
  app.get("/health", async () => getSystemDetails());

  // Also expose at the root path if registered without prefix
  if (!app.hasRoute({ method: "GET", url: "/" })) {
    app.get("/", async () => getSystemDetails());
  }
}
