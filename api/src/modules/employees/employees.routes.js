import {
  listEmployees,
  inviteEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
} from "./employees.controller.js";

export default async function employeeRoutes(app) {
  app.get("/employees", listEmployees);
  app.post("/employees", inviteEmployee);
  app.patch("/employees/:id", updateEmployee);
  app.patch("/employees/:id/status", updateEmployeeStatus);
  app.delete("/employees/:id", deleteEmployee);
}
