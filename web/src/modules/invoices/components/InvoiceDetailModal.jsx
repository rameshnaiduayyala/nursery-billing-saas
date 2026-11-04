import React, { useState } from "react";
import { Download, X, Loader2, FileText, LayoutTemplate } from "lucide-react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ProfessionalInvoicePDF from "./ProfessionalInvoicePDF";

export default function InvoiceDetailModal({ invoice, onClose }) {
  if (!invoice) return null;

  const [viewType, setViewType] = useState("pdf"); // 'pdf' | 'summary'

  const isQuotation = invoice.documentType === "QUOTATION";
  const docTitle = isQuotation ? "Quotation" : "Invoice";
  const fileName = `${invoice.invoiceNumber || (isQuotation ? "QUOTATION" : "INVOICE")}.pdf`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs">
      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2EAE3]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E2EAE3] bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <span
              className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                isQuotation
                  ? "bg-amber-600 text-white"
                  : "bg-[#123D2B] text-white"
              }`}
            >
              {isQuotation ? "Quotation" : "Non-GST Invoice"}
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#1F2937] leading-tight">
                {invoice.invoiceNumber}
              </h2>
              <p className="text-[11px] text-[#64748B]">
                {invoice.customerSnapshot?.name || invoice.customerId?.name || "Customer"} ·{" "}
                {new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl bg-[#F5F7F1] p-1 border border-[#E2EAE3]">
              <button
                type="button"
                onClick={() => setViewType("pdf")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewType === "pdf"
                    ? "bg-[#123D2B] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#1F2937]"
                }`}
              >
                <FileText size={14} /> PDF Document
              </button>
              <button
                type="button"
                onClick={() => setViewType("summary")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewType === "summary"
                    ? "bg-[#123D2B] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#1F2937]"
                }`}
              >
                <LayoutTemplate size={14} /> Item Breakdown
              </button>
            </div>

            {/* Direct Download Button */}
            <PDFDownloadLink
              document={<ProfessionalInvoicePDF invoice={invoice} />}
              fileName={fileName}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#123D2B] bg-[#123D2B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#176B45] transition cursor-pointer shadow-xs"
            >
              {({ loading }) => (
                <>
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  <span>{loading ? "Preparing..." : "Download PDF"}</span>
                </>
              )}
            </PDFDownloadLink>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E2EAE3] p-2 text-[#64748B] hover:bg-[#F5F7F1] hover:text-[#1F2937] transition cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto bg-[#F5F7F1] p-4">
          {viewType === "pdf" ? (
            <div className="w-full h-full rounded-xl overflow-hidden border border-[#E2EAE3] bg-white shadow-xs">
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
            <div className="rounded-2xl border border-[#E2EAE3] bg-white p-6 shadow-xs max-w-3xl mx-auto space-y-6">
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
                    {invoice.organizationId?.name || "Nursery Business"}
                  </div>
                  {invoice.organizationId?.phone && (
                    <div className="text-[#64748B] text-xs">
                      Ph: {invoice.organizationId.phone}
                    </div>
                  )}
                  {invoice.organizationId?.address && (
                    <div className="text-[#64748B] text-xs">
                      {typeof invoice.organizationId.address === "object"
                        ? [
                            invoice.organizationId.address.street,
                            invoice.organizationId.address.city,
                            invoice.organizationId.address.state,
                            invoice.organizationId.address.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")
                        : String(invoice.organizationId.address)}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
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
          )}
        </div>
      </div>
    </div>
  );
}

