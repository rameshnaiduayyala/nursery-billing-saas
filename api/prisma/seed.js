import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const permissions = [
  "organization.manage", "branch.create", "branch.update", "employee.invite",
  "customer.create", "customer.view", "quotation.create", "quotation.approve",
  "invoice.create", "invoice.issue", "invoice.cancel", "payment.create",
  "payment.refund", "report.view", "settings.manage",
];

try {
  for (const key of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key.replaceAll(".", " ") },
    });
  }
  console.log(`Seeded ${permissions.length} permissions.`);
} finally {
  await prisma.$disconnect();
}
