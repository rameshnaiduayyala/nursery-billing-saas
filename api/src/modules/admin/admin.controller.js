import { Organization, Branch, User, Notification } from "../../models/index.js";

// List all registered nursery businesses
export async function listOrganizations(request, reply) {
  const orgs = await Organization.find().sort({ createdAt: -1 });
  return reply.send({ success: true, data: orgs });
}

// Approve or Reject or Suspend registration
export async function updateOrganizationStatus(request, reply) {
  const { status, remarks } = request.body || {};
  if (!["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].includes(status)) {
    return reply.code(400).send({ success: false, message: "Invalid status value. Must be PENDING, APPROVED, REJECTED, or SUSPENDED." });
  }

  const org = await Organization.findByIdAndUpdate(
    request.params.id,
    { status },
    { new: true }
  );

  if (!org) return reply.code(404).send({ success: false, message: "Organization not found" });

  // Create an automated notification for the organization
  try {
    let notifTitle = `Nursery ${status}`;
    let notifMsg = `Your nursery registration status has been updated to "${status}" by the platform administrator.`;
    if (status === "APPROVED") {
      notifTitle = "Nursery Registration Approved! 🎉";
      notifMsg = `Congratulations! Your nursery "${org.name}" has been verified and approved. You now have full access to manage branches, inventory, quotations, and non-GST invoices.`;
    } else if (status === "REJECTED") {
      notifTitle = "Registration Rejected";
      notifMsg = `Your registration for "${org.name}" was not approved. ${remarks ? `Remarks: ${remarks}` : "Please contact platform support."}`;
    }

    await Notification.create({
      organizationId: org._id,
      title: notifTitle,
      message: notifMsg,
      type: "APPROVAL",
      metadata: { remarks },
    });
  } catch (err) {
    // Non-blocking log
  }

  return reply.send({
    success: true,
    message: `Organization "${org.name}" has been successfully updated to ${status}.`,
    data: org,
  });
}

// Platform metrics
export async function getPlatformMetrics(_request, reply) {
  const [totalOrgs, activeOrgs, pendingOrgs, totalBranches, totalUsers] = await Promise.all([
    Organization.countDocuments(),
    Organization.countDocuments({ status: "APPROVED" }),
    Organization.countDocuments({ status: "PENDING" }),
    Branch.countDocuments(),
    User.countDocuments(),
  ]);

  return reply.send({
    success: true,
    data: {
      totalOrgs,
      activeOrgs,
      pendingOrgs,
      totalBranches,
      totalUsers,
    },
  });
}
