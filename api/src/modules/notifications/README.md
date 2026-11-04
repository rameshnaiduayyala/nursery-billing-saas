# Notifications module

Suggested files:
- `notifications.routes.js`: Fastify route registration and HTTP schemas.
- `notifications.controller.js`: HTTP request/response mapping.
- `notifications.service.js`: Business rules and Prisma transactions.
- `notifications.repository.js`: Tenant-scoped database access.
- `notifications.schema.js`: Zod request validation.

All queries must derive `organizationId` and permitted `branchId` values from the authenticated server-side context. Never trust tenant identifiers supplied by the browser.
