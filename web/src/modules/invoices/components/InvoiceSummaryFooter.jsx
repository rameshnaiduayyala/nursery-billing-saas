import React from "react";

export default function InvoiceSummaryFooter({
  isEdit = false,
  notes,
  setNotes,
  subtotal,
  chargesTotal,
  discount,
  setDiscount,
  grandTotal,
  submitting,
  onCancel,
}) {
  return (
    <>
      <div className="mt-8 border-t border-[#E2EAE3] pt-6 flex flex-col sm:flex-row justify-between gap-6">
        <div className="flex-1 max-w-md">
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

        <div className="w-full sm:w-80 space-y-2.5 rounded-2xl border border-[#E2EAE3] bg-[#F5F7F1]/80 p-5 text-sm">
          <div className="flex justify-between text-[#64748B] text-xs">
            <span>Plant Subtotal:</span>
            <span className="font-bold text-[#1F2937]">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          {chargesTotal > 0 && (
            <div className="flex justify-between text-[#64748B] text-xs">
              <span>Additional Charges:</span>
              <span className="font-bold text-[#123D2B]">+₹{chargesTotal.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-xs text-[#64748B]">
            <span>Overall Discount:</span>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              className="w-24 rounded border border-[#E2EAE3] bg-white p-1 text-right text-xs text-rose-600 font-bold"
            />
          </div>
          <div className="border-t border-[#E2EAE3] pt-2 flex justify-between items-center">
            <span className="font-extrabold text-[#1F2937]">Grand Total:</span>
            <span className="text-xl font-extrabold text-[#123D2B]">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex justify-end gap-3 border-t border-[#E2EAE3] pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#E2EAE3] px-5 py-2.5 text-xs font-semibold text-[#64748B] hover:bg-[#F5F7F1] cursor-pointer"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#123D2B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#176B45] disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {submitting ? "Saving..." : isEdit ? "Update Invoice" : "Issue Non-GST Invoice"}
        </button>
      </div>
    </>
  );
}

