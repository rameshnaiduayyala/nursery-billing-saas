# Employees module

Suggested files:
- `employees.routes.js`: Fastify route registration and HTTP schemas.
- `employees.controller.js`: HTTP request/response mapping.
- `employees.service.js`: Business rules and Prisma transactions.
- `employees.repository.js`: Tenant-scoped database access.
- `employees.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
