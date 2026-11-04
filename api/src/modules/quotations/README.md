# Quotations module

Suggested files:
- `quotations.routes.js`: Fastify route registration and HTTP schemas.
- `quotations.controller.js`: HTTP request/response mapping.
- `quotations.service.js`: Business rules and Prisma transactions.
- `quotations.repository.js`: Tenant-scoped database access.
- `quotations.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
