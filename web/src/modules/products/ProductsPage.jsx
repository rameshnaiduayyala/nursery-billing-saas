import React, { useEffect, useState } from "react";
import { Plus, Search, Tag, DollarSign, Package, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "../../lib/api";
import { plantAssets } from "../../assets";

// Helper to match plant image or provide standard plant icon
function getPlantImage(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes("palm") || lower.includes("areca")) return plantAssets.arecaPalm;
  if (lower.includes("snake") || lower.includes("sansevieria")) return plantAssets.snakePlant;
  if (lower.includes("monstera") || lower.includes("philodendron")) return plantAssets.monstera;
  if (lower.includes("pothos") || lower.includes("money")) return plantAssets.goldenPothos;
  return plantAssets.monstera;
}

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
          defaultRate: parseFloat(formData.defaultRate) || 0,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setFormData({ name: "", plantVariety: "", plantSize: "", unitId: "PCS", defaultRate: "" });
        await loadProducts();
      }
    } catch (err) {
      alert(err.message || "Failed to create plant item");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.plantVariety?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Plant & Product Catalog</h1>
          <p className="text-sm text-[#64748B]">Manage botanical varieties, bag sizes, and non-GST selling prices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#123D2B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#176B45] transition cursor-pointer"
        >
          <Plus size={16} /> Add Plant
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plants by botanical name or variety..."
          className="w-full rounded-xl border border-[#E2EAE3] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1F2937] placeholder-[#64748B] focus:border-[#176B45] focus:outline-none"
        />
      </div>

      {/* Catalog Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E2EAE3] bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-[#64748B]">
            <Loader2 size={32} className="animate-spin text-[#176B45] mb-2" />
            <span className="text-sm">Fetching plant catalog from server...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E2EAE3] bg-[#F5F7F1]/75 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Plant & Variety</th>
                <th className="px-6 py-4">Size / Spec</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Default Rate</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE3]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[#64748B]">
                    No plants found. Click "Add Plant" to register your first catalog item.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-[#F5F7F1]/50 transition">
                    <td className="px-6 py-4 font-medium text-[#1F2937]">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPlantImage(p.name)}
                          alt={p.name}
                          className="h-10 w-10 shrink-0 rounded-xl border border-[#E2EAE3] object-cover bg-[#F5F7F1]"
                        />
                        <div>
                          <div className="font-bold text-[#1F2937]">{p.name}</div>
                          <div className="text-xs text-[#64748B] font-normal">
                            {p.plantVariety || "Standard variety"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">{p.plantSize || "—"}</td>
                    <td className="px-6 py-4 text-[#64748B]">{p.unitId?.name || p.unitId?.code || p.unitId || "PCS"}</td>
                    <td className="px-6 py-4 font-semibold text-[#1F2937]">
                      ₹{Number(p.defaultRate || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center rounded-md bg-[#176B45]/10 px-2.5 py-0.5 text-xs font-medium text-[#176B45]">
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

      {/* Modal for Adding New Plant */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D2B]/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E2EAE3]">
            <h2 className="text-lg font-bold text-[#1F2937]">Add Plant to Catalog</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-[#64748B]">Botanical / Plant Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Areca Palm (Dypsis lutescens)"
                  className="mt-1 w-full rounded-xl border border-[#E2EAE3] px-3 py-2 text-sm focus:border-[#176B45] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-[#64748B]">Variety / Cultivar</label>
                <input
                  value={formData.plantVariety}
                  onChange={(e) => setFormData({ ...formData, plantVariety: e.target.value })}
                  placeholder="e.g. Golden Cane, Bushy, Dwarf"
                  className="mt-1 w-full rounded-xl border border-[#E2EAE3] px-3 py-2 text-sm focus:border-[#176B45] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-[#64748B]">Size / Container</label>
                  <input
                    value={formData.plantSize}
                    onChange={(e) => setFormData({ ...formData, plantSize: e.target.value })}
                    placeholder="e.g. 10 inch bag, 5ft"
                    className="mt-1 w-full rounded-xl border border-[#E2EAE3] px-3 py-2 text-sm focus:border-[#176B45] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-[#64748B]">Unit</label>
                  <select
                    value={formData.unitId}
                    onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E2EAE3] px-3 py-2 text-sm focus:border-[#176B45] focus:outline-none"
                  >
                    <option value="PCS">Piece (PCS)</option>
                    <option value="POT">Pot</option>
                    <option value="BAG">Polybag</option>
                    <option value="BUNDLE">Bundle</option>
                    <option value="TRAY">Seedling Tray</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-[#64748B]">Selling Rate (₹)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="any"
                  value={formData.defaultRate}
                  onChange={(e) => setFormData({ ...formData, defaultRate: e.target.value })}
                  placeholder="e.g. 350"
                  className="mt-1 w-full rounded-xl border border-[#E2EAE3] px-3 py-2 text-sm focus:border-[#176B45] focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F5F7F1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#123D2B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#176B45] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Add to Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
