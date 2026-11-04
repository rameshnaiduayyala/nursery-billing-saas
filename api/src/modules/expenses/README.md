# Expenses module

Suggested files:
- `expenses.routes.js`: Fastify route registration and HTTP schemas.
- `expenses.controller.js`: HTTP request/response mapping.
- `expenses.service.js`: Business rules and Prisma transactions.
- `expenses.repository.js`: Tenant-scoped database access.
- `expenses.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
