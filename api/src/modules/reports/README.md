# Reports module

Suggested files:
- `reports.routes.js`: Fastify route registration and HTTP schemas.
- `reports.controller.js`: HTTP request/response mapping.
- `reports.service.js`: Business rules and Prisma transactions.
- `reports.repository.js`: Tenant-scoped database access.
- `reports.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
