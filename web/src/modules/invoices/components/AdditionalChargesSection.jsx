import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AdditionalChargesSection({
  charges,
  onAddCharge,
  onChargeChange,
  onRemoveCharge,
}) {
  return (
    <div className="mt-8 border-t border-[#E2EAE3] pt-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F2937]">
            Additional Charges ({charges.length})
          </h3>
          <p className="text-xs text-[#64748B]">Add custom charges like Loading, Transport, Labour, Packaging, etc.</p>
        </div>
        <button
          type="button"
          onClick={onAddCharge}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#123D2B]/10 px-3 py-1.5 text-xs font-bold text-[#123D2B] hover:bg-[#123D2B]/20 transition cursor-pointer"
        >
          <Plus size={14} /> Add Charge
        </button>
      </div>

      {charges.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E2EAE3] p-4 text-center text-xs text-[#64748B]">
          No additional charges added. Click "+ Add Charge" to add custom delivery, freight or labour fees.
        </div>
      ) : (
        <div className="space-y-2.5">
          {charges.map((ch, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center rounded-xl border border-[#E2EAE3] bg-[#F5F7F1]/50 p-3 text-xs"
            >
              {/* Charge Name */}
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  Charge Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Loading / Transport"
                  value={ch.name}
                  onChange={(e) => onChargeChange(idx, "name", e.target.value)}
                  className="w-full rounded-lg border border-[#E2EAE3] bg-white p-2 text-xs font-semibold text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Open truck delivery to site"
                  value={ch.description}
                  onChange={(e) => onChargeChange(idx, "description", e.target.value)}
                  className="w-full rounded-lg border border-[#E2EAE3] bg-white p-2 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                />
              </div>

              {/* Amount */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={ch.amount}
                  onChange={(e) => onChargeChange(idx, "amount", Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-[#E2EAE3] bg-white p-2 text-xs font-bold text-[#123D2B] focus:border-[#176B45] focus:outline-none"
                />
              </div>

              {/* Remove */}
              <div className="sm:col-span-1 text-right flex sm:justify-end items-end pt-5 sm:pt-0">
                <button
                  type="button"
                  onClick={() => onRemoveCharge(idx)}
                  title="Remove charge"
                  className="p-1.5 text-[#64748B] hover:text-rose-600 rounded-lg hover:bg-white cursor-pointer transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

