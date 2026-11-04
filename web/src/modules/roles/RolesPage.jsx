import React, { useEffect, useState } from "react";
import {
  Shield,
  Plus,
  Key,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Edit2,
  Lock,
  RotateCw,
  X,
  Check,
  ShieldCheck,
} from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Role form state
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    permissions: [],
  });

  // Permission form state
  const [permFormData, setPermFormData] = useState({
    key: "",
    description: "",
  });

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

  const openAddRoleModal = () => {
    setEditingRole(null);
    setFormData({ name: "", key: "", permissions: [] });
    setShowRoleModal(true);
  };

  const openEditRoleModal = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name || "",
      key: role.key || "",
      permissions: role.permissions || [],
    });
    setShowRoleModal(true);
  };

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

  const handleSelectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: permissions.map((p) => p.key),
    }));
  };

  const handleClearPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  const handleSubmitRole = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setSubmitting(true);
      if (editingRole) {
        // Update (PATCH)
        const res = await apiRequest(`/roles/${editingRole._id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: formData.name,
            permissions: formData.permissions,
          }),
        });
        if (res.success) {
          setShowRoleModal(false);
          await loadData();
        }
      } else {
        // Create (POST)
        const res = await apiRequest("/roles", {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            key: formData.key.trim().toUpperCase(),
            permissions: formData.permissions,
          }),
        });
        if (res.success) {
          setShowRoleModal(false);
          await loadData();
        }
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (role) => {
    if (!confirm(`Are you sure you want to delete role "${role.name}" (${role.key})?`)) return;
    try {
      const res = await apiRequest(`/roles/${role._id}`, { method: "DELETE" });
      if (res.success) {
        await loadData();
      }
    } catch (err) {
      alert("Error deleting role: " + err.message);
    }
  };

  const handleCreatePermission = async (e) => {
    e.preventDefault();
    if (!permFormData.key) return;

    try {
      setSubmitting(true);
      const res = await apiRequest("/roles/permissions", {
        method: "POST",
        body: JSON.stringify(permFormData),
      });
      if (res.success) {
        setShowPermModal(false);
        setPermFormData({ key: "", description: "" });
        await loadData();
      }
    } catch (err) {
      alert("Error creating permission: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Roles & Permissions (RBAC)</h1>
          <p className="text-sm text-[#64748B]">
            Configure role-based access control, create custom titles, and assign granular security scopes.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
          >
            <RotateCw size={14} /> Refresh
          </button>
          <button
            onClick={() => setShowPermModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#123D2B] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
          >
            <Key size={14} /> New Permission Scope
          </button>
          <button
            onClick={openAddRoleModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#123D2B] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#176B45] transition cursor-pointer"
          >
            <Plus size={16} /> New Custom Role
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Roles Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-[#176B45]" size={32} />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => {
            const isOwner = r.key === "OWNER";
            return (
              <div
                key={r._id}
                className="flex flex-col justify-between rounded-2xl border border-[#E2EAE3] bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123D2B]/10 text-[#123D2B]">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1F2937] text-base">{r.name}</h3>
                        <div className="text-xs font-mono font-semibold text-[#64748B] uppercase">
                          {r.key}
                        </div>
                      </div>
                    </div>
                    {r.isSystem ? (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-[#64748B]">
                        System Default
                      </span>
                    ) : (
                      <span className="rounded-md bg-[#A8C9A5]/30 px-2 py-0.5 text-[10px] font-bold uppercase text-[#123D2B]">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Granted Permissions List */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] mb-2">
                      <span>Granted Permissions ({r.permissions?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                      {r.permissions && r.permissions.length > 0 ? (
                        r.permissions.map((p) => (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1 rounded-md bg-[#176B45]/10 border border-[#176B45]/15 px-2 py-0.5 text-[11px] font-medium text-[#176B45]"
                          >
                            <Check size={10} />
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#64748B] italic">No specific permissions attached</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role Actions Footer */}
                <div className="mt-6 border-t border-[#E2EAE3] pt-3.5 flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">
                    {r.isSystem ? "Predefined role" : "Custom role"}
                  </span>
                  <div className="flex items-center gap-2">
                    {!isOwner && (
                      <button
                        onClick={() => openEditRoleModal(r)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#E2EAE3] px-2.5 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition cursor-pointer"
                        title="Edit Permissions"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                    )}
                    {!r.isSystem && (
                      <button
                        onClick={() => handleDeleteRole(r)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Role"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Modal: Create / Edit Custom Role */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D2B]/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-[#E2EAE3] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-3">
              <h2 className="text-lg font-bold text-[#1F2937]">
                {editingRole ? `Edit Role: ${editingRole.name}` : "Define New Custom Role"}
              </h2>
              <button
                onClick={() => setShowRoleModal(false)}
                className="rounded-lg p-1 text-[#64748B] hover:bg-[#F5F7F1] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRole} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B]">Role Title</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nursery Dispatcher / Senior Agronomist"
                  className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                />
              </div>

              {!editingRole && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B]">
                    Identifier Key (Unique Code)
                  </label>
                  <input
                    required
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    placeholder="e.g. DISPATCHER"
                    className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none uppercase font-mono"
                  />
                </div>
              )}

              {/* Permissions Checklist */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase text-[#64748B]">
                    Select Permission Scopes ({formData.permissions.length} selected)
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="font-bold text-[#176B45] hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-[#64748B]">|</span>
                    <button
                      type="button"
                      onClick={handleClearPermissions}
                      className="text-[#64748B] hover:text-[#1F2937] cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-[#E2EAE3] p-3 bg-[#F5F7F1]/40">
                  {permissions.map((p) => {
                    const isChecked = formData.permissions.includes(p.key);
                    return (
                      <label
                        key={p.key}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E2EAE3] hover:border-[#176B45]/40 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(p.key)}
                            className="rounded text-[#123D2B] focus:ring-[#176B45]"
                          />
                          <span className="text-xs font-bold text-[#1F2937]">
                            {p.description || p.key}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono rounded bg-[#F5F7F1] px-1.5 py-0.5 text-[#64748B]">
                          {p.key}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#E2EAE3]">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="rounded-xl border border-[#E2EAE3] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F5F7F1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#123D2B] px-5 py-2 text-xs font-bold text-white hover:bg-[#176B45] disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {submitting ? "Saving..." : editingRole ? "Save Changes" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Create New Permission Scope */}
      {showPermModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D2B]/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E2EAE3] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-3">
              <h2 className="text-lg font-bold text-[#1F2937]">Create System Permission Scope</h2>
              <button
                onClick={() => setShowPermModal(false)}
                className="rounded-lg p-1 text-[#64748B] hover:bg-[#F5F7F1] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePermission} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B]">
                  Permission Key (e.g. dispatch.scan)
                </label>
                <input
                  required
                  value={permFormData.key}
                  onChange={(e) => setPermFormData({ ...permFormData, key: e.target.value })}
                  placeholder="e.g. plants.export"
                  className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none font-mono lowercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B]">
                  Description / Human-readable Label
                </label>
                <input
                  required
                  value={permFormData.description}
                  onChange={(e) => setPermFormData({ ...permFormData, description: e.target.value })}
                  placeholder="e.g. Export plant stock reports to Excel"
                  className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#E2EAE3]">
                <button
                  type="button"
                  onClick={() => setShowPermModal(false)}
                  className="rounded-xl border border-[#E2EAE3] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F5F7F1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#123D2B] px-5 py-2 text-xs font-bold text-white hover:bg-[#176B45] disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {submitting ? "Saving..." : "Add Permission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
