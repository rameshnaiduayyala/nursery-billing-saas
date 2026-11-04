import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Organization, Branch, Role, Membership, Permission } from "../models/index.js";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/nursery_management";

const permissionsList = [
  "*",
  "organization.manage",
  "branch.create",
  "branch.update",
  "employee.invite",
  "customer.create",
  "customer.view",
  "quotation.create",
  "quotation.approve",
  "invoice.create",
  "invoice.issue",
  "invoice.cancel",
  "payment.create",
  "payment.refund",
  "report.view",
  "settings.manage",
  "platform.admin",
];

async function seed() {
  try {
    console.log("Connecting to database at:", mongoUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB.");

    // 1. Seed Permissions
    for (const key of permissionsList) {
      await Permission.findOneAndUpdate(
        { key },
        { key, description: key === "*" ? "Full System Access" : key.replaceAll(".", " ") },
        { upsert: true, new: true }
      );
    }
    console.log(`Seeded ${permissionsList.length} permissions.`);

    // 2. Super Admin Credentials
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@nurseryos.com";
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";
    const superAdminName = "Platform Super Admin";
    const superAdminPhone = "+91 99999 00000";

    const passwordHash = await bcrypt.hash(superAdminPassword, 10);

    // Upsert Super Admin User
    const superAdminUser = await User.findOneAndUpdate(
      { email: superAdminEmail },
      {
        name: superAdminName,
        email: superAdminEmail,
        phone: superAdminPhone,
        passwordHash,
        isActive: true,
      },
      { upsert: true, new: true }
    );
    console.log(`Super Admin user ready: ${superAdminUser.email}`);

    // 3. Platform Administration Tenant Organization
    const platformOrg = await Organization.findOneAndUpdate(
      { slug: "platform-administration" },
      {
        name: "NurseryOS Platform HQ",
        slug: "platform-administration",
        status: "APPROVED",
        phone: superAdminPhone,
        email: superAdminEmail,
        address: { city: "Central HQ", state: "Administration", pincode: "000000" },
      },
      { upsert: true, new: true }
    );

    // 4. HQ Branch
    const hqBranch = await Branch.findOneAndUpdate(
      { organizationId: platformOrg._id, code: "HQ" },
      {
        organizationId: platformOrg._id,
        name: "Central Platform Branch",
        code: "HQ",
        phone: superAdminPhone,
        isDefault: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    // 5. Super Admin Role
    const superAdminRole = await Role.findOneAndUpdate(
      { organizationId: platformOrg._id, key: "SUPER_ADMIN" },
      {
        organizationId: platformOrg._id,
        name: "Super Administrator",
        key: "SUPER_ADMIN",
        isSystem: true,
        permissions: ["*"],
      },
      { upsert: true, new: true }
    );

    // 6. Membership
    await Membership.findOneAndUpdate(
      { userId: superAdminUser._id, organizationId: platformOrg._id },
      {
        userId: superAdminUser._id,
        organizationId: platformOrg._id,
        roleId: superAdminRole._id,
        status: "ACTIVE",
        branchAccess: [{ branchId: hqBranch._id, isDefault: true }],
      },
      { upsert: true, new: true }
    );

    console.log("--------------------------------------------------");
    console.log("SUPER ADMIN SEEDED SUCCESSFULLY:");
    console.log("Email:    " + superAdminEmail);
    console.log("Password: " + superAdminPassword);
    console.log("Role:     SUPER_ADMIN (Full Platform Privileges)");
    console.log("Tenant:   " + platformOrg.name);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("Seeding error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
