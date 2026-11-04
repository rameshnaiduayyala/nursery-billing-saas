import { Invoice, Payment, Customer, Expense, Branch } from "../../models/index.js";

export async function getOverviewReport(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { branchId, startDate, endDate } = request.query || {};
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.$gte = startDate ? new Date(startDate) : new Date("2000-01-01");
    if (endDate) dateFilter.$lte = new Date(endDate);
  }

  const invQuery = { organizationId: orgId, status: { $ne: "CANCELLED" } };
  const payQuery = { organizationId: orgId };
  const expQuery = { organizationId: orgId };

  if (branchId) {
    invQuery.branchId = branchId;
    payQuery.branchId = branchId;
    expQuery.branchId = branchId;
  }
  if (Object.keys(dateFilter).length > 0) {
    invQuery.invoiceDate = dateFilter;
    payQuery.paymentDate = dateFilter;
    expQuery.expenseDate = dateFilter;
  }

  const [invoices, payments, expenses, quotations, customers] = await Promise.all([
    Invoice.find({ ...invQuery, documentType: "INVOICE" }),
    Payment.find(payQuery),
    Expense.find(expQuery),
    Invoice.find({ organizationId: orgId, documentType: "QUOTATION" }),
    Customer.find({ organizationId: orgId }),
  ]);

  const totalSales = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalOutstanding = Math.max(0, totalSales - totalCollected);
  const netCashFlow = totalCollected - totalExpenses;

  const acceptedQuotations = quotations.filter((q) => q.status === "ACCEPTED" || q.status === "CONVERTED").length;

  return reply.send({
    success: true,
    data: {
      summary: {
        totalSales,
        totalCollected,
        totalOutstanding,
        totalExpenses,
        netCashFlow,
        customerCount: customers.length,
        quotationsCount: quotations.length,
        acceptedQuotations,
        invoicesCount: invoices.length,
      },
      recentInvoices: invoices.slice(-5).reverse(),
      recentPayments: payments.slice(-5).reverse(),
      recentExpenses: expenses.slice(-5).reverse(),
    },
  });
}

export async function getBranchReport(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const branches = await Branch.find({ organizationId: orgId });
  const performance = await Promise.all(
    branches.map(async (b) => {
      const [invoices, payments, expenses] = await Promise.all([
        Invoice.find({ organizationId: orgId, branchId: b._id, status: { $ne: "CANCELLED" } }),
        Payment.find({ organizationId: orgId, branchId: b._id }),
        Expense.find({ organizationId: orgId, branchId: b._id }),
      ]);

      const sales = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
      const collected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const expense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

      return {
        branchId: b._id,
        name: b.name,
        code: b.code,
        isDefault: b.isDefault,
        totalInvoiced: sales,
        totalCollected: collected,
        totalExpenses: expense,
        netContribution: collected - expense,
        invoicesCount: invoices.length,
      };
    })
  );

  return reply.send({ success: true, data: performance });
}

export async function getOutstandingReport(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const customers = await Customer.find({ organizationId: orgId });
  const outstandingList = await Promise.all(
    customers.map(async (c) => {
      const [invoices, payments] = await Promise.all([
        Invoice.find({ customerId: c._id, organizationId: orgId, status: { $ne: "CANCELLED" } }),
        Payment.find({ customerId: c._id, organizationId: orgId }),
      ]);

      const invoiced = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
      const paid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const outstanding = (c.openingBalance || 0) + invoiced - paid;

      return {
        customerId: c._id,
        customerCode: c.customerCode,
        name: c.name,
        businessName: c.businessName,
        phone: c.phone,
        customerType: c.customerType,
        totalInvoiced: invoiced,
        totalPaid: paid,
        outstandingBalance: outstanding,
      };
    })
  );

  const debtors = outstandingList.sort((a, b) => b.outstandingBalance - a.outstandingBalance);
  return reply.send({ success: true, data: debtors });
}

