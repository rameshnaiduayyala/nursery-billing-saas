import React, { useState } from "react";
import { Download, X, Loader2, FileText, LayoutTemplate, Printer, Sparkles } from "lucide-react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ProfessionalInvoicePDF from "./ProfessionalInvoicePDF";

export default function InvoiceDetailModal({ invoice, onClose }) {
  if (!invoice) return null;

  const [viewType, setViewType] = useState("pdf"); // 'pdf' | 'summary'

  const isQuotation = invoice.documentType === "QUOTATION";
  const isCancelled = invoice.status === "CANCELLED";
  const fileName = `${invoice.invoiceNumber || (isQuotation ? "QUOTATION" : "INVOICE")}.pdf`;

  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;
    if (typeof addr === "object") {
      return [addr.street || addr.line1, addr.city, addr.state, addr.pincode || addr.postalCode]
        .filter(Boolean)
        .join(", ");
    }
    return String(addr);
  };

  const customerName =
    invoice.customerSnapshot?.name ||
    invoice.customerId?.name ||
    "Valued Customer";
  const customerPhone =
    invoice.customerSnapshot?.phone || invoice.customerId?.phone;
  const customerAddress = formatAddress(invoice.customerSnapshot?.address);

  const nurseryName =
    invoice.organizationSnapshot?.name ||
    invoice.organizationId?.name ||
    "NurseryDesk Farms & Agro";
  const nurseryPhone = invoice.organizationSnapshot?.phone || invoice.organizationId?.phone;
  const nurseryEmail = invoice.organizationSnapshot?.email || invoice.organizationId?.email;
  const nurseryAddress = formatAddress(invoice.organizationSnapshot?.address || invoice.organizationId?.address);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-3 sm:p-5 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Top Decorative Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0B2E1E] via-[#1B593B] to-[#C5A059]" />

        {/* Modal Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#E2E8E0] bg-white px-6 py-3.5 gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-2xs ${
                isCancelled
                  ? "bg-rose-100 text-rose-800 border border-rose-300"
                  : isQuotation
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-[#0B2E1E] text-[#FBF7EE] border border-[#C5A059]/40"
              }`}
            >
              <Sparkles size={11} className={isCancelled ? "text-rose-600" : isQuotation ? "text-amber-700" : "text-[#C5A059]"} />
              {isCancelled ? "Cancelled" : isQuotation ? "Quotation Estimate" : "Non-GST Invoice"}
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
                {invoice.invoiceNumber}
              </h2>
              <p className="text-[11px] text-[#64748B]">
                {customerName} ·{" "}
                {new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-[#F4F7F4] p-1 border border-[#E2E8E0]">
              <button
                type="button"
                onClick={() => setViewType("pdf")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewType === "pdf"
                    ? "bg-[#0B2E1E] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <FileText size={13} /> PDF Document
              </button>
              <button
                type="button"
                onClick={() => setViewType("summary")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewType === "summary"
                    ? "bg-[#0B2E1E] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <LayoutTemplate size={13} /> Item Breakdown
              </button>
            </div>

            {/* Direct Download Button */}
            <PDFDownloadLink
              document={<ProfessionalInvoicePDF invoice={invoice} />}
              fileName={fileName}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0B2E1E] bg-[#0B2E1E] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#13422C] transition cursor-pointer shadow-xs"
            >
              {({ loading }) => (
                <>
                  {loading ? <Loader2 size={13} className="animate-spin text-[#C5A059]" /> : <Download size={13} />}
                  <span>{loading ? "Preparing..." : "Download PDF"}</span>
                </>
              )}
            </PDFDownloadLink>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E2E8E0] p-1.5 text-[#64748B] hover:bg-[#F4F7F4] hover:text-[#0F172A] transition cursor-pointer"
              title="Close Preview"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto bg-[#F8FAFC] p-4 sm:p-6">
          {viewType === "pdf" ? (
            <div className="w-full h-full rounded-2xl overflow-hidden border border-[#E2E8E0] bg-white shadow-xs">
              <PDFViewer
                width="100%"
                height="100%"
                showToolbar={true}
                className="w-full h-full border-0"
              >
                <ProfessionalInvoicePDF invoice={invoice} />
              </PDFViewer>
            </div>
          ) : (
            <div className="relative rounded-3xl border border-[#E2E8E0] bg-white p-7 shadow-xs max-w-3xl mx-auto space-y-6 overflow-hidden">
              {/* Cancelled Diagonal Stamp Overlay */}
              {isCancelled && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-6xl font-black text-rose-500/15 tracking-widest uppercase border-4 border-rose-500/20 px-10 py-4 rounded-3xl -rotate-12 select-none">
                    CANCELLED
                  </span>
                </div>
              )}

              {/* Header inside summary view */}
              <div className="flex justify-between items-start border-b border-[#E2E8E0] pb-5">
                <div>
                  <h3 className="font-serif text-2xl font-bold uppercase tracking-wide text-[#0B2E1E] leading-snug">
                    {nurseryName}
                  </h3>
                  <p className="text-xs text-[#9A7836] italic font-serif mt-0.5">
                    Horticulture Plants • Farm Nursery & Landscaping
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    {isQuotation ? "Quotation No." : "Invoice No."}
                  </div>
                  <div className="text-lg font-mono font-bold text-[#0B2E1E]">
                    {invoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Date: {new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Party Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E2E8E0] bg-[#FAFBF9] p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2E1E] mb-2 pb-2 border-b border-[#E2E8E0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                    Billed To / Consignee
                  </div>
                  <div className="font-serif font-bold text-sm text-[#0F172A]">{customerName}</div>
                  {invoice.customerSnapshot?.businessName && (
                    <div className="text-xs font-semibold text-[#13422C]">
                      {invoice.customerSnapshot.businessName}
                    </div>
                  )}
                  {customerPhone && (
                    <div className="text-xs text-[#64748B]">Contact: {customerPhone}</div>
                  )}
                  {customerAddress && (
                    <div className="text-xs text-[#64748B]">{customerAddress}</div>
                  )}
                </div>

                <div className="rounded-2xl border border-[#E2E8E0] bg-[#FAFBF9] p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2E1E] mb-2 pb-2 border-b border-[#E2E8E0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                    Issued By / Nursery Provider
                  </div>
                  <div className="font-serif font-bold text-sm text-[#0B2E1E]">{nurseryName}</div>
                  {nurseryPhone && (
                    <div className="text-xs text-[#64748B]">Direct: {nurseryPhone}</div>
                  )}
                  {nurseryEmail && (
                    <div className="text-xs text-[#64748B]">Email: {nurseryEmail}</div>
                  )}
                  {nurseryAddress && (
                    <div className="text-xs text-[#64748B]">{nurseryAddress}</div>
                  )}
                </div>
              </div>

              {/* Plant Items Table */}
              <div className="rounded-2xl border border-[#E2E8E0] overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B2E1E] text-white uppercase text-[10.5px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Plant Name & Specification</th>
                      <th className="p-3.5 text-center">Qty</th>
                      <th className="p-3.5 text-right">Rate</th>
                      <th className="p-3.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E0]">
                    {invoice.items?.map((it, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? "bg-[#FAFBF9]" : "bg-white"}>
                        <td className="p-3.5 text-[#0F172A]">
                          <div className="font-bold text-sm text-[#0F172A]">
                            {it.plantName || it.description}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#64748B]">
                            {it.variety && <span>Variety: <strong className="text-[#334155]">{it.variety}</strong></span>}
                            {it.variety && it.plantSize && <span>•</span>}
                            {it.plantSize && <span>Size: <strong className="text-[#334155]">{it.plantSize}</strong></span>}
                          </div>
                        </td>
                        <td className="p-3.5 text-center font-semibold text-[#334155]">
                          {it.quantity} {it.unitName || "PCS"}
                        </td>
                        <td className="p-3.5 text-right text-[#334155]">
                          ₹{Number(it.unitPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3.5 text-right font-bold text-[#0B2E1E]">
                          ₹{Number(it.lineTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Additional Charges Section */}
              {invoice.charges?.length > 0 && (
                <div className="rounded-2xl border border-[#E2E8E0] bg-[#FAFBF9] p-4 text-xs space-y-2">
                  <div className="font-bold text-[#0B2E1E] uppercase text-[11px] tracking-wider mb-1">
                    Additional Charges & Freight Services:
                  </div>
                  {invoice.charges.map((ch, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[#64748B] border-b border-[#E2E8E0] pb-1.5 last:border-b-0">
                      <span>
                        • {ch.name}
                        {ch.description ? ` (${ch.description})` : ""}
                      </span>
                      <span className="font-bold text-[#13422C]">
                        +₹{Number(ch.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals Summary Card */}
              <div className="rounded-2xl border border-[#E2E8E0] bg-[#FAFBF9] p-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>Plant Subtotal:</span>
                  <span className="font-bold text-[#0F172A]">
                    ₹{Number(invoice.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {Number(invoice.chargesTotal) > 0 && (
                  <div className="flex justify-between text-[#13422C]">
                    <span>Additional Charges:</span>
                    <span className="font-bold">
                      +₹{Number(invoice.chargesTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {Number(invoice.discountAmount) > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Discount Applied:</span>
                    <span>
                      -₹{Number(invoice.discountAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t-2 border-[#C5A059] pt-3 text-base bg-[#0B2E1E] -mx-4 -mb-4 p-4 rounded-b-2xl">
                  <span className="font-bold text-[#FBF7EE] uppercase tracking-wider text-xs sm:text-sm">
                    Grand Total:
                  </span>
                  <span className="text-xl font-extrabold text-white">
                    ₹{Number(invoice.grandTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="rounded-xl border border-[#E2E8E0] p-3 text-xs text-[#64748B]">
                  <span className="font-bold uppercase tracking-wider text-[#0B2E1E] block mb-1">
                    Notes & Delivery Terms:
                  </span>
                  {invoice.notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
