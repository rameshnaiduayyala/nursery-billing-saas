import { z } from "zod";
import { Expense } from "../../models/Expense.js";

const expenseSchema = z.object({
  branchId: z.string().min(1),
  category: z.enum(["LABOUR", "TRANSPORTATION", "FUEL", "PACKAGING", "PLANT_PURCHASES", "ELECTRICITY", "RENT", "MAINTENANCE", "OTHER"]),
  title: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"]).default("CASH"),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  expenseDate: z.string().optional(),
});

export async function listExpenses(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const expenses = await Expense.find({ organizationId: orgId })
    .populate("branchId", "name code")
    .sort({ expenseDate: -1 });

  return reply.send({ success: true, data: expenses });
}

export async function createExpense(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = expenseSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const expense = await Expense.create({
    ...parsed.data,
    organizationId: orgId,
    expenseDate: parsed.data.expenseDate ? new Date(parsed.data.expenseDate) : new Date(),
  });

  return reply.code(201).send({ success: true, data: expense });
}

