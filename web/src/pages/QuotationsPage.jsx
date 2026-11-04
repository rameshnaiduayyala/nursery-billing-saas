import React, { useState } from "react";
import { Plus, ArrowRight, CheckCircle, FileText, Share2, Printer } from "lucide-react";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState([
    {
      _id: "qt-1",
      quotationNumber: "QT-0005",
      customerName: "Balaji Agro Farms",
      date: "2026-11-04",
      subtotal: 85000,
      chargesTotal: 6500,
      grandTotal: 91500,
      status: "SENT",
    },
    {
      _id: "qt-2",
      quotationNumber: "QT-0004",
      customerName: "GreenScape Landscaping LLP",
      date: "2026-11-02",
      subtotal: 42000,
      chargesTotal: 4500,
      grandTotal: 46500,
      status: "CONVERTED",
    },
  ]);

  const handleConvert = (id) => {
    setQuotations(
      quotations.map((q) => (q._id === id ? { ...q, status: "CONVERTED" } : q))
    );
    alert("Quotation converted to Invoice successfully!");
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
            {quotations.map((q) => (
              <tr key={q._id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">{q.quotationNumber}</td>
                <td className="px-6 py-4 text-slate-800">{q.customerName}</td>
                <td className="px-6 py-4 text-slate-500">{q.date}</td>
                <td className="px-6 py-4 text-slate-700">₹{q.subtotal.toLocaleString("en-IN")}</td>
                <td className="px-6 py-4 text-emerald-800 font-medium">₹{q.chargesTotal.toLocaleString("en-IN")}</td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{q.grandTotal.toLocaleString("en-IN")}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      q.status === "CONVERTED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {q.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {q.status !== "CONVERTED" ? (
                    <button
                      onClick={() => handleConvert(q._id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
                    >
                      Convert to Invoice <ArrowRight size={13} />
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Converted to Invoice</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

