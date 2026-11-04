# Ledger module

Suggested files:
- `ledger.routes.js`: Fastify route registration and HTTP schemas.
- `ledger.controller.js`: HTTP request/response mapping.
- `ledger.service.js`: Business rules and Prisma transactions.
- `ledger.repository.js`: Tenant-scoped database access.
- `ledger.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
