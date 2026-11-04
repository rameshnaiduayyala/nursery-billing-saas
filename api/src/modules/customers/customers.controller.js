import { z } from "zod";
import { Customer, Invoice, Payment } from "../../models/index.js";

const customerSchema = z.object({
  customerCode: z.string().optional(),
  name: z.string().min(1),
  businessName: z.string().optional().nullable(),
  phone: z.string().min(7),
  alternatePhone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  customerType: z
    .enum(["INDIVIDUAL", "RETAIL", "WHOLESALE", "LANDSCAPER", "NURSERY_TRADER", "EXPORTER", "CORPORATE"])
    .default("INDIVIDUAL"),
  billingAddress: z.any().optional(),
  shippingAddress: z.any().optional(),
  creditLimit: z.number().default(0),
  openingBalance: z.number().default(0),
  isActive: z.boolean().default(true),
});

const updateCustomerSchema = z.object({
  customerCode: z.string().optional(),
  name: z.string().min(1).optional(),
  businessName: z.string().optional().nullable(),
  phone: z.string().min(7).optional(),
  alternatePhone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  customerType: z
    .enum(["INDIVIDUAL", "RETAIL", "WHOLESALE", "LANDSCAPER", "NURSERY_TRADER", "EXPORTER", "CORPORATE"])
    .optional(),
  billingAddress: z.any().optional(),
  shippingAddress: z.any().optional(),
  creditLimit: z.number().optional(),
  openingBalance: z.number().optional(),
  isActive: z.boolean().optional(),
});

// 1. List all customers of this nursery with computed outstanding balances
export async function listCustomers(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { search, customerType, isActive } = request.query || {};
  const query = { organizationId: orgId };

  if (customerType && customerType !== "ALL") {
    query.customerType = customerType;
  }
  if (isActive !== undefined && isActive !== "ALL") {
    query.isActive = isActive === "true";
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { businessName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { customerCode: { $regex: search, $options: "i" } },
    ];
  }

  const customers = await Customer.find(query).sort({ createdAt: -1 });

  // Compute live outstanding balance for each customer
  const enriched = await Promise.all(
    customers.map(async (c) => {
      const [invoices, payments] = await Promise.all([
        Invoice.find({ customerId: c._id, organizationId: orgId, status: { $ne: "CANCELLED" } }),
        Payment.find({ customerId: c._id, organizationId: orgId }),
      ]);

      const invoiced = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
      const paid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const outstanding = (c.openingBalance || 0) + invoiced - paid;

      return {
        ...c.toObject(),
        totalInvoiced: invoiced,
        totalPaid: paid,
        outstandingBalance: outstanding,
        invoicesCount: invoices.length,
      };
    })
  );

  return reply.send({ success: true, data: enriched });
}

// 2. Get customer details by ID
export async function getCustomerById(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const customer = await Customer.findOne({ _id: request.params.id, organizationId: orgId });
  if (!customer) return reply.code(404).send({ success: false, message: "Customer not found" });

  const [invoices, payments, quotations] = await Promise.all([
    Invoice.find({ customerId: customer._id, organizationId: orgId, documentType: "INVOICE" }).sort({ createdAt: -1 }).limit(10),
    Payment.find({ customerId: customer._id, organizationId: orgId }).sort({ createdAt: -1 }).limit(10),
    Invoice.find({ customerId: customer._id, organizationId: orgId, documentType: "QUOTATION" }).sort({ createdAt: -1 }).limit(10),
  ]);

  const totalInvoiced = invoices.filter((i) => i.status !== "CANCELLED").reduce((s, i) => s + (i.grandTotal || 0), 0);
  const totalPaid = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const outstandingBalance = (customer.openingBalance || 0) + totalInvoiced - totalPaid;

  return reply.send({
    success: true,
    data: {
      ...customer.toObject(),
      totalInvoiced,
      totalPaid,
      outstandingBalance,
      recentInvoices: invoices,
      recentPayments: payments,
      recentQuotations: quotations,
    },
  });
}

