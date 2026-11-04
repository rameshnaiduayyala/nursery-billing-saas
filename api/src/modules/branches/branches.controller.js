import { Branch } from "../../models/index.js";
import { z } from "zod";

const branchSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  phone: z.string().optional().nullable(),
  address: z.any().optional(),
  isDefault: z.boolean().default(false),
});

export async function listBranches(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const branches = await Branch.find({ organizationId: orgId }).sort({ createdAt: -1 });
  return reply.send({ success: true, data: branches });
}

export async function createBranch(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = branchSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const branch = await Branch.create({
    ...parsed.data,
    organizationId: orgId,
  });

  return reply.code(201).send({ success: true, data: branch });
}

