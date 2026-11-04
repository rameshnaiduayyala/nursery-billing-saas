import {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "./customers.controller.js";

export default async function customerRoutes(app) {
  app.get("/customers", listCustomers);
  app.get("/customers/:id", getCustomerById);
  app.post("/customers", createCustomer);
  app.patch("/customers/:id", updateCustomer);
  app.delete("/customers/:id", deleteCustomer);
}
