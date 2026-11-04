import {
  getPortalOverview,
  getPortalQuotations,
  respondPortalQuotation,
  getPortalInvoices,
  getPortalLedger,
} from "./customer-portal.controller.js";

export default async function customerPortalRoutes(app) {
  app.get("/portal/overview", getPortalOverview);
  app.get("/portal/quotations", getPortalQuotations);
  app.patch("/portal/quotations/:id/respond", respondPortalQuotation);
  app.get("/portal/invoices", getPortalInvoices);
  app.get("/portal/ledger", getPortalLedger);
}
