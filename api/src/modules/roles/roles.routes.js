import {
  listRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  listPermissions,
  createPermission,
} from "./roles.controller.js";

export default async function roleRoutes(app) {
  // Roles CRUD
  app.get("/roles", listRoles);
  app.get("/roles/:id", getRoleById);
  app.post("/roles", createRole);
  app.patch("/roles/:id", updateRole);
  app.delete("/roles/:id", deleteRole);

  // Permissions Catalog
  app.get("/roles/permissions", listPermissions);
  app.post("/roles/permissions", createPermission);
}
