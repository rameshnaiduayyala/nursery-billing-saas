export async function getHealthDetails(request, reply) {
  const mongoose = (await import("mongoose")).default;

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
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
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
      employees: "/api/v1/employees",
      products: "/api/v1/products",
      customers: "/api/v1/customers",
      ledger: "/api/v1/customers/:id/ledger",
      portal: "/api/v1/portal",
      quotations: "/api/v1/quotations",
      invoices: "/api/v1/invoices",
      payments: "/api/v1/payments",
      expenses: "/api/v1/expenses",
      charges: "/api/v1/charges",
      reports: "/api/v1/reports",
      admin: "/api/v1/admin",
    },
  };
}

