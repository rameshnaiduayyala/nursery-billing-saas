import React, { useEffect, useState } from "react";
import { Sliders, Plus, DollarSign, Percent, Check, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function ChargesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    chargeType: "LOADING",
    calculationType: "FIXED",
    defaultRate: 0,
    isDefault: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiRequest("/charges/templates");
      if (res.success && Array.isArray(res.data)) {
        setTemplates(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load charge configurations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await apiRequest("/charges/templates", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          defaultRate: Number(formData.defaultRate),
        }),
      });
      if (res.success) {
        setShowModal(false);
        setFormData({
          name: "",
          chargeType: "LOADING",
          calculationType: "FIXED",
          defaultRate: 0,
          isDefault: false,
        });
        await loadTemplates();
      }
    } catch (err) {
      alert(err.message || "Failed to add charge template");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Additional Charges & Tariffs</h1>
          <p className="text-sm text-slate-500">Configure loading, unloading, transport, labour, packaging, and vehicle charges</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
        >
          <Plus size={16} /> New Charge Template
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
      ) : templates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Sliders className="mx-auto mb-3 text-slate-300" size={40} />
          <h3 className="font-semibold text-slate-800">No charge templates configured</h3>
          <p className="mt-1 text-sm text-slate-500">Add standard charges like Loading per bag, Transport per km, or Packaging fees.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <div key={tpl._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {tpl.chargeType}
                  </span>
                  <h3 className="mt-2 font-bold text-slate-900">{tpl.name}</h3>
                </div>
                {tpl.isDefault && (
                  <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    <Check size={12} /> Auto-apply
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-500">Method: {tpl.calculationType}</span>
                <span className="text-lg font-bold text-slate-900">
                  {tpl.calculationType === "PERCENTAGE" ? `${tpl.defaultRate}%` : `₹${tpl.defaultRate}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Create Charge Configuration</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Charge Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Loading per Bag"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Category</label>
                <select
                  value={formData.chargeType}
                  onChange={(e) => setFormData({ ...formData, chargeType: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                >
                  <option value="LOADING">Loading Charges</option>
                  <option value="UNLOADING">Unloading Charges</option>
                  <option value="TRANSPORT">Transportation</option>
                  <option value="LABOUR">Labour / Daily Wages</option>
                  <option value="PACKAGING">Packaging / Crating</option>
                  <option value="VEHICLE">Vehicle / Freight Charges</option>
                  <option value="OTHER">Custom / Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Calculation Method</label>
                <select
                  value={formData.calculationType}
                  onChange={(e) => setFormData({ ...formData, calculationType: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                >
                  <option value="FIXED">Fixed Amount (₹)</option>
                  <option value="PER_UNIT">Per Plant Unit</option>
                  <option value="PER_BAG">Per Bag</option>
                  <option value="PER_TONNE">Per Tonne</option>
                  <option value="PER_VEHICLE">Per Vehicle / Trip</option>
                  <option value="PER_DAY">Per Day</option>
                  <option value="PER_WORKER">Per Worker per Day</option>
                  <option value="PERCENTAGE">Percentage of Subtotal (%)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Default Rate / Amount</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="any"
                  value={formData.defaultRate}
                  onChange={(e) => setFormData({ ...formData, defaultRate: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Automatically attach to new quotations and invoices</span>
              </label>

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
                  {submitting ? "Saving..." : "Save Charge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

