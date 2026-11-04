import {
  listBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "./branches.controller.js";

export default async function branchRoutes(app) {
  app.get("/branches", listBranches);
  app.get("/branches/:id", getBranchById);
  app.post("/branches", createBranch);
  app.patch("/branches/:id", updateBranch);
  app.delete("/branches/:id", deleteBranch);
}
