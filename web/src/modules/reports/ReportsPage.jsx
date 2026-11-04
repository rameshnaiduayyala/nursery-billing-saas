import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, DollarSign, Users, Building, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function ReportsPage() {
  const [overview, setOverview] = useState(null);
  const [branchPerformance, setBranchPerformance] = useState([]);
  const [outstandingDebtors, setOutstandingDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");
        const [overviewRes, branchRes, debtorRes] = await Promise.all([
          apiRequest("/reports/overview"),
          apiRequest("/reports/branches"),
          apiRequest("/reports/outstanding"),
        ]);

        if (overviewRes.success) setOverview(overviewRes.data);
        if (branchRes.success) setBranchPerformance(branchRes.data || []);
        if (debtorRes.success) setOutstandingDebtors(debtorRes.data || []);
      } catch (err) {
        setError(err.message || "Failed to load financial reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Reports & Statements</h1>
          <p className="text-sm text-slate-500">Business performance metrics, branch comparisons, and debtor ledgers</p>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setTab("overview")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === "overview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setTab("branches")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === "branches" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Branch Comparisons
          </button>
          <button
            onClick={() => setTab("debtors")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === "debtors" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Outstanding Balances
          </button>
        </div>
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
      ) : tab === "overview" && overview ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Billed Invoices</span>
              <div className="mt-2 text-2xl font-bold text-slate-900">₹{overview.summary?.totalSales?.toLocaleString() || 0}</div>
              <span className="text-xs text-slate-500">{overview.summary?.invoicesCount || 0} invoices issued</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase text-slate-400">Collected Revenue</span>
              <div className="mt-2 text-2xl font-bold text-emerald-600">₹{overview.summary?.totalCollected?.toLocaleString() || 0}</div>
              <span className="text-xs text-slate-500">From customer payments</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Expenses</span>
              <div className="mt-2 text-2xl font-bold text-amber-600">₹{overview.summary?.totalExpenses?.toLocaleString() || 0}</div>
              <span className="text-xs text-slate-500">Labour, transport, materials</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase text-slate-400">Net Cash Flow</span>
              <div className={`mt-2 text-2xl font-bold ${(overview.summary?.netCashFlow || 0) >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                ₹{overview.summary?.netCashFlow?.toLocaleString() || 0}
              </div>
              <span className="text-xs text-slate-500">Collected minus expenses</span>
            </div>
          </div>
        </div>
      ) : tab === "branches" ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Invoiced</th>
                <th className="px-6 py-4">Collected</th>
                <th className="px-6 py-4">Expenses</th>
                <th className="px-6 py-4">Net Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branchPerformance.map((b) => (
                <tr key={b.branchId} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{b.name}</div>
                    <div className="text-xs text-slate-400">Code: {b.code}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">₹{b.totalInvoiced?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">₹{b.totalCollected?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-amber-600">₹{b.totalExpenses?.toLocaleString()}</td>
                  <td className={`px-6 py-4 font-bold ${b.netContribution >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                    ₹{b.netContribution?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Total Invoiced</th>
                <th className="px-6 py-4">Total Paid</th>
                <th className="px-6 py-4">Outstanding Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {outstandingDebtors.map((c) => (
                <tr key={c.customerId} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.businessName || c.customerCode}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{c.phone || "—"}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">₹{c.totalInvoiced?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">₹{c.totalPaid?.toLocaleString()}</td>
                  <td className={`px-6 py-4 font-bold ${c.outstandingBalance > 0 ? "text-red-600" : "text-emerald-700"}`}>
                    ₹{c.outstandingBalance?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

