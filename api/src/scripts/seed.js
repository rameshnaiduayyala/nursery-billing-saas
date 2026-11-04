import "dotenv/config";
import mongoose from "mongoose";
import { Permission } from "../models/Permission.js";

const permissions = [
  "organization.manage", "branch.create", "branch.update", "employee.invite",
  "customer.create", "customer.view", "quotation.create", "quotation.approve",
  "invoice.create", "invoice.issue", "invoice.cancel", "payment.create",
  "payment.refund", "report.view", "settings.manage",
];

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/nursery_management";

try {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB for seeding...");

  for (const key of permissions) {
    await Permission.findOneAndUpdate(
      { key },
      { key, description: key.replaceAll(".", " ") },
      { upsert: true, new: true }
    );
  }

  console.log(`Successfully seeded ${permissions.length} permissions.`);
} catch (error) {
  console.error("Seeding error:", error);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}

