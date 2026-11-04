# Admin module

Suggested files:
- `admin.routes.js`: Fastify route registration and HTTP schemas.
- `admin.controller.js`: HTTP request/response mapping.
- `admin.service.js`: Business rules and Prisma transactions.
- `admin.repository.js`: Tenant-scoped database access.
- `admin.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
