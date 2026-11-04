import { getHealthDetails } from "./health.controller.js";

export default async function healthRoutes(app) {
  app.get("/health", getHealthDetails);

  if (!app.hasRoute({ method: "GET", url: "/" })) {
    app.get("/", getHealthDetails);
  }
}
