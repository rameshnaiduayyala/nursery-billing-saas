import { listReceipts, getReceiptById } from "./receipts.controller.js";

export default async function receiptRoutes(app) {
  app.get("/receipts", listReceipts);
  app.get("/receipts/:id", getReceiptById);
}
