# Customers module

Suggested files:
- `customers.routes.js`: Fastify route registration and HTTP schemas.
- `customers.controller.js`: HTTP request/response mapping.
- `customers.service.js`: Business rules and Prisma transactions.
- `customers.repository.js`: Tenant-scoped database access.
- `customers.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
