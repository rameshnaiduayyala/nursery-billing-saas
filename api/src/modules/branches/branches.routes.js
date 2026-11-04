import { listBranches, createBranch } from "./branches.controller.js";

export default async function branchRoutes(app) {
  app.get("/branches", listBranches);
  app.post("/branches", createBranch);
}
