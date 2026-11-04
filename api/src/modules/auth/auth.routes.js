import { register, login } from "./auth.controller.js";

export default async function authRoutes(app) {
  app.post("/auth/register", register);
  app.post("/auth/login", login);
}
