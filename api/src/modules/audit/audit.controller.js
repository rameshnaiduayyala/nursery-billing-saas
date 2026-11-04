import { AuditLog } from "../../models/System.js";

// List audit log entries
export async function listAuditLogs(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { entityType, entityId } = request.query || {};
  const query = { organizationId: orgId };
  if (entityType) query.entityType = entityType;
  if (entityId) query.entityId = entityId;

  const logs = await AuditLog.find(query)
    .populate("actorUserId", "name email role")
    .sort({ createdAt: -1 })
    .limit(100);

  return reply.send({ success: true, data: logs });
}

