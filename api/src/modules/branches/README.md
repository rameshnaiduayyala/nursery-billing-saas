# Branches module

Suggested files:
- `branches.routes.js`: Fastify route registration and HTTP schemas.
- `branches.controller.js`: HTTP request/response mapping.
- `branches.service.js`: Business rules and Prisma transactions.
- `branches.repository.js`: Tenant-scoped database access.
- `branches.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
