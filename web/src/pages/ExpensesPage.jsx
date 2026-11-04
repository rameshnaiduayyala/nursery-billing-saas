import React, { useState } from "react";
import { Plus, Receipt, IndianRupee, Tag, Calendar, Building2 } from "lucide-react";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([
    {
      _id: "exp-1",
      title: "Daily Nursery Workers Labour",
      category: "LABOUR",
      amount: 4500,
      paymentMethod: "CASH",
      date: "2026-11-04",
      branch: "Main Nursery & Polyhouse",
    },
    {
      _id: "exp-2",
      title: "Tractor Diesel for Land Leveling",
      category: "FUEL",
      amount: 2800,
      paymentMethod: "UPI",
      date: "2026-11-03",
      branch: "Main Nursery & Polyhouse",
    },
    {
      _id: "exp-3",
      title: "Plastic Grow Bags & Pots Batch (5000 pcs)",
      category: "PACKAGING",
      amount: 14500,
      paymentMethod: "BANK_TRANSFER",
      date: "2026-11-01",
      branch: "Highway Depot & Retail Outlet",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "LABOUR",
    amount: "",
    paymentMethod: "CASH",
    branch: "Main Nursery & Polyhouse",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    const newExp = {
      _id: "exp-" + Date.now(),
      ...formData,
      amount: Number(formData.amount) || 0,
      date: new Date().toISOString().split("T")[0],
    };
    setExpenses([newExp, ...expenses]);
    setShowModal(false);
    setFormData({ title: "", category: "LABOUR", amount: "", paymentMethod: "CASH", branch: "Main Nursery & Polyhouse" });
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Recorded Expenses</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">₹{totalExpense.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Labour & Staff</div>
          <div className="mt-2 text-2xl font-bold text-amber-700">₹4,500</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Packaging & Supplies</div>
          <div className="mt-2 text-2xl font-bold text-blue-700">₹14,500</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
            {expenses.map((e) => (
              <tr key={e._id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-semibold text-slate-900">{e.title}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {e.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{e.branch}</td>
                <td className="px-6 py-4 text-slate-500">{e.date}</td>
                <td className="px-6 py-4 text-slate-600">{e.paymentMethod}</td>
                <td className="px-6 py-4 font-bold text-slate-900 text-right">₹{e.amount.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  placeholder="e.g. Nursery Workers Labour"
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
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option>Main Nursery & Polyhouse</option>
                    <option>Highway Depot & Retail Outlet</option>
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
                  className="rounded-xl bg-[#1b6840] px-4 py-2 text-sm font-semibold text-white hover:bg-[#155433]"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

