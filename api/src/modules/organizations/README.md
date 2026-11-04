# Organizations module

Suggested files:
- `organizations.routes.js`: Fastify route registration and HTTP schemas.
- `organizations.controller.js`: HTTP request/response mapping.
- `organizations.service.js`: Business rules and Prisma transactions.
- `organizations.repository.js`: Tenant-scoped database access.
- `organizations.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
