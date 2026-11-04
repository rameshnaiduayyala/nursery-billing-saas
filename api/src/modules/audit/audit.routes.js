import { listAuditLogs } from "./audit.controller.js";

export default async function auditRoutes(app) {
  app.get("/audit-logs", listAuditLogs);
}

