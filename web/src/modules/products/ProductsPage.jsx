import React, { useEffect, useState } from "react";
import { Plus, Search, Tag, DollarSign, Package, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    plantVariety: "",
    plantSize: "",
    unitId: "PCS",
    defaultRate: "",
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiRequest("/products");
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load plant catalog from API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setSubmitting(true);
      const res = await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          plantVariety: formData.plantVariety || null,
          plantSize: formData.plantSize || null,
          unitId: formData.unitId || "PCS",
          defaultRate: Number(formData.defaultRate) || 0,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setFormData({ name: "", plantVariety: "", plantSize: "", unitId: "PCS", defaultRate: "" });
        loadProducts();
      }
    } catch (err) {
      alert("Error adding plant: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.plantVariety && p.plantVariety.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Plant Catalog</h1>
          <p className="text-sm text-slate-500">
            Manage live plant varieties, pot/bag sizes, pricing, and master sales units connected to your API.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
        >
          <Plus size={18} /> Add Plant
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}. Displaying local database or fallback data.</span>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by plant name, botanical variety or category..."
          className="w-full bg-transparent text-sm text-slate-800 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 size={32} className="animate-spin text-emerald-700 mb-2" />
            <span className="text-sm">Fetching plant catalog from server...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Plant & Variety</th>
                <th className="px-6 py-4">Size / Spec</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Default Rate</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    No plants found. Click "Add Plant" to register your first catalog item.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                          <Package size={18} />
                        </div>
                        <div>
                          <div>{p.name}</div>
                          <div className="text-xs text-slate-400 font-normal">
                            {p.plantVariety || "Standard variety"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.plantSize || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{p.unitId?.name || p.unitId?.code || p.unitId || "PCS"}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ₹{Number(p.defaultRate || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Add New Plant to Catalog</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Plant Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Golden Pothos / Money Plant"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Variety / Species</label>
                <input
                  type="text"
                  placeholder="e.g. Epipremnum aureum"
                  value={formData.plantVariety}
                  onChange={(e) => setFormData({ ...formData, plantVariety: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Size / Pot</label>
                  <input
                    type="text"
                    placeholder="e.g. 5-inch pot"
                    value={formData.plantSize}
                    onChange={(e) => setFormData({ ...formData, plantSize: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Unit</label>
                  <select
                    value={formData.unitId}
                    onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="PCS">Piece</option>
                    <option value="POT">Pot</option>
                    <option value="BAG">Bag</option>
                    <option value="BDL">Bundle</option>
                    <option value="KG">Kilogram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Rate (₹)</label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    value={formData.defaultRate}
                    onChange={(e) => setFormData({ ...formData, defaultRate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
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
                  className="rounded-xl bg-[#1b6840] px-5 py-2 text-sm font-semibold text-white hover:bg-[#155433] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Plant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

