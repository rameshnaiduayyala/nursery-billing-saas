import { Customer, CustomerLedgerEntry } from "../../models/index.js";

export async function getCustomerLedger(request, reply) {
  const orgId = request.headers["x-organization-id"];
  const customerId = request.params.id;
  const { startDate, endDate } = request.query || {};

  const customer = await Customer.findOne({ _id: customerId, organizationId: orgId });
  if (!customer) return reply.code(404).send({ success: false, message: "Customer not found" });

  const query = { organizationId: orgId, customerId };
  if (startDate || endDate) {
    query.transactionDate = {};
    if (startDate) query.transactionDate.$gte = new Date(startDate);
    if (endDate) query.transactionDate.$lte = new Date(endDate);
  }

  const entries = await CustomerLedgerEntry.find(query).sort({ transactionDate: 1, createdAt: 1 });

  const totalDebit = entries.reduce((sum, e) => sum + (e.debitAmount || 0), 0);
  const totalCredit = entries.reduce((sum, e) => sum + (e.creditAmount || 0), 0);

  const latestEntry = await CustomerLedgerEntry.findOne({ organizationId: orgId, customerId })
    .sort({ transactionDate: -1, createdAt: -1 });

  const currentOutstanding = latestEntry ? latestEntry.runningBalance : (customer.openingBalance || 0);

  return reply.send({
    success: true,
    data: {
      customer: {
        id: customer._id,
        name: customer.name,
        businessName: customer.businessName,
        phone: customer.phone,
        customerType: customer.customerType,
        openingBalance: customer.openingBalance,
        currentOutstanding,
      },
      periodSummary: {
        totalDebit,
        totalCredit,
        netPeriodChange: totalDebit - totalCredit,
      },
      entries,
    },
  });
}

