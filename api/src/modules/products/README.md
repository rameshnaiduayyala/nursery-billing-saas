# Products module

Suggested files:
- `products.routes.js`: Fastify route registration and HTTP schemas.
- `products.controller.js`: HTTP request/response mapping.
- `products.service.js`: Business rules and Prisma transactions.
- `products.repository.js`: Tenant-scoped database access.
- `products.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
