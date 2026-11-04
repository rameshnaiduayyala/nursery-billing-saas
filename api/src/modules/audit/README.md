# Audit module

Suggested files:
- `audit.routes.js`: Fastify route registration and HTTP schemas.
- `audit.controller.js`: HTTP request/response mapping.
- `audit.service.js`: Business rules and Prisma transactions.
- `audit.repository.js`: Tenant-scoped database access.
- `audit.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
