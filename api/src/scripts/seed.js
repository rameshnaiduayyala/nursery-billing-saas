import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Organization, Branch, Role, Membership, Permission } from "../models/index.js";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/nursery_management";

async function seedAllUsers() {
  try {
    console.log("Connecting to database at:", mongoUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB.");

    const defaultPassword = "Password@123";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // ==========================================
    // 1. GLOBAL SUPER ADMIN (No nursery, No branch)
    // ==========================================
    const superAdmin = await User.findOneAndUpdate(
      { email: "superadmin@nurseryos.com" },
      {
        name: "Platform Super Admin",
        email: "superadmin@nurseryos.com",
        phone: "+91 99999 00000",
        passwordHash,
        isSuperAdmin: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );
    console.log("Seeded Super Admin:", superAdmin.email);

    // ==========================================
    // 2. NURSERY BUSINESS & BRANCHES
    // ==========================================
    const organization = await Organization.findOneAndUpdate(
      { slug: "green-valley-farm" },
      {
        name: "Green Valley Farm & Wholesale Nursery",
        slug: "green-valley-farm",
        status: "APPROVED",
        phone: "+91 98221 44556",
        email: "contact@greenvalleynursery.in",
        address: { city: "Kadiyam", state: "Andhra Pradesh", pincode: "533126" },
      },
      { upsert: true, new: true }
    );

    const mainBranch = await Branch.findOneAndUpdate(
      { organizationId: organization._id, code: "MAIN" },
      {
        organizationId: organization._id,
        name: "Main Polyhouse & Farm",
        code: "MAIN",
        phone: "+91 98221 11223",
        address: { city: "Kadiyam Rural" },
        isDefault: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const highwayBranch = await Branch.findOneAndUpdate(
      { organizationId: organization._id, code: "HWY" },
      {
        organizationId: organization._id,
        name: "National Highway Depot Outlet",
        code: "HWY",
        phone: "+91 98221 44557",
        address: { city: "NH-16 Bypass" },
        isDefault: false,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    // ==========================================
    // 3. ROLES DEFINITIONS
    // ==========================================
    const rolesConfig = [
      { key: "OWNER", name: "Nursery Owner", permissions: ["*"] },
      { key: "BRANCH_MANAGER", name: "Branch Manager", permissions: ["branch.manage", "quotation.*", "invoice.*", "customer.*", "product.*"] },
      { key: "ACCOUNTANT", name: "Accountant", permissions: ["invoice.view", "payment.*", "expense.*", "report.*", "customer.ledger"] },
      { key: "BILLING_STAFF", name: "Billing Staff", permissions: ["quotation.create", "quotation.view", "invoice.create", "invoice.view", "customer.create"] },
      { key: "GENERAL_STAFF", name: "General Staff", permissions: ["product.view", "quotation.view"] },
    ];

    const roleMap = {};
    for (const r of rolesConfig) {
      const role = await Role.findOneAndUpdate(
        { organizationId: organization._id, key: r.key },
        {
          organizationId: organization._id,
          name: r.name,
          key: r.key,
          isSystem: true,
          permissions: r.permissions,
        },
        { upsert: true, new: true }
      );
      roleMap[r.key] = role;
    }

    // ==========================================
    // 4. NURSERY USERS & ROLE ASSIGNMENTS
    // ==========================================
    const usersToSeed = [
      {
        email: "owner@greenvalleynursery.in",
        name: "Ramesh Patel (Owner)",
        phone: "+91 98221 44556",
        roleKey: "OWNER",
        branches: [{ branchId: mainBranch._id, isDefault: true }, { branchId: highwayBranch._id, isDefault: false }],
      },
      {
        email: "manager@greenvalleynursery.in",
        name: "Suresh Reddy (Branch Manager)",
        phone: "+91 98221 22334",
        roleKey: "BRANCH_MANAGER",
        branches: [{ branchId: mainBranch._id, isDefault: true }],
      },
      {
        email: "accountant@greenvalleynursery.in",
        name: "Pooja Sharma (Accountant)",
        phone: "+91 98221 33445",
        roleKey: "ACCOUNTANT",
        branches: [{ branchId: mainBranch._id, isDefault: true }, { branchId: highwayBranch._id, isDefault: false }],
      },
      {
        email: "billing@greenvalleynursery.in",
        name: "Vikas Kumar (Billing Staff)",
        phone: "+91 98221 55667",
        roleKey: "BILLING_STAFF",
        branches: [{ branchId: highwayBranch._id, isDefault: true }],
      },
      {
        email: "staff@greenvalleynursery.in",
        name: "Anand Verma (General Staff)",
        phone: "+91 98221 66778",
        roleKey: "GENERAL_STAFF",
        branches: [{ branchId: mainBranch._id, isDefault: true }],
      },
    ];

    for (const u of usersToSeed) {
      const user = await User.findOneAndUpdate(
        { email: u.email },
        {
          name: u.name,
          email: u.email,
          phone: u.phone,
          passwordHash,
          isSuperAdmin: false,
          isActive: true,
        },
        { upsert: true, new: true }
      );

      await Membership.findOneAndUpdate(
        { userId: user._id, organizationId: organization._id },
        {
          userId: user._id,
          organizationId: organization._id,
          roleId: roleMap[u.roleKey]._id,
          status: "ACTIVE",
          branchAccess: u.branches,
        },
        { upsert: true, new: true }
      );
      console.log(`Seeded User: ${u.email} [${u.roleKey}]`);
    }

    console.log("\n=======================================================");
    console.log("ALL TYPE USERS SEEDED SUCCESSFULLY:");
    console.log("Default Password for all seeded users: " + defaultPassword);
    console.log("-------------------------------------------------------");
    console.log("1. SUPER ADMIN (No nursery / branches):");
    console.log("   Email: superadmin@nurseryos.com");
    console.log("-------------------------------------------------------");
    console.log("2. NURSERY OWNER (All branches & permissions):");
    console.log("   Email: owner@greenvalleynursery.in");
    console.log("-------------------------------------------------------");
    console.log("3. BRANCH MANAGER (Assigned Main Branch):");
    console.log("   Email: manager@greenvalleynursery.in");
    console.log("-------------------------------------------------------");
    console.log("4. ACCOUNTANT (Payments, Ledgers, Expenses, Reports):");
    console.log("   Email: accountant@greenvalleynursery.in");
    console.log("-------------------------------------------------------");
    console.log("5. BILLING STAFF (Quotations, Invoices, Customers):");
    console.log("   Email: billing@greenvalleynursery.in");
    console.log("-------------------------------------------------------");
    console.log("6. GENERAL STAFF (Plant catalog & view access):");
    console.log("   Email: staff@greenvalleynursery.in");
    console.log("=======================================================\n");
  } catch (error) {
    console.error("Seeding error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAllUsers();
