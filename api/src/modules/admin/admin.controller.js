import { Organization, Branch, User } from "../../models/index.js";

// List all registered nursery businesses
export async function listOrganizations(request, reply) {
  const orgs = await Organization.find().sort({ createdAt: -1 });
  return reply.send({ success: true, data: orgs });
}

// Approve or Reject or Suspend registration
export async function updateOrganizationStatus(request, reply) {
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
}

// Platform metrics
export async function getPlatformMetrics(_request, reply) {
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
}

