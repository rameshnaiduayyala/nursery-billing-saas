import { listCustomers, createCustomer, getCustomerById } from "./customers.controller.js";

export default async function customerRoutes(app) {
  app.get("/customers", listCustomers);
  app.post("/customers", createCustomer);
  app.get("/customers/:id", getCustomerById);
}
