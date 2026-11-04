import React, { useEffect, useState } from "react";
import {
  Plus,
  Building2,
  MapPin,
  Phone,
  CheckCircle,
  Loader2,
  AlertCircle,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Power,
  RotateCw,
} from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone: "",
    city: "",
    isDefault: false,
    isActive: true,
  });

  const loadBranches = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiRequest("/branches");
      if (res.success && Array.isArray(res.data)) {
        setBranches(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const openAddModal = () => {
    setEditingBranch(null);
    setFormData({
      name: "",
      code: "",
      phone: "",
      city: "",
      isDefault: branches.length === 0,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name || "",
      code: branch.code || "",
      phone: branch.phone || "",
      city: branch.address?.city || branch.city || "",
      isDefault: Boolean(branch.isDefault),
      isActive: branch.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        code: formData.code.trim().toUpperCase(),
        phone: formData.phone || null,
        address: { city: formData.city || null },
        isDefault: Boolean(formData.isDefault),
        isActive: Boolean(formData.isActive),
      };

      if (editingBranch) {
        // Update existing branch (PATCH)
        const res = await apiRequest(`/branches/${editingBranch._id || editingBranch.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        if (res.success) {
          setShowModal(false);
          await loadBranches();
        }
      } else {
        // Create new branch (POST)
        const res = await apiRequest("/branches", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.success) {
          setShowModal(false);
          await loadBranches();
        }
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (branch) => {
    const id = branch._id || branch.id;
    if (branch.isDefault) {
      alert("The primary default branch cannot be deleted. Please set another branch as default first.");
      return;
    }

    if (!confirm(`Are you sure you want to delete branch "${branch.name}" (${branch.code})?`)) {
      return;
    }

    try {
      const res = await apiRequest(`/branches/${id}`, { method: "DELETE" });
      if (res.success) {
        await loadBranches();
      }
    } catch (err) {
      alert("Error deleting branch: " + err.message);
    }
  };

  const handleToggleActive = async (branch) => {
    const id = branch._id || branch.id;
    try {
      const res = await apiRequest(`/branches/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !branch.isActive }),
      });
      if (res.success) {
        await loadBranches();
      }
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const handleSetDefault = async (branch) => {
    const id = branch._id || branch.id;
    try {
      const res = await apiRequest(`/branches/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.success) {
        localStorage.setItem("nursery_current_branch", id);
        window.dispatchEvent(
          new CustomEvent("nursery:branch-changed", {
            detail: { branchId: id, branchName: branch.name, branchCode: branch.code },
          })
        );
        await loadBranches();
      }
    } catch (err) {
      alert("Error setting default: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Nursery Branches & Depots</h1>
          <p className="text-sm text-[#64748B]">
            Create, update, activate, and manage your nursery's physical farms, retail centers, and dispatch depots.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadBranches}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
          >
            <RotateCw size={14} /> Refresh
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#123D2B] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#176B45] transition cursor-pointer"
          >
            <Plus size={18} /> Add Branch
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-[#64748B]">
          <Loader2 size={32} className="animate-spin text-[#176B45] mb-2" />
          <span className="text-sm">Fetching branches from server...</span>
        </div>
      ) : branches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2EAE3] bg-white p-12 text-center text-[#64748B]">
          <Building2 size={36} className="mx-auto mb-3 text-[#A8C9A5]" />
          <h3 className="text-base font-bold text-[#1F2937]">No branches found</h3>
          <p className="mt-1 text-xs text-[#64748B]">Click "Add Branch" to register your nursery's primary or secondary depot.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <div
              key={b._id || b.id}
              className="rounded-2xl border border-[#E2EAE3] bg-white p-6 shadow-xs transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#123D2B]/10 text-[#123D2B]">
                      <Building2 size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1F2937] text-base">{b.name}</h3>
                      <span className="text-xs font-mono font-semibold text-[#64748B]">
                        Code: {b.code}
                      </span>
                    </div>
                  </div>
                  {b.isDefault ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#176B45]/15 px-2.5 py-1 text-[11px] font-bold text-[#176B45] border border-[#176B45]/20">
                      <Star size={11} fill="currentColor" /> Primary HQ
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(b)}
                      title="Set as Default HQ Branch"
                      className="text-xs font-semibold text-[#64748B] hover:text-[#176B45] transition cursor-pointer"
                    >
                      Make HQ
                    </button>
                  )}
                </div>

                <div className="mt-5 space-y-2 text-xs text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#64748B]" />
                    <span>{b.phone || "No phone registered"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#64748B]" />
                    <span>{b.address?.city || b.city || "Location not set"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-[#E2EAE3] pt-4 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                      b.isActive
                        ? "bg-[#176B45]/10 text-[#176B45] border border-[#176B45]/20"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {b.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => handleToggleActive(b)}
                    title={b.isActive ? "Deactivate Branch" : "Activate Branch"}
                    className="p-1 text-[#64748B] hover:text-[#123D2B] transition cursor-pointer"
                  >
                    <Power size={13} />
                  </button>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(b)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E2EAE3] px-2.5 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition cursor-pointer"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  {!b.isDefault && (
                    <button
                      onClick={() => handleDelete(b)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Branch"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating / Updating Branch */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D2B]/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#E2EAE3]">
            <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-3">
              <h2 className="text-lg font-bold text-[#1F2937]">
                {editingBranch ? "Edit Branch Details" : "Add New Nursery Branch"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-[#64748B] hover:bg-[#F5F7F1] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase">Branch Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Pune Central Depot"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase">Branch Code</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. PUNE-1"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune Rural"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E2EAE3]">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#1F2937] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded text-[#123D2B] focus:ring-[#176B45]"
                  />
                  <span>Set as primary default HQ branch</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#1F2937] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#123D2B] focus:ring-[#176B45]"
                  />
                  <span>Branch is active for billing and transactions</span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#E2EAE3]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#E2EAE3] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F5F7F1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#123D2B] px-5 py-2 text-xs font-bold text-white hover:bg-[#176B45] disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {submitting ? "Saving..." : editingBranch ? "Update Branch" : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
