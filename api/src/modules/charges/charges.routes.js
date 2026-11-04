import { ChargeTemplate } from "../../models/ChargeTemplate.js";
import { z } from "zod";

const chargeTemplateSchema = z.object({
  chargeType: z.enum(["LOADING", "UNLOADING", "TRANSPORT", "LABOUR", "PACKAGING", "VEHICLE", "OTHER"]),
  name: z.string().min(1),
  calculationType: z.enum(["FIXED", "PER_UNIT", "PER_BAG", "PER_TONNE", "PER_VEHICLE", "PER_DAY", "PER_WORKER", "PERCENTAGE"]).default("FIXED"),
  defaultRate: z.number().default(0),
  isDefault: z.boolean().default(false),
});

export default async function chargeRoutes(app) {
  app.get("/charges/templates", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const templates = await ChargeTemplate.find({ organizationId: orgId, isActive: true });
    return reply.send({ success: true, data: templates });
  });

  app.post("/charges/templates", async (request, reply) => {
    const orgId = request.headers["x-organization-id"];
    if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

    const parsed = chargeTemplateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
    }

    const template = await ChargeTemplate.create({
      ...parsed.data,
      organizationId: orgId,
    });

    return reply.code(201).send({ success: true, data: template });
  });
}

