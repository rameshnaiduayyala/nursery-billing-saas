import { Organization, Branch, User, Membership } from "../../models/index.js";
import { z } from "zod";

export default async function adminRoutes(app) {
  // List all registered nursery businesses
  app.get("/admin/organizations", async (request, reply) => {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    return reply.send({ success: true, data: orgs });
  });

  // Approve or Reject or Suspend registration
  app.patch("/admin/organizations/:id/status", async (request, reply) => {
    const { status } = request.body || {};
    if (!["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].includes(status)) {
      return reply.code(400).send({ success: false, message: "Invalid status value" });
    }

    const org = await Organization.findByIdAndUpdate(
      request.params.id,
      { status },
      { new: true }
    );

    if (!org) return reply.code(404).send({ success: false, message: "Organization not found" });

    return reply.send({ success: true, message: `Organization status updated to ${status}`, data: org });
  });

  // Platform metrics
  app.get("/admin/metrics", async (_request, reply) => {
    const [totalOrgs, activeOrgs, totalBranches, totalUsers] = await Promise.all([
      Organization.countDocuments(),
      Organization.countDocuments({ status: "APPROVED" }),
      Branch.countDocuments(),
      User.countDocuments(),
    ]);

    return reply.send({
      success: true,
      data: {
        totalOrgs,
        activeOrgs,
        pendingOrgs: totalOrgs - activeOrgs,
        totalBranches,
        totalUsers,
      },
    });
  });
}

