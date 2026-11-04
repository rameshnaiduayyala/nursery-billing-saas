import {
  listInvoices,
  getInvoiceById,
  createInvoice,
  cancelInvoice,
} from "./invoices.controller.js";

export default async function invoiceRoutes(app) {
  app.get("/invoices", listInvoices);
  app.get("/invoices/:id", getInvoiceById);
  app.post("/invoices", createInvoice);
  app.post("/invoices/:id/cancel", cancelInvoice);
}
