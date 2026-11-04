import { Customer, Quotation, Invoice, Payment, CustomerLedgerEntry } from "../../models/index.js";

export default async function customerPortalRoutes(app) {
  // Middleware/helper to ensure customer authorization
  const getCustomerContext = async (request, reply) => {
    const customerId = request.headers["x-customer-id"];
    if (!customerId) {
      reply.code(401).send({ success: false, message: "Unauthorized customer portal access" });
      return null;
    }
    const customer = await Customer.findById(customerId);
    if (!customer) {
      reply.code(404).send({ success: false, message: "Customer profile not found" });
      return null;
    }
    return customer;
  };

  // 1. Customer Portal Dashboard
  app.get("/portal/overview", async (request, reply) => {
    const customer = await getCustomerContext(request, reply);
    if (!customer) return;

    const [quotations, invoices, payments, latestLedger] = await Promise.all([
      Quotation.find({ customerId: customer._id }).sort({ createdAt: -1 }),
      Invoice.find({ customerId: customer._id }).sort({ invoiceDate: -1 }),
      Payment.find({ customerId: customer._id }).sort({ paymentDate: -1 }),
      CustomerLedgerEntry.findOne({ customerId: customer._id }).sort({ transactionDate: -1, createdAt: -1 }),
    ]);

    const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const totalPaid = payments.reduce((sum, pay) => sum + (pay.amount || 0), 0);
    const outstandingBalance = latestLedger ? latestLedger.runningBalance : customer.openingBalance;

    return reply.send({
      success: true,
      data: {
        profile: customer,
        metrics: {
          totalInvoiced,
          totalPaid,
          outstandingBalance,
          openQuotationsCount: quotations.filter((q) => q.status === "SENT").length,
          unpaidInvoicesCount: invoices.filter((i) => i.balanceDue > 0).length,
        },
        recentQuotations: quotations.slice(0, 5),
        recentInvoices: invoices.slice(0, 5),
        recentPayments: payments.slice(0, 5),
      },
    });
  });

  // 2. Customer view quotations
  app.get("/portal/quotations", async (request, reply) => {
    const customer = await getCustomerContext(request, reply);
    if (!customer) return;

    const quotations = await Quotation.find({ customerId: customer._id }).sort({ createdAt: -1 });
    return reply.send({ success: true, data: quotations });
  });

  // 3. Customer accept / reject quotation
  app.patch("/portal/quotations/:id/respond", async (request, reply) => {
    const customer = await getCustomerContext(request, reply);
    if (!customer) return;

    const { action } = request.body || {}; // 'ACCEPT' | 'REJECT'
    if (!["ACCEPT", "REJECT"].includes(action)) {
      return reply.code(400).send({ success: false, message: "Action must be ACCEPT or REJECT" });
    }

    const quotation = await Quotation.findOne({ _id: request.params.id, customerId: customer._id });
    if (!quotation) return reply.code(404).send({ success: false, message: "Quotation not found" });

    if (quotation.status === "CONVERTED") {
      return reply.code(400).send({ success: false, message: "Quotation has already been converted to an invoice" });
    }

    quotation.status = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";
    await quotation.save();

    return reply.send({
      success: true,
      message: `Quotation has been marked as ${quotation.status}`,
      data: quotation,
    });
  });

  // 4. Customer view invoices & ledger
  app.get("/portal/invoices", async (request, reply) => {
    const customer = await getCustomerContext(request, reply);
    if (!customer) return;

    const invoices = await Invoice.find({ customerId: customer._id }).sort({ invoiceDate: -1 });
    return reply.send({ success: true, data: invoices });
  });

  app.get("/portal/ledger", async (request, reply) => {
    const customer = await getCustomerContext(request, reply);
    if (!customer) return;

    const entries = await CustomerLedgerEntry.find({ customerId: customer._id }).sort({ transactionDate: 1 });
    return reply.send({ success: true, data: entries });
  });
}

