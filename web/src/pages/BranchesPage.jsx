import React, { useEffect, useState } from "react";
import { Plus, Building2, MapPin, Phone, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", phone: "", city: "" });

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

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    try {
      setSubmitting(true);
      const res = await apiRequest("/branches", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          code: formData.code.toUpperCase(),
          phone: formData.phone || null,
          address: { city: formData.city || null },
          isDefault: branches.length === 0,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setFormData({ name: "", code: "", phone: "", city: "" });
        loadBranches();
      }
    } catch (err) {
      alert("Error adding branch: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nursery Branches & Locations</h1>
          <p className="text-sm text-slate-500">
            Operate multiple depots, farm locations, and retail counters with isolated document numbering.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
        >
          <Plus size={18} /> Add Branch
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-500">
          <Loader2 size={32} className="animate-spin text-emerald-700 mb-2" />
          <span className="text-sm">Fetching branches from server...</span>
        </div>
      ) : branches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
          No branches found. Click "Add Branch" to register your nursery's primary or secondary location.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {branches.map((b) => (
            <div key={b._id || b.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{b.name}</h3>
                      <span className="text-xs font-semibold text-slate-400">Branch Code: {b.code}</span>
                    </div>
                  </div>
                  {b.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      <CheckCircle size={12} /> Main HQ
                    </span>
                  )}
                </div>

                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-slate-400" />
                    <span>{b.phone || "No phone registered"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-slate-400" />
                    <span>{b.address?.city || b.city || "Location not set"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex justify-between items-center text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-700">{b.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Add Nursery Branch</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Branch Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Farm Nursery Unit 2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Branch Code</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. UNIT2"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">City / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune Rural"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#1b6840] px-4 py-2 text-sm font-semibold text-white hover:bg-[#155433] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
