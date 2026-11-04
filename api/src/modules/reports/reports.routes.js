import { getOverviewReport, getBranchReport, getOutstandingReport } from "./reports.controller.js";

export default async function reportRoutes(app) {
  // 1. Executive Dashboard Overview
  app.get("/reports/overview", getOverviewReport);

  // 2. Branch Performance Comparison Report
  app.get("/reports/branches", getBranchReport);

  // 3. Customer Outstanding Balances Report
  app.get("/reports/outstanding", getOutstandingReport);
}
