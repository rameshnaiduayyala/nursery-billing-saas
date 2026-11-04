import { listExpenses, createExpense } from "./expenses.controller.js";

export default async function expenseRoutes(app) {
  app.get("/expenses", listExpenses);
  app.post("/expenses", createExpense);
}
