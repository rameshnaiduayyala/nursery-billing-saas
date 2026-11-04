import { listChargeTemplates, createChargeTemplate } from "./charges.controller.js";

export default async function chargeRoutes(app) {
  app.get("/charges/templates", listChargeTemplates);
  app.post("/charges/templates", createChargeTemplate);
}
