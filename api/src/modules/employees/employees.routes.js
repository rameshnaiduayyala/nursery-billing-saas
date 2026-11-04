import { listEmployees, inviteEmployee, updateEmployeeStatus } from "./employees.controller.js";

export default async function employeeRoutes(app) {
  app.get("/employees", listEmployees);
  app.post("/employees", inviteEmployee);
  app.patch("/employees/:id/status", updateEmployeeStatus);
}
