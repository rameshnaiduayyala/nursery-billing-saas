import { Invoice, Payment, Quotation, Customer } from "../../models/index.js";

export default async function reportRoutes(app) {
  app.get("/reports/overview", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const [invoices, payments, quotations, customers] = await Promise.all([
      Invoice.find({ organizationId: orgId }),
      Payment.find({ organizationId: orgId }),
      Quotation.find({ organizationId: orgId }),
      Customer.find({ organizationId: orgId }),
    ]);

    const totalSales = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalOutstanding = Math.max(0, totalSales - totalCollected);

    const quotationsCount = quotations.length;
    const acceptedQuotations = quotations.filter((q) => q.status === "ACCEPTED" || q.status === "CONVERTED").length;

    return reply.send({
      success: true,
      data: {
        totalSales,
        totalCollected,
        totalOutstanding,
        customerCount: customers.length,
        quotationsCount,
        acceptedQuotations,
        recentInvoices: invoices.slice(-5).reverse(),
        recentPayments: payments.slice(-5).reverse(),
      },
    });
  });
}

