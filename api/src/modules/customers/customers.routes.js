import { z } from "zod";
import { Customer } from "../../models/index.js";

const customerSchema = z.object({
  customerCode: z.string().optional(),
  name: z.string().min(1),
  businessName: z.string().optional().nullable(),
  phone: z.string().min(7),
  alternatePhone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  customerType: z.enum(["INDIVIDUAL", "RETAIL", "WHOLESALE", "LANDSCAPER", "NURSERY_TRADER", "EXPORTER", "CORPORATE"]).default("INDIVIDUAL"),
  billingAddress: z.any().optional(),
  shippingAddress: z.any().optional(),
  creditLimit: z.number().default(0),
  openingBalance: z.number().default(0),
});

export default async function customerRoutes(app) {
  // List customers
  app.get("/customers", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const customers = await Customer.find({ organizationId: orgId }).sort({ createdAt: -1 });
    return reply.send({ success: true, data: customers });
  });

  // Create customer
  app.post("/customers", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const parsed = customerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
    }

    const code = parsed.data.customerCode || "CUST-" + Math.floor(1000 + Math.random() * 9000);

    const customer = await Customer.create({
      ...parsed.data,
      customerCode: code,
      organizationId: orgId,
    });

    return reply.code(201).send({ success: true, data: customer });
  });

  // Get Single Customer Profile
  app.get("/customers/:id", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    const customer = await Customer.findOne({ _id: request.params.id, organizationId: orgId });
    if (!customer) return reply.code(404).send({ success: false, message: "Customer not found" });
    return reply.send({ success: true, data: customer });
  });
}
