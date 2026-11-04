import React, { useState } from "react";
import { Plus, Wallet, ArrowDownLeft, Receipt, CheckCircle } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([
    {
      _id: "pay-1",
      paymentNumber: "RCPT-0041",
      customerName: "GreenScape Landscaping LLP",
      amount: 20000,
      paymentMethod: "UPI",
      reference: "UPI/348291039",
      date: "2026-11-04",
      allocatedTo: "INV-0012",
    },
    {
      _id: "pay-2",
      paymentNumber: "RCPT-0040",
      customerName: "Anita Sharma",
      amount: 5100,
      paymentMethod: "CASH",
      reference: "Counter cash",
      date: "2026-11-03",
      allocatedTo: "INV-0011",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "GreenScape Landscaping LLP",
    amount: "",
    paymentMethod: "UPI",
    reference: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newPay = {
      _id: "pay-" + Date.now(),
      paymentNumber: "RCPT-" + Math.floor(1000 + Math.random() * 9000),
      ...formData,
      amount: Number(formData.amount) || 0,
      date: new Date().toISOString().split("T")[0],
      allocatedTo: "INV-0012",
    };
    setPayments([newPay, ...payments]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments & Receipts</h1>
          <p className="text-sm text-slate-500">Record cash, UPI, cheque, and bank transfer receipts with automated invoice allocation.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
        >
          <Plus size={18} /> Record Payment
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Receipt #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Reference / UTR</th>
              <th className="px-6 py-4">Allocated Invoice</th>
              <th className="px-6 py-4 text-right">Amount Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">{p.paymentNumber}</td>
                <td className="px-6 py-4 text-slate-800">{p.customerName}</td>
                <td className="px-6 py-4 text-slate-500">{p.date}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {p.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs font-mono">{p.reference || "—"}</td>
                <td className="px-6 py-4 text-emerald-800 font-medium">{p.allocatedTo || "Advance Balance"}</td>
                <td className="px-6 py-4 font-bold text-[#1b6840] text-right">₹{p.amount.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Record Customer Payment</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Customer</label>
                <select
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white"
                >
                  <option>GreenScape Landscaping LLP</option>
                  <option>Anita Sharma</option>
                  <option>Balaji Agro Farms</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS/IMPS)</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Reference / Transaction ID</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref / Bank UTR Number"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
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
                  className="rounded-xl bg-[#1b6840] px-4 py-2 text-sm font-semibold text-white hover:bg-[#155433]"
                >
                  Save Payment & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

