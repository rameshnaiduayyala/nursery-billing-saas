import { getCustomerLedger } from "./ledger.controller.js";

export default async function customerLedgerRoutes(app) {
  app.get("/customers/:id/ledger", getCustomerLedger);
}
