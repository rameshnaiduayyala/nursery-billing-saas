import React, { useEffect, useState } from "react";
import { UserCheck, FileText, Receipt, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function CustomerPortalPage() {
  const [profile, setProfile] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("quotations");

  const loadPortalData = async () => {
    try {
      setLoading(true);
      setError("");
      const [profRes, quotRes, invRes, ledRes] = await Promise.all([
        apiRequest("/portal/me"),
        apiRequest("/portal/quotations"),
        apiRequest("/portal/invoices"),
        apiRequest("/portal/ledger"),
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (quotRes.success) setQuotations(quotRes.data || []);
      if (invRes.success) setInvoices(invRes.data || []);
      if (ledRes.success) setLedger(ledRes.data);
    } catch (err) {
      setError(err.message || "Failed to load customer portal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const handleRespond = async (id, status) => {
    try {
      const res = await apiRequest(`/portal/quotations/${id}/respond`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });
      if (res.success) {
        alert(`Quotation ${status.toLowerCase()} successfully!`);
        await loadPortalData();
      }
    } catch (err) {
      alert(err.message || "Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Self-Service Portal</h1>
          <p className="text-sm text-slate-500">
            Welcome, {profile?.name || "Customer"}. View quotations, approve orders, and download receipts.
          </p>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setTab("quotations")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === "quotations" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quotations
          </button>
          <button
            onClick={() => setTab("invoices")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === "invoices" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setTab("ledger")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === "ledger" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Account Ledger
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
      ) : tab === "quotations" ? (
        <div className="space-y-4">
          {quotations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
              No quotations available for review.
            </div>
          ) : (
            quotations.map((q) => (
              <div key={q._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{q.quotationNumber}</h3>
                    <div className="text-xs text-slate-500">Issued: {new Date(q.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase text-slate-700">
                    {q.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="text-lg font-bold text-slate-900">Total: ₹{q.grandTotal?.toLocaleString()}</div>
                  {q.status === "SENT" || q.status === "DRAFT" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespond(q._id, "REJECTED")}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleRespond(q._id, "ACCEPTED")}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        Accept Quotation
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Response recorded</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : tab === "invoices" ? (
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
              No invoices found.
            </div>
          ) : (
            invoices.map((inv) => (
              <div key={inv._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-900">{inv.invoiceNumber}</h3>
                  <div className="text-xs text-slate-500">
                    Date: {new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">₹{inv.grandTotal?.toLocaleString()}</div>
                  <span className="text-xs font-semibold text-emerald-600">{inv.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">Outstanding Balance</h3>
            <div className="mt-1 text-3xl font-extrabold text-red-600">
              ₹{ledger?.summary?.closingBalance?.toLocaleString() || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

