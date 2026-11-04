import React, { useEffect, useState } from "react";
import { Shield, Plus, Key, CheckCircle, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", key: "", permissions: [] });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [roleRes, permRes] = await Promise.all([
        apiRequest("/roles"),
        apiRequest("/roles/permissions"),
      ]);
      if (roleRes.success) setRoles(roleRes.data || []);
      if (permRes.success) setPermissions(permRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load roles and permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const togglePermission = (permKey) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((k) => k !== permKey)
          : [...prev.permissions, permKey],
      };
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await apiRequest("/roles", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.success) {
        setShowModal(false);
        setFormData({ name: "", key: "", permissions: [] });
        await loadData();
      }
    } catch (err) {
      alert(err.message || "Failed to create role");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this custom role?")) return;
    try {
      const res = await apiRequest(`/roles/${id}`, { method: "DELETE" });
      if (res.success) await loadData();
    } catch (err) {
      alert(err.message || "Failed to delete role");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Roles & Permissions</h1>
          <p className="text-sm text-slate-500">Configure role-based access control and system permission scopes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
        >
          <Plus size={16} /> New Custom Role
        </button>
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
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div key={r._id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{r.name}</h3>
                  <div className="text-xs font-mono text-slate-400 uppercase">{r.key}</div>
                </div>
                {r.isSystem ? (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">SYSTEM</span>
                ) : (
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="mt-4 flex-1">
                <div className="text-xs font-semibold text-slate-500 mb-2">Granted Permissions ({r.permissions?.length || 0}):</div>
                <div className="flex flex-wrap gap-1.5">
                  {r.permissions && r.permissions.length > 0 ? (
                    r.permissions.map((p) => (
                      <span key={p} className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No specific permissions assigned</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Define New Role</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Role Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nursery Dispatcher"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Role Key / Identifier</label>
                <input
                  required
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g. DISPATCHER"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Select Permissions</label>
                <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl border border-slate-200 p-3">
                  {permissions.map((p) => (
                    <label key={p.key} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(p.key)}
                        onChange={() => togglePermission(p.key)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{p.description || p.key}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({p.key})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#1b6840] px-4 py-2 text-sm font-semibold text-white hover:bg-[#155433] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

