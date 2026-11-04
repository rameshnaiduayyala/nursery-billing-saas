import { z } from "zod";
import bcrypt from "bcryptjs";
import { User, Organization, Branch, Role, Membership, Notification } from "../../models/index.js";

const registerSchema = z.object({
  businessName: z.string().min(2),
  ownerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  businessAddress: z.any().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(request, reply) {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const { businessName, ownerName, email, phone, password, city, state, pincode } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return reply.code(409).send({ success: false, message: "Email already registered" });
  }

  const slug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);

  const passwordHash = await bcrypt.hash(password, 10);

  // 1. Create User
  const user = await User.create({
    name: ownerName,
    email,
    phone,
    passwordHash,
    isSuperAdmin: false,
    isActive: true,
  });

  // 2. Create Organization in PENDING status (requires platform Super Admin verification & approval)
  const organization = await Organization.create({
    name: businessName,
    slug,
    status: "PENDING",
    phone,
    email,
    address: { city, state, pincode },
  });

  // 3. Create Default Main Branch
  const branch = await Branch.create({
    organizationId: organization._id,
    name: "Main Branch",
    code: "MAIN",
    phone,
    isDefault: true,
    isActive: true,
  });

  // 4. Create Default Owner Role
  const ownerRole = await Role.create({
    organizationId: organization._id,
    name: "Owner",
    key: "OWNER",
    isSystem: true,
    permissions: ["*"],
  });

  // 5. Create Membership
  const membership = await Membership.create({
    userId: user._id,
    organizationId: organization._id,
    roleId: ownerRole._id,
    status: "ACTIVE",
    branchAccess: [{ branchId: branch._id, isDefault: true }],
  });

  // 6. Record System notification for registration
  try {
    await Notification.create({
      organizationId: organization._id,
      userId: user._id,
      title: "Registration Submitted",
      message: `Your nursery "${businessName}" registration has been submitted and is currently PENDING approval by platform administration.`,
      type: "APPROVAL",
    });
  } catch (err) {
    // Non-blocking log
  }

  return reply.code(201).send({
    success: true,
    message: "Nursery registered successfully. Status is Pending Admin Approval.",
    data: {
      userId: user._id,
      user: { name: user.name, email: user.email },
      organization: {
        id: organization._id,
        name: organization.name,
        slug: organization.slug,
        status: organization.status, // "PENDING"
      },
      branch: { id: branch._id, name: branch.name, code: branch.code },
    },
  });
}

export async function login(request, reply) {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Invalid credentials format" });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !user.isActive) {
    return reply.code(401).send({ success: false, message: "Invalid email or password" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return reply.code(401).send({ success: false, message: "Invalid email or password" });
  }

  // Super Admin check: global administrator has NO nursery and NO branches
  if (user.isSuperAdmin) {
    return reply.send({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isSuperAdmin: true,
        },
        workspaces: [],
        role: "SUPER_ADMIN",
      },
    });
  }

  // Standard nursery owner or employee with organization memberships
  const memberships = await Membership.find({ userId: user._id, status: "ACTIVE" })
    .populate("organizationId")
    .populate("roleId");

  if (!memberships || memberships.length === 0) {
    return reply.code(403).send({
      success: false,
      message: "No active nursery organization membership found for this account.",
    });
  }

  // Check nursery approval status
  const primaryWorkspace = memberships[0];
  const org = primaryWorkspace?.organizationId;

  if (org) {
    if (org.status === "PENDING") {
      return reply.code(403).send({
        success: false,
        code: "PENDING_APPROVAL",
        message: `Your nursery "${org.name}" is pending approval. The platform Super Admin must verify and approve your registration before you can access business features.`,
        data: {
          organization: {
            id: org._id,
            name: org.name,
            status: org.status,
          },
        },
      });
    }

    if (org.status === "REJECTED") {
      return reply.code(403).send({
        success: false,
        code: "REJECTED",
        message: `Your nursery "${org.name}" registration was rejected. Please contact support.`,
      });
    }

    if (org.status === "SUSPENDED") {
      return reply.code(403).send({
        success: false,
        code: "SUSPENDED",
        message: `Your nursery "${org.name}" account is currently suspended. Please contact platform administration.`,
      });
    }
  }

  return reply.send({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isSuperAdmin: false,
      },
      workspaces: memberships.map((m) => ({
        membershipId: m._id,
        organization: m.organizationId,
        role: m.roleId,
        branchAccess: m.branchAccess,
      })),
    },
  });
}
