import React, { useEffect, useState } from "react";
import { Plus, Wallet, ArrowDownLeft, Receipt, CheckCircle, Loader2 } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    customerId: "",
    branchId: "",
    amount: "",
    paymentMethod: "UPI",
    reference: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [payRes, custRes, brRes] = await Promise.all([
        apiRequest("/payments").catch(() => ({ data: [] })),
        apiRequest("/customers").catch(() => ({ data: [] })),
        apiRequest("/branches").catch(() => ({ data: [] })),
      ]);

      if (payRes.data) setPayments(payRes.data);
      if (custRes.data) {
        setCustomers(custRes.data);
        if (custRes.data[0]) setFormData((f) => ({ ...f, customerId: custRes.data[0]._id }));
      }
      if (brRes.data) {
        setBranches(brRes.data);
        if (brRes.data[0]) setFormData((f) => ({ ...f, branchId: brRes.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.customerId) return;

    try {
      setSubmitting(true);
      const res = await apiRequest("/payments", {
        method: "POST",
        body: JSON.stringify({
          customerId: formData.customerId,
          branchId: formData.branchId || branches[0]?._id,
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod,
          reference: formData.reference || null,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setFormData({ ...formData, amount: "", reference: "" });
        loadData();
      }
    } catch (err) {
      alert("Error recording payment: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments & Receipts</h1>
          <p className="text-sm text-slate-500">
            Record cash, UPI, cheque, and bank transfers synced with customer ledgers.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
        >
          <Plus size={18} /> Record Payment
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 size={32} className="animate-spin text-emerald-700 mb-2" />
            <span className="text-sm">Fetching payment collection records...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Receipt #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Reference / UTR</th>
                <th className="px-6 py-4 text-right">Amount Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No payment receipts recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{p.paymentNumber}</td>
                    <td className="px-6 py-4 text-slate-800">
                      {p.customerId?.name || p.customerId?.businessName || p.customerName || "Customer"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : p.date || "Today"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-mono">{p.reference || "—"}</td>
                    <td className="px-6 py-4 font-bold text-[#1b6840] text-right">
                      ₹{Number(p.amount || 0).toLocaleString("en-IN")}
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
            <h2 className="text-lg font-bold text-slate-900">Record Customer Payment</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white"
                >
                  {customers.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name} {c.businessName ? `(${c.businessName})` : ""}
                    </option>
                  ))}
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
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">
                  Reference / Transaction ID
                </label>
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
                  disabled={submitting}
                  className="rounded-xl bg-[#1b6840] px-5 py-2 text-sm font-semibold text-white hover:bg-[#155433] disabled:opacity-50"
                >
                  {submitting ? "Recording..." : "Save Payment & Post to Ledger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
