# Invoices module

Suggested files:
- `invoices.routes.js`: Fastify route registration and HTTP schemas.
- `invoices.controller.js`: HTTP request/response mapping.
- `invoices.service.js`: Business rules and Prisma transactions.
- `invoices.repository.js`: Tenant-scoped database access.
- `invoices.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
