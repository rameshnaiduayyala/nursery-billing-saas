import {
  listQuotations,
  createQuotation,
  convertQuotationToInvoice,
} from "./quotations.controller.js";

export default async function quotationRoutes(app) {
  app.get("/quotations", listQuotations);
  app.post("/quotations", createQuotation);
  app.post("/quotations/:id/convert-to-invoice", convertQuotationToInvoice);
}