// 3. Create a new customer profile
export async function createCustomer(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = customerSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  // Prevent duplicate phone number in same nursery organization
  const existingPhone = await Customer.findOne({
    organizationId: orgId,
    phone: parsed.data.phone.trim(),
  });
  if (existingPhone) {
    return reply.code(409).send({
      success: false,
      message: `A customer with mobile number "${parsed.data.phone}" already exists (${existingPhone.name})`,
    });
  }

  // Generate unique customer code if omitted
  let code = parsed.data.customerCode;
  if (!code) {
    const count = await Customer.countDocuments({ organizationId: orgId });
    code = `CUST-${String(count + 1).padStart(4, "0")}`;
  } else {
    code = code.trim().toUpperCase();
    const existingCode = await Customer.findOne({ organizationId: orgId, customerCode: code });
    if (existingCode) {
      return reply.code(409).send({ success: false, message: `Customer code "${code}" is already in use` });
    }
  }

  const customer = await Customer.create({
    ...parsed.data,
    customerCode: code,
    organizationId: orgId,
  });

  return reply.code(201).send({
    success: true,
    message: `Customer "${customer.name}" registered successfully`,
    data: customer,
  });
}

// 4. Update customer profile
export async function updateCustomer(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const customer = await Customer.findOne({ _id: request.params.id, organizationId: orgId });
  if (!customer) return reply.code(404).send({ success: false, message: "Customer not found" });

  const parsed = updateCustomerSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  // Check phone uniqueness if phone is changing
  if (parsed.data.phone && parsed.data.phone.trim() !== customer.phone) {
    const duplicate = await Customer.findOne({
      organizationId: orgId,
      phone: parsed.data.phone.trim(),
      _id: { $ne: customer._id },
    });
    if (duplicate) {
      return reply.code(409).send({ success: false, message: `Phone number is already registered to ${duplicate.name}` });
    }
    customer.phone = parsed.data.phone.trim();
  }

  if (parsed.data.name !== undefined) customer.name = parsed.data.name.trim();
  if (parsed.data.businessName !== undefined) customer.businessName = parsed.data.businessName;
  if (parsed.data.alternatePhone !== undefined) customer.alternatePhone = parsed.data.alternatePhone;
  if (parsed.data.email !== undefined) customer.email = parsed.data.email;
  if (parsed.data.customerType !== undefined) customer.customerType = parsed.data.customerType;
  if (parsed.data.billingAddress !== undefined) customer.billingAddress = parsed.data.billingAddress;
  if (parsed.data.shippingAddress !== undefined) customer.shippingAddress = parsed.data.shippingAddress;
  if (parsed.data.creditLimit !== undefined) customer.creditLimit = parsed.data.creditLimit;
  if (parsed.data.openingBalance !== undefined) customer.openingBalance = parsed.data.openingBalance;
  if (parsed.data.isActive !== undefined) customer.isActive = parsed.data.isActive;

  await customer.save();

  return reply.send({
    success: true,
    message: `Customer "${customer.name}" updated successfully`,
    data: customer,
  });
}

// 5. Delete customer (safeguarded against deleting customers with financial records)
export async function deleteCustomer(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const customer = await Customer.findOne({ _id: request.params.id, organizationId: orgId });
  if (!customer) return reply.code(404).send({ success: false, message: "Customer not found" });

  // Guard: check if customer has invoices or payments
  const [invoiceCount, paymentCount] = await Promise.all([
    Invoice.countDocuments({ customerId: customer._id, organizationId: orgId }),
    Payment.countDocuments({ customerId: customer._id, organizationId: orgId }),
  ]);

  if (invoiceCount > 0 || paymentCount > 0) {
    return reply.code(400).send({
      success: false,
      message: `Cannot delete customer "${customer.name}" because they have ${invoiceCount} invoice(s) and ${paymentCount} recorded payment(s). You can mark the customer as Inactive instead.`,
    });
  }

  await Customer.deleteOne({ _id: customer._id });

  return reply.send({ success: true, message: `Customer "${customer.name}" deleted successfully` });
}
