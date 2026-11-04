import React, { useEffect, useState } from "react";
import { Plus, Search, User, Phone, MapPin, Building, CreditCard, ArrowUpRight, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    customerType: "RETAIL",
    city: "",
    openingBalance: "",
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiRequest("/customers");
      if (res.success && Array.isArray(res.data)) {
        setCustomers(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load customers from API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    try {
      setSubmitting(true);
      const res = await apiRequest("/customers", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          businessName: formData.businessName || null,
          phone: formData.phone,
          customerType: formData.customerType,
          billingAddress: { city: formData.city },
          openingBalance: Number(formData.openingBalance) || 0,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setFormData({ name: "", businessName: "", phone: "", customerType: "RETAIL", city: "", openingBalance: "" });
        loadCustomers();
      }
    } catch (err) {
      alert("Error adding customer: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.businessName && c.businessName.toLowerCase().includes(search.toLowerCase())) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Directory & Ledger</h1>
          <p className="text-sm text-slate-500">
            Wholesale buyers, landscapers, retail clients, credit limits, and outstanding balances synced with the API.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
        >
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}. Check API server connectivity.</span>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer by name, business firm, or phone number..."
          className="w-full bg-transparent text-sm text-slate-800 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 size={32} className="animate-spin text-emerald-700 mb-2" />
            <span className="text-sm">Fetching customer accounts...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer / Firm</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Phone / City</th>
                <th className="px-6 py-4">Opening Balance</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    No customers found. Click "Add Customer" to add a wholesale client or landscaper.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                          <User size={18} />
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <div className="text-xs text-slate-400 font-normal">
                            {c.businessName ? `${c.businessName} • ${c.customerCode}` : c.customerCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {c.customerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{c.phone}</div>
                      <div className="text-xs text-slate-400">{c.billingAddress?.city || "—"}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      ₹{Number(c.openingBalance || 0).toLocaleString("en-IN")}
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
            <h2 className="text-lg font-bold text-slate-900">Create New Customer Profile</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Contact Person Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Business / Firm (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Lotus Greenery & Landscaping"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Customer Type</label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="RETAIL">Retail Customer</option>
                    <option value="WHOLESALE">Wholesale Buyer</option>
                    <option value="LANDSCAPER">Landscaper</option>
                    <option value="NURSERY_TRADER">Nursery Trader</option>
                    <option value="EXPORTER">Plant Exporter</option>
                    <option value="CORPORATE">Corporate</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Phone Number</label>
                  <input
                    required
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Opening Balance (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.openingBalance}
                  onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
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
                  className="rounded-xl bg-[#1b6840] px-5 py-2 text-sm font-semibold text-white hover:bg-[#155433] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

