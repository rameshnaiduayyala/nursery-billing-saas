import React from "react";
import { Printer, X } from "lucide-react";

export default function InvoiceDetailModal({ invoice, onClose }) {
  if (!invoice) return null;

  return (
    <div className="rounded-2xl border border-[#E2EAE3] bg-white p-8 shadow-xs max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-start border-b border-[#E2EAE3] pb-6">
        <div>
          <span className="rounded bg-[#123D2B] text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
            Non-GST Invoice
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-[#1F2937]">{invoice.invoiceNumber}</h2>
          <p className="text-xs text-[#64748B]">
            Date: {new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] cursor-pointer"
          >
            <Printer size={15} /> Print Invoice
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E2EAE3] p-2 text-[#64748B] hover:bg-[#F5F7F1] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="font-bold uppercase text-[#64748B]">Billed To:</span>
          <div className="mt-1 font-bold text-sm text-[#1F2937]">
            {invoice.customerSnapshot?.name || invoice.customerId?.name}
          </div>
          <div className="text-[#64748B]">
            {invoice.customerSnapshot?.phone || invoice.customerId?.phone}
          </div>
        </div>
        <div className="text-right">
          <span className="font-bold uppercase text-[#64748B]">Issued By:</span>
          <div className="mt-1 font-bold text-sm text-[#1F2937]">
            {invoice.branchId?.name || "Main Branch"}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-[#E2EAE3] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F7F1] border-b border-[#E2EAE3] text-[#64748B] uppercase font-bold">
            <tr>
              <th className="p-3">Item Description</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Rate</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2EAE3]">
            {invoice.items?.map((it, idx) => (
              <tr key={idx}>
                <td className="p-3 font-medium text-[#1F2937]">
                  <div>{it.plantName || it.description}</div>
                  {it.variety && <div className="text-[11px] text-[#64748B]">Variety: {it.variety}</div>}
                  {it.plantSize && <div className="text-[11px] text-[#64748B]">Size: {it.plantSize}</div>}
                </td>
                <td className="p-3 text-center">{it.quantity} {it.unitName}</td>
                <td className="p-3 text-right">₹{Number(it.unitPrice).toLocaleString("en-IN")}</td>
                <td className="p-3 text-right font-bold text-[#123D2B]">
                  ₹{Number(it.lineTotal).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Charges */}
      {invoice.charges?.length > 0 && (
        <div className="rounded-xl border border-[#E2EAE3] p-3 text-xs space-y-1">
          <div className="font-bold text-[#1F2937] uppercase text-[11px] mb-1">Additional Charges:</div>
          {invoice.charges.map((ch, idx) => (
            <div key={idx} className="flex justify-between text-[#64748B]">
              <span>
                {ch.name}
                {ch.description ? ` (${ch.description})` : ""}
              </span>
              <span className="font-bold text-[#123D2B]">+₹{Number(ch.amount).toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      )}

      {invoice.discountAmount > 0 && (
        <div className="flex justify-between text-xs text-rose-600 font-semibold px-2">
          <span>Overall Discount:</span>
          <span>-₹{Number(invoice.discountAmount).toLocaleString("en-IN")}</span>
        </div>
      )}

      <div className="flex justify-between items-center border-t border-[#E2EAE3] pt-4 text-base">
        <span className="font-extrabold text-[#1F2937]">Grand Total:</span>
        <span className="text-xl font-extrabold text-[#123D2B]">
          ₹{Number(invoice.grandTotal).toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

