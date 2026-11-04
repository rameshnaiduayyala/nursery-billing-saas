# Roles module

Suggested files:
- `roles.routes.js`: Fastify route registration and HTTP schemas.
- `roles.controller.js`: HTTP request/response mapping.
- `roles.service.js`: Business rules and Prisma transactions.
- `roles.repository.js`: Tenant-scoped database access.
- `roles.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
