import { z } from "zod";
import bcrypt from "bcryptjs";
import { User, Membership, Role } from "../../models/index.js";

const inviteEmployeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  roleKey: z.enum(["BRANCH_MANAGER", "ACCOUNTANT", "BILLING_STAFF", "GENERAL_STAFF", "OWNER"]).default("BILLING_STAFF"),
  branchIds: z.array(z.string()).min(1),
  password: z.string().min(8).default("Password@123"),
});

export async function listEmployees(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const memberships = await Membership.find({ organizationId: orgId })
    .populate("userId", "name email phone isActive createdAt")
    .populate("roleId", "name key permissions")
    .populate("branchAccess.branchId", "name code")
    .sort({ createdAt: -1 });

  const employees = memberships.map((m) => ({
    membershipId: m._id,
    user: m.userId,
    role: m.roleId,
    status: m.status,
    branchAccess: m.branchAccess,
    createdAt: m.createdAt,
  }));

  return reply.send({ success: true, data: employees });
}

export async function inviteEmployee(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = inviteEmployeeSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const { name, email, phone, roleKey, branchIds, password } = parsed.data;

  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      isActive: true,
    });
  }

  const existingMembership = await Membership.findOne({ userId: user._id, organizationId: orgId });
  if (existingMembership) {
    return reply.code(409).send({ success: false, message: "User is already an employee in this organization" });
  }

  let role = await Role.findOne({ organizationId: orgId, key: roleKey });
  if (!role) {
    role = await Role.create({
      organizationId: orgId,
      name: roleKey.replace("_", " "),
      key: roleKey,
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
    message: "Employee successfully added to nursery workspace",
    data: {
      membershipId: membership._id,
      user: { name: user.name, email: user.email },
      role: role.name,
    },
  });
}

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

