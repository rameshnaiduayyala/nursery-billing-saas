# Customer Portal module

Suggested files:
- `customer-portal.routes.js`: Fastify route registration and HTTP schemas.
- `customer-portal.controller.js`: HTTP request/response mapping.
- `customer-portal.service.js`: Business rules and Prisma transactions.
- `customer-portal.repository.js`: Tenant-scoped database access.
- `customer-portal.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
