import React, { useEffect, useState } from "react";
import { Plus, ArrowRight, CheckCircle, FileText, Share2, Printer, Loader2 } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [convertingId, setConvertingId] = useState(null);

  const loadQuotations = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/quotations");
      if (res.data) setQuotations(res.data);
    } catch (err) {
      console.error("Failed to load quotations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, []);

  const handleConvert = async (id) => {
    try {
      setConvertingId(id);
      const res = await apiRequest(`/quotations/${id}/convert-to-invoice`, {
        method: "POST",
      });
      if (res.success) {
        alert(`Quotation converted to Invoice: ${res.data?.invoiceNumber || "Done"}`);
        loadQuotations();
      }
    } catch (err) {
      alert("Conversion error: " + err.message);
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quotations & Price Estimates</h1>
          <p className="text-sm text-slate-500">
            Generate plant estimates with freight, share via WhatsApp/PDF, and convert to invoice with 1 click.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 size={32} className="animate-spin text-emerald-700 mb-2" />
            <span className="text-sm">Fetching quotations...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Quote #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Subtotal</th>
                <th className="px-6 py-4">Freight & Charges</th>
                <th className="px-6 py-4">Estimate Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                    No quotations generated yet.
                  </td>
                </tr>
              ) : (
                quotations.map((q) => (
                  <tr key={q._id || q.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{q.quotationNumber}</td>
                    <td className="px-6 py-4 text-slate-800">
                      {q.customerId?.name || q.customerId?.businessName || q.customerName || "Customer"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {q.quotationDate ? new Date(q.quotationDate).toLocaleDateString() : q.date || "Today"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">₹{Number(q.subtotal || 0).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-emerald-800 font-medium">
                      ₹{Number(q.chargesTotal || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{Number(q.grandTotal || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          q.status === "CONVERTED"
                            ? "bg-emerald-50 text-emerald-700"
                            : q.status === "ACCEPTED"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {q.status !== "CONVERTED" ? (
                        <button
                          onClick={() => handleConvert(q._id || q.id)}
                          disabled={convertingId === (q._id || q.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm disabled:opacity-50"
                        >
                          {convertingId === (q._id || q.id) ? (
                            "Converting..."
                          ) : (
                            <>
                              Convert to Invoice <ArrowRight size={13} />
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Converted to Invoice</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

