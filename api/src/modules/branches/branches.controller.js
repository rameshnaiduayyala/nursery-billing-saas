import { Branch } from "../../models/index.js";
import { z } from "zod";

const branchSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  phone: z.string().optional().nullable(),
  address: z.any().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

const updateBranchSchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  address: z.any().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// 1. List all branches for this organization
export async function listBranches(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const branches = await Branch.find({ organizationId: orgId }).sort({ isDefault: -1, createdAt: -1 });
  return reply.send({ success: true, data: branches });
}

// 2. Get single branch by ID
export async function getBranchById(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const branch = await Branch.findOne({ _id: request.params.id, organizationId: orgId });
  if (!branch) return reply.code(404).send({ success: false, message: "Branch not found" });

  return reply.send({ success: true, data: branch });
}

// 3. Create a new branch
export async function createBranch(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = branchSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const cleanCode = parsed.data.code.trim().toUpperCase();

  // Check code uniqueness within this organization
  const existingCode = await Branch.findOne({ organizationId: orgId, code: cleanCode });
  if (existingCode) {
    return reply.code(409).send({ success: false, message: `Branch code "${cleanCode}" is already in use by another branch` });
  }

  // If this branch is set as default, remove default from previous default branch
  if (parsed.data.isDefault) {
    await Branch.updateMany({ organizationId: orgId }, { isDefault: false });
  }

  const branch = await Branch.create({
    ...parsed.data,
    code: cleanCode,
    organizationId: orgId,
  });

  return reply.code(201).send({ success: true, message: "Branch created successfully", data: branch });
}

// 4. Update existing branch
export async function updateBranch(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const branch = await Branch.findOne({ _id: request.params.id, organizationId: orgId });
  if (!branch) return reply.code(404).send({ success: false, message: "Branch not found" });

  const parsed = updateBranchSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  // If code is being changed, ensure uniqueness
  if (parsed.data.code) {
    const cleanCode = parsed.data.code.trim().toUpperCase();
    if (cleanCode !== branch.code) {
      const existing = await Branch.findOne({ organizationId: orgId, code: cleanCode });
      if (existing) {
        return reply.code(409).send({ success: false, message: `Branch code "${cleanCode}" is already in use` });
      }
      branch.code = cleanCode;
    }
  }

  if (parsed.data.name !== undefined) branch.name = parsed.data.name;
  if (parsed.data.phone !== undefined) branch.phone = parsed.data.phone;
  if (parsed.data.address !== undefined) branch.address = parsed.data.address;
  if (parsed.data.isActive !== undefined) branch.isActive = parsed.data.isActive;

  if (parsed.data.isDefault) {
    await Branch.updateMany({ organizationId: orgId, _id: { $ne: branch._id } }, { isDefault: false });
    branch.isDefault = true;
  }

  await branch.save();

  return reply.send({ success: true, message: "Branch updated successfully", data: branch });
}

// 5. Delete or deactivate branch
export async function deleteBranch(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const branch = await Branch.findOne({ _id: request.params.id, organizationId: orgId });
  if (!branch) return reply.code(404).send({ success: false, message: "Branch not found" });

  if (branch.isDefault) {
    return reply.code(400).send({
      success: false,
      message: "The primary default branch cannot be deleted. Please set another branch as default first.",
    });
  }

  // Soft delete / permanent delete
  await Branch.deleteOne({ _id: branch._id });

  return reply.send({ success: true, message: `Branch "${branch.name}" deleted successfully` });
}
