import {
  getOrganizationProfile,
  updateOrganizationProfile,
  getOrganizationSettings,
} from "./organizations.controller.js";

export default async function organizationRoutes(app) {
  app.get("/organizations/profile", getOrganizationProfile);
  app.patch("/organizations/profile", updateOrganizationProfile);
  app.get("/organizations/settings", getOrganizationSettings);
}
