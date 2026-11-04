import React from "react";

export default function InvoiceSummaryFooter({
  isEdit = false,
  documentType = "INVOICE",
  notes,
  setNotes,
  subtotal,
  chargesTotal = 0,
  discount,
  setDiscount,
  grandTotal,
  submitting,
  onCancel,
}) {
  return (
    <>
      {/* Customer Notes / Instructions */}
      <div className="mt-8 border-t border-[#E2EAE3] pt-6">
        <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">
          Customer Notes & Delivery Instructions
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Deliver via open truck. Loading completed at Farm Depot."
          className="w-full rounded-xl border border-[#E2EAE3] p-2.5 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
        />
      </div>

      {/* Spacing element so bottom content is never hidden behind sticky bar */}
      <div className="h-28" />

      {/* Sticky Bottom Bar (Constrained to the page area, left-0 md:left-68 so it does not overlap the sidebar) */}
      <div className="fixed bottom-0 left-0 md:left-68 right-0 z-20 border-t border-[#E2EAE3] bg-white/95 backdrop-blur-md px-6 py-3.5 shadow-lg">
        <div className="mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-7xl">
          {/* Left / Totals Summary */}
          <div className="flex flex-wrap items-center gap-6 text-xs">
            {/* Plant Subtotal */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#64748B] font-medium">Plant Subtotal:</span>
              <span className="font-bold text-[#1F2937] text-sm">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Additional Charges (if any) */}
            {chargesTotal > 0 && (
              <div className="flex items-baseline gap-1.5 border-l border-[#E2EAE3] pl-6">
                <span className="text-[#64748B] font-medium">Charges:</span>
                <span className="font-bold text-[#123D2B]">
                  +₹{chargesTotal.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* Overall Discount */}
            <div className="flex items-center gap-2 border-l border-[#E2EAE3] pl-6">
              <span className="text-[#64748B] font-medium">Overall Discount:</span>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-rose-500 font-bold text-xs">₹</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-[#E2EAE3] bg-white py-1 pl-5 pr-2 text-right text-xs text-rose-600 font-bold focus:border-rose-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex items-baseline gap-2 border-l border-[#E2EAE3] pl-6">
              <span className="font-bold text-[#1F2937] uppercase text-[11px] tracking-wider">Grand Total:</span>
              <span className="text-xl font-extrabold text-[#123D2B]">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Right / Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[#E2EAE3] bg-white px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F5F7F1] hover:text-[#1F2937] transition cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#123D2B] px-6 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#176B45] disabled:opacity-50 transition cursor-pointer"
            >
              {submitting
                ? "Saving..."
                : isEdit
                ? `Update ${documentType === "QUOTATION" ? "Quotation" : "Invoice"}`
                : documentType === "QUOTATION"
                ? "Create Quotation"
                : "Issue Non-GST Invoice"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
