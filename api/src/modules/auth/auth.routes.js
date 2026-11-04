import { z } from "zod";
import bcrypt from "bcryptjs";
import { User, Organization, Branch, Role, Membership } from "../../models/index.js";

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

export default async function authRoutes(app) {
  // Register nursery business + owner user + default branch + owner role
  app.post("/auth/register", async (request, reply) => {
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

    // Create User
    const user = await User.create({
      name: ownerName,
      email,
      phone,
      passwordHash,
      isActive: true,
    });

    // Create Organization (Status APPROVED for immediate usability or PENDING for verification)
    const organization = await Organization.create({
      name: businessName,
      slug,
      status: "APPROVED",
      phone,
      email,
      address: { city, state, pincode },
    });

    // Create Default Main Branch
    const branch = await Branch.create({
      organizationId: organization._id,
      name: "Main Branch",
      code: "MAIN",
      phone,
      isDefault: true,
      isActive: true,
    });

    // Create Default Roles
    const ownerRole = await Role.create({
      organizationId: organization._id,
      name: "Owner",
      key: "OWNER",
      isSystem: true,
      permissions: ["*"],
    });

    // Create Membership
    const membership = await Membership.create({
      userId: user._id,
      organizationId: organization._id,
      roleId: ownerRole._id,
      status: "ACTIVE",
      branchAccess: [{ branchId: branch._id, isDefault: true }],
    });

    return reply.code(201).send({
      success: true,
      message: "Nursery business registered successfully.",
      data: {
        userId: user._id,
        user: { name: user.name, email: user.email },
        organization: { id: organization._id, name: organization.name, slug: organization.slug, status: organization.status },
        branch: { id: branch._id, name: branch.name, code: branch.code },
      },
    });
  });

  // Login
  app.post("/auth/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, message: "Invalid credentials format" });
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return reply.code(401).send({ success: false, message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return reply.code(401).send({ success: false, message: "Invalid email or password" });
    }

    const memberships = await Membership.find({ userId: user._id, status: "ACTIVE" })
      .populate("organizationId")
      .populate("roleId");

    return reply.send({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
        workspaces: memberships.map((m) => ({
          membershipId: m._id,
          organization: m.organizationId,
          role: m.roleId,
          branchAccess: m.branchAccess,
        })),
      },
    });
  });
}
