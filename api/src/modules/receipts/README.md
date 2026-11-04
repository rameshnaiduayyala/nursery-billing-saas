# Receipts module

Suggested files:
- `receipts.routes.js`: Fastify route registration and HTTP schemas.
- `receipts.controller.js`: HTTP request/response mapping.
- `receipts.service.js`: Business rules and Prisma transactions.
- `receipts.repository.js`: Tenant-scoped database access.
- `receipts.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
