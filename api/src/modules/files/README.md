# Files module

Suggested files:
- `files.routes.js`: Fastify route registration and HTTP schemas.
- `files.controller.js`: HTTP request/response mapping.
- `files.service.js`: Business rules and Prisma transactions.
- `files.repository.js`: Tenant-scoped database access.
- `files.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
