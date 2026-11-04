# Middleware and request context

Implement:
- authenticate: verify access JWT and load active user.
- tenant-context: resolve active organization membership from server-validated membership selection.
- branch-access: ensure requested branch belongs to active organization and user membership.
- authorize: enforce role permissions.
- customer-portal-auth: resolve CustomerUser link and restrict portal queries to that customer.

Do not accept an organization ID from request body as authorization evidence.
