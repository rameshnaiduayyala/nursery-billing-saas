import { Role } from "../../models/Role.js";
import { Permission } from "../../models/Permission.js";
import { z } from "zod";

const createRoleSchema = z.object({
  name: z.string().min(1),
  key: z.string().min(1),
  permissions: z.array(z.string()).default([]),
});

const updateRoleSchema = z.object({
  name: z.string().min(1).optional(),
  permissions: z.array(z.string()).optional(),
});

// List all roles for the organization
export async function listRoles(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const roles = await Role.find({ organizationId: orgId }).sort({ isSystem: -1, name: 1 });
  return reply.send({ success: true, data: roles });
}

// Get standard system permissions catalog
export async function listPermissions(_request, reply) {
  const permissions = await Permission.find().sort({ key: 1 });
  // If empty, return standard defaults
  if (!permissions || permissions.length === 0) {
    const defaultPermissions = [
      { key: "inventory.view", description: "View plant inventory catalog" },
      { key: "inventory.manage", description: "Create and update plant items" },
      { key: "quotations.create", description: "Create and send quotations" },
      { key: "invoices.create", description: "Generate and manage non-GST invoices" },
      { key: "payments.record", description: "Record and allocate customer payments" },
      { key: "expenses.manage", description: "Record and review branch expenses" },
      { key: "reports.view", description: "Access analytics and financial reports" },
      { key: "employees.manage", description: "Invite and manage employee access" },
      { key: "settings.manage", description: "Configure organization and branch settings" },
    ];
    return reply.send({ success: true, data: defaultPermissions });
  }
  return reply.send({ success: true, data: permissions });
}

// Create a custom role
export async function createRole(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = createRoleSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const existing = await Role.findOne({ organizationId: orgId, key: parsed.data.key.toUpperCase() });
  if (existing) {
    return reply.code(409).send({ success: false, message: "A role with this key already exists" });
  }

  const role = await Role.create({
    organizationId: orgId,
    name: parsed.data.name,
    key: parsed.data.key.toUpperCase(),
    isSystem: false,
    permissions: parsed.data.permissions,
  });

  return reply.code(201).send({ success: true, data: role });
}

// Update a custom role
export async function updateRole(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const role = await Role.findOne({ _id: request.params.id, organizationId: orgId });
  if (!role) return reply.code(404).send({ success: false, message: "Role not found" });

  if (role.isSystem) {
    return reply.code(403).send({ success: false, message: "System predefined roles cannot be modified" });
  }

  const parsed = updateRoleSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  if (parsed.data.name) role.name = parsed.data.name;
  if (parsed.data.permissions) role.permissions = parsed.data.permissions;
  await role.save();

  return reply.send({ success: true, data: role });
}

// Delete custom role
export async function deleteRole(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const role = await Role.findOne({ _id: request.params.id, organizationId: orgId });
  if (!role) return reply.code(404).send({ success: false, message: "Role not found" });

  if (role.isSystem) {
    return reply.code(403).send({ success: false, message: "System predefined roles cannot be deleted" });
  }

  await Role.deleteOne({ _id: role._id });
  return reply.send({ success: true, message: "Role deleted successfully" });
}
