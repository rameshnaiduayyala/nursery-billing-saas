import {
  listRoles,
  listPermissions,
  createRole,
  updateRole,
  deleteRole,
} from "./roles.controller.js";

export default async function roleRoutes(app) {
  // Roles CRUD
  app.get("/roles", listRoles);
  app.get("/roles/permissions", listPermissions);
  app.post("/roles", createRole);
  app.patch("/roles/:id", updateRole);
  app.delete("/roles/:id", deleteRole);
}

