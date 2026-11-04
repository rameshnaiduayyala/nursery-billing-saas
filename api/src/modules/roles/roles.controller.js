import { Role } from "../../models/Role.js";
import { Permission } from "../../models/Permission.js";
import { Membership } from "../../models/Membership.js";
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

const permissionSchema = z.object({
  key: z.string().min(2),
  description: z.string().optional(),
});

// 1. List all roles for the organization
export async function listRoles(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const roles = await Role.find({ organizationId: orgId }).sort({ isSystem: -1, name: 1 });
  return reply.send({ success: true, data: roles });
}

// 2. Get single role by ID
export async function getRoleById(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const role = await Role.findOne({ _id: request.params.id, organizationId: orgId });
  if (!role) return reply.code(404).send({ success: false, message: "Role not found" });

  return reply.send({ success: true, data: role });
}

// 3. Create a new custom role
export async function createRole(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = createRoleSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const cleanKey = parsed.data.key.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");

  const existing = await Role.findOne({ organizationId: orgId, key: cleanKey });
  if (existing) {
    return reply.code(409).send({ success: false, message: `A role with identifier "${cleanKey}" already exists` });
  }

  const role = await Role.create({
    organizationId: orgId,
    name: parsed.data.name.trim(),
    key: cleanKey,
    isSystem: false,
    permissions: parsed.data.permissions,
  });

  return reply.code(201).send({ success: true, message: `Role "${role.name}" created successfully`, data: role });
}

// 4. Update an existing role (custom roles only)
export async function updateRole(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const role = await Role.findOne({ _id: request.params.id, organizationId: orgId });
  if (!role) return reply.code(404).send({ success: false, message: "Role not found" });

  if (role.isSystem && role.key === "OWNER") {
    return reply.code(403).send({ success: false, message: "The primary Owner role cannot be modified" });
  }

  const parsed = updateRoleSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  if (parsed.data.name) role.name = parsed.data.name.trim();
  if (parsed.data.permissions !== undefined) role.permissions = parsed.data.permissions;
  await role.save();

  return reply.send({ success: true, message: `Role "${role.name}" updated successfully`, data: role });
}

// 5. Delete a custom role
export async function deleteRole(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const role = await Role.findOne({ _id: request.params.id, organizationId: orgId });
  if (!role) return reply.code(404).send({ success: false, message: "Role not found" });

  if (role.isSystem) {
    return reply.code(403).send({ success: false, message: "System predefined roles cannot be deleted" });
  }

  // Check if any employees are currently assigned to this role
  const assignedCount = await Membership.countDocuments({ organizationId: orgId, roleId: role._id });
  if (assignedCount > 0) {
    return reply.code(400).send({
      success: false,
      message: `Cannot delete role "${role.name}" because it is currently assigned to ${assignedCount} employee(s). Please reassign them first.`,
    });
  }

  await Role.deleteOne({ _id: role._id });
  return reply.send({ success: true, message: `Role "${role.name}" deleted successfully` });
}

// 6. List all available system permissions catalog
export async function listPermissions(_request, reply) {
  let permissions = await Permission.find().sort({ key: 1 });
  if (!permissions || permissions.length === 0) {
    const defaultCatalog = [
      { key: "inventory.view", description: "View plant inventory catalog & stock levels" },
      { key: "inventory.manage", description: "Create, edit, and adjust plant varieties and pot rates" },
      { key: "quotations.create", description: "Create and draft quotations" },
      { key: "quotations.manage", description: "Accept, decline, convert or revise quotations" },
      { key: "invoices.create", description: "Issue non-GST invoices directly or from quotations" },
      { key: "invoices.cancel", description: "Cancel or adjust issued non-GST invoices" },
      { key: "payments.record", description: "Record cash, UPI, bank payments and issue receipts" },
      { key: "expenses.record", description: "Post daily nursery expenses and transport vouchers" },
      { key: "expenses.approve", description: "Approve or audit branch operational expenses" },
      { key: "customers.manage", description: "Create customer profiles, credit limits, and ledgers" },
      { key: "reports.view", description: "Access sales reports, branch comparisons & ledger statements" },
      { key: "employees.manage", description: "Invite staff, configure roles, and assign branch access" },
      { key: "branches.manage", description: "Create, update, activate, and deactivate nursery branches" },
      { key: "settings.manage", description: "Configure organization settings and numbering sequences" },
    ];
    // Seed catalog in background
    try {
      await Permission.insertMany(defaultCatalog, { ordered: false });
      permissions = await Permission.find().sort({ key: 1 });
    } catch {
      return reply.send({ success: true, data: defaultCatalog });
    }
  }
  return reply.send({ success: true, data: permissions });
}

// 7. Create a new custom permission
export async function createPermission(request, reply) {
  const parsed = permissionSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const cleanKey = parsed.data.key.trim().toLowerCase();
  const existing = await Permission.findOne({ key: cleanKey });
  if (existing) {
    return reply.code(409).send({ success: false, message: `Permission "${cleanKey}" already exists` });
  }

  const permission = await Permission.create({
    key: cleanKey,
    description: parsed.data.description || null,
  });

  return reply.code(201).send({ success: true, message: "Permission created successfully", data: permission });
}
