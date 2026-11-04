import React, { useEffect, useState } from "react";
import { Plus, Receipt, IndianRupee, Tag, Calendar, Building2, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "LABOUR",
    amount: "",
    paymentMethod: "CASH",
    branchId: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [expRes, brRes] = await Promise.all([
        apiRequest("/expenses").catch(() => ({ data: [] })),
        apiRequest("/branches").catch(() => ({ data: [] })),
      ]);

      if (expRes.data) setExpenses(expRes.data);
      if (brRes.data) {
        setBranches(brRes.data);
        if (brRes.data[0]) setFormData((f) => ({ ...f, branchId: brRes.data[0]._id || brRes.data[0].id }));
      }
    } catch (err) {
      setError(err.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    try {
      setSubmitting(true);
      const res = await apiRequest("/expenses", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod,
          branchId: formData.branchId || branches[0]?._id,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setFormData({ ...formData, title: "", amount: "" });
        loadData();
      }
    } catch (err) {
      alert("Error saving expense: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Expenses & Overheads</h1>
          <p className="text-sm text-slate-500">Record daily labour, fuel, vehicle maintenance, and potting supplies.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
        >
          <Plus size={18} /> Record Expense
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Recorded Expenses</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">₹{totalExpense.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Expense Entries</div>
          <div className="mt-2 text-2xl font-bold text-emerald-800">{expenses.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Branches</div>
          <div className="mt-2 text-2xl font-bold text-blue-700">{branches.length}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 size={32} className="animate-spin text-emerald-700 mb-2" />
            <span className="text-sm">Fetching business expenses...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Expense Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No business expenses logged yet.
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e._id || e.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">{e.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {e.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{e.branchId?.name || "Main Branch"}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {e.expenseDate ? new Date(e.expenseDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{e.paymentMethod}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-right">
                      ₹{Number(e.amount || 0).toLocaleString("en-IN")}
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
            <h2 className="text-lg font-bold text-slate-900">Record Business Expense</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Expense Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Nursery Workers Daily Labour"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="LABOUR">Labour</option>
                    <option value="TRANSPORTATION">Transportation</option>
                    <option value="FUEL">Fuel</option>
                    <option value="PACKAGING">Packaging & Pots</option>
                    <option value="PLANT_PURCHASES">Plant Purchases</option>
                    <option value="ELECTRICITY">Electricity</option>
                    <option value="RENT">Land Rent</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Amount (₹)</label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Branch</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    {branches.map((b) => (
                      <option key={b._id || b.id} value={b._id || b.id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
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
                  className="rounded-xl bg-[#1b6840] px-4 py-2 text-sm font-semibold text-white hover:bg-[#155433] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
