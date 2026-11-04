import {
  listNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notifications.controller.js";

export default async function notificationRoutes(app) {
  app.get("/notifications", listNotifications);
  app.post("/notifications", createNotification);
  app.patch("/notifications/:id/read", markNotificationAsRead);
  app.patch("/notifications/read-all", markAllNotificationsAsRead);
}
