import { Notification } from "../../models/Notification.js";
import { z } from "zod";

const createNotificationSchema = z.object({
  userId: z.string().optional(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(["SYSTEM", "QUOTATION", "INVOICE", "PAYMENT", "EMPLOYEE", "APPROVAL", "REMINDER"]).default("SYSTEM"),
  link: z.string().optional().nullable(),
  metadata: z.record(z.any()).optional().nullable(),
});

// List notifications for current organization / user
export async function listNotifications(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const query = { organizationId: orgId };
  if (request.query && request.query.unreadOnly === "true") {
    query.isRead = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({ organizationId: orgId, isRead: false });

  return reply.send({
    success: true,
    data: {
      notifications,
      unreadCount,
    },
  });
}

// Create a new notification (system/event triggered)
export async function createNotification(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = createNotificationSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const notification = await Notification.create({
    ...parsed.data,
    organizationId: orgId,
  });

  return reply.code(201).send({ success: true, data: notification });
}

// Mark a single notification as read
export async function markNotificationAsRead(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const notification = await Notification.findOneAndUpdate(
    { _id: request.params.id, organizationId: orgId },
    { isRead: true },
    { new: true }
  );

  if (!notification) return reply.code(404).send({ success: false, message: "Notification not found" });

  return reply.send({ success: true, data: notification });
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  await Notification.updateMany({ organizationId: orgId, isRead: false }, { isRead: true });

  return reply.send({ success: true, message: "All notifications marked as read" });
}
