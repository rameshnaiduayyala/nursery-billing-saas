import { z } from "zod";
import bcrypt from "bcryptjs";
import { User, Membership, Role, Branch } from "../../models/index.js";

const inviteEmployeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  roleKey: z.string().min(2).default("SALES_STAFF"),
  branchIds: z.array(z.string()).min(1),
  password: z.string().min(6).default("Password@123"),
});

const updateEmployeeSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  roleKey: z.string().min(2).optional(),
  branchIds: z.array(z.string()).min(1).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  password: z.string().min(6).optional(),
});

// 1. List all employees with assigned roles and branch access
export async function listEmployees(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const memberships = await Membership.find({ organizationId: orgId })
    .populate("userId", "name email phone isActive createdAt")
    .populate("roleId", "name key permissions")
    .populate("branchAccess.branchId", "name code")
    .sort({ createdAt: -1 });

  const employees = memberships.map((m) => ({
    _id: m._id,
    membershipId: m._id,
    userId: m.userId,
    user: m.userId,
    role: m.roleId,
    roleId: m.roleId,
    status: m.status,
    branchAccess: m.branchAccess,
    createdAt: m.createdAt,
  }));

  return reply.send({ success: true, data: employees });
}

// 2. Add / Invite a new employee and allocate branches & roles
export async function inviteEmployee(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = inviteEmployeeSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const { name, email, phone, roleKey, branchIds, password } = parsed.data;

  let user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      passwordHash,
      isActive: true,
    });
  } else {
    // If user already exists, update name/phone if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();
  }

  const existingMembership = await Membership.findOne({ userId: user._id, organizationId: orgId });
  if (existingMembership) {
    return reply.code(409).send({ success: false, message: "User is already an employee in this nursery organization" });
  }

  // Find or create role
  let role = await Role.findOne({ organizationId: orgId, key: roleKey.toUpperCase() });
  if (!role) {
    role = await Role.create({
      organizationId: orgId,
      name: roleKey.replace("_", " "),
      key: roleKey.toUpperCase(),
      isSystem: false,
      permissions: [roleKey.toLowerCase()],
    });
  }

  const branchAccess = branchIds.map((bId, idx) => ({
    branchId: bId,
    isDefault: idx === 0,
  }));

  const membership = await Membership.create({
    userId: user._id,
    organizationId: orgId,
    roleId: role._id,
    status: "ACTIVE",
    branchAccess,
  });

  return reply.code(201).send({
    success: true,
    message: "Employee successfully added and assigned to branches",
    data: {
      membershipId: membership._id,
      user: { name: user.name, email: user.email },
      role: role.name,
    },
  });
}

// 3. Update staff member details, assigned role, or branch access
export async function updateEmployee(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const membership = await Membership.findOne({ _id: request.params.id, organizationId: orgId });
  if (!membership) return reply.code(404).send({ success: false, message: "Employee membership not found" });

  const parsed = updateEmployeeSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const { name, phone, roleKey, branchIds, status, password } = parsed.data;

  // Update underlying User record if name/phone/password provided
  if (name || phone || password) {
    const user = await User.findById(membership.userId);
    if (user) {
      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (password) user.passwordHash = await bcrypt.hash(password, 10);
      await user.save();
    }
  }

  // Update Role if roleKey provided
  if (roleKey) {
    let role = await Role.findOne({ organizationId: orgId, key: roleKey.toUpperCase() });
    if (!role) {
      role = await Role.create({
        organizationId: orgId,
        name: roleKey.replace("_", " "),
        key: roleKey.toUpperCase(),
        isSystem: false,
        permissions: [roleKey.toLowerCase()],
      });
    }
    membership.roleId = role._id;
  }

  // Update Branch access allocations
  if (branchIds && branchIds.length > 0) {
    membership.branchAccess = branchIds.map((bId, idx) => ({
      branchId: bId,
      isDefault: idx === 0,
    }));
  }

  if (status) {
    membership.status = status;
  }

  await membership.save();

  return reply.send({ success: true, message: "Employee details and branch assignments updated successfully" });
}

// 4. Update status toggle (ACTIVE / SUSPENDED)
export async function updateEmployeeStatus(request, reply) {
  const orgId = request.headers["x-organization-id"];
  const { status } = request.body || {};

  if (!["ACTIVE", "SUSPENDED"].includes(status)) {
    return reply.code(400).send({ success: false, message: "Status must be ACTIVE or SUSPENDED" });
  }

  const membership = await Membership.findOneAndUpdate(
    { _id: request.params.id, organizationId: orgId },
    { status },
    { new: true }
  );

  if (!membership) return reply.code(404).send({ success: false, message: "Employee membership not found" });

  return reply.send({ success: true, message: `Employee status updated to ${status}`, data: membership });
}

// 5. Delete / Remove employee from organization
export async function deleteEmployee(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const membership = await Membership.findOne({ _id: request.params.id, organizationId: orgId }).populate("roleId");
  if (!membership) return reply.code(404).send({ success: false, message: "Employee not found" });

  if (membership.roleId?.key === "OWNER") {
    const ownerCount = await Membership.countDocuments({ organizationId: orgId, roleId: membership.roleId._id });
    if (ownerCount <= 1) {
      return reply.code(400).send({ success: false, message: "Cannot remove the sole nursery owner from the organization" });
    }
  }

  await Membership.deleteOne({ _id: membership._id });

  return reply.send({ success: true, message: "Staff member removed from nursery organization" });
}
