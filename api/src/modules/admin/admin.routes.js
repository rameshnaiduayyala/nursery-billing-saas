import {
  listOrganizations,
  updateOrganizationStatus,
  getPlatformMetrics,
} from "./admin.controller.js";

export default async function adminRoutes(app) {
  // List all registered nursery businesses
  app.get("/admin/organizations", listOrganizations);

  // Approve or Reject or Suspend registration
  app.patch("/admin/organizations/:id/status", updateOrganizationStatus);

  // Platform metrics
  app.get("/admin/metrics", getPlatformMetrics);
}
