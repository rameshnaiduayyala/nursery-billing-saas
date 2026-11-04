import {
  listInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  cancelInvoice,
  deleteInvoice,
  convertQuotationToInvoice,
} from "./invoices.controller.js";

export default async function invoiceRoutes(app) {
  app.get("/invoices", listInvoices);
  app.get("/invoices/:id", getInvoiceById);
  app.post("/invoices", createInvoice);
  app.put("/invoices/:id", updateInvoice);
  app.patch("/invoices/:id", updateInvoice);
  app.post("/invoices/:id/convert", convertQuotationToInvoice);
  app.post("/invoices/:id/cancel", cancelInvoice);
  app.delete("/invoices/:id", deleteInvoice);
}
