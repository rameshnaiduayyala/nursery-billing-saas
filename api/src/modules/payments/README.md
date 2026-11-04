# Payments module

Suggested files:
- `payments.routes.js`: Fastify route registration and HTTP schemas.
- `payments.controller.js`: HTTP request/response mapping.
- `payments.service.js`: Business rules and Prisma transactions.
- `payments.repository.js`: Tenant-scoped database access.
- `payments.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
