import {
  listPayments,
  recordPayment,
} from "./payments.controller.js";

export default async function paymentRoutes(app) {
  app.get("/payments", listPayments);
  app.post("/payments", recordPayment);
}
