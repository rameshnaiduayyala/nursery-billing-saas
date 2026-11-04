import React, { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, Clock, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiRequest("/notifications");
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await apiRequest("/notifications/read-all", { method: "PATCH" });
      await loadNotifications();
    } catch (err) {
      alert("Failed to mark all as read");
    }
  };

  const markRead = async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: "PATCH" });
      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications & Alerts</h1>
          <p className="text-sm text-slate-500">Business updates, quotation acceptances, invoice receipts, and warnings</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Bell className="mx-auto mb-3 text-slate-300" size={40} />
          <h3 className="font-semibold text-slate-800">All caught up!</h3>
          <p className="mt-1 text-sm text-slate-500">No pending notifications at this moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
              className={`flex items-start justify-between rounded-2xl border p-4 transition cursor-pointer ${
                n.isRead
                  ? "border-slate-200 bg-white text-slate-600"
                  : "border-emerald-200 bg-emerald-50/40 text-slate-900 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    n.isRead ? "bg-slate-300" : "bg-emerald-600"
                  }`}
                />
                <div>
                  <h4 className="font-semibold">{n.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={12} /> {new Date(n.createdAt).toLocaleString()}
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 uppercase text-[10px] font-mono">
                      {n.type}
                    </span>
                  </div>
                </div>
              </div>
              {!n.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markRead(n._id);
                  }}
                  className="p-1 text-emerald-700 hover:text-emerald-900"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

