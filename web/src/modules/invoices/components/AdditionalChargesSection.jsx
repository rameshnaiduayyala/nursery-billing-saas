import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AdditionalChargesSection({
  charges,
  chargeTemplates,
  onAddCharge,
  onChargeChange,
  onRemoveCharge,
}) {
  return (
    <div className="mt-8 border-t border-[#E2EAE3] pt-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F2937]">
            Additional Charges & Freight ({charges.length})
          </h3>
          <p className="text-xs text-[#64748B]">Attach loading, unloading, vehicle, or labour charges</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {chargeTemplates.map((tpl) => (
            <button
              key={tpl._id || tpl.id}
              type="button"
              onClick={() => onAddCharge(tpl)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#E2EAE3] bg-white px-2.5 py-1 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] cursor-pointer"
            >
              + {tpl.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onAddCharge()}
            className="inline-flex items-center gap-1 rounded-lg bg-[#A8C9A5]/30 px-3 py-1 text-xs font-bold text-[#123D2B] hover:bg-[#A8C9A5]/50 cursor-pointer"
          >
            <Plus size={13} /> Custom Charge
          </button>
        </div>
      </div>

      {charges.length > 0 && (
        <div className="space-y-2 mt-3">
          {charges.map((ch, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-2 rounded-xl border border-[#E2EAE3] bg-[#F5F7F1]/50 p-3 sm:grid-cols-5 items-center text-xs"
            >
              <input
                type="text"
                placeholder="Charge Name (e.g. Loading)"
                value={ch.name}
                onChange={(e) => onChargeChange(idx, "name", e.target.value)}
                className="rounded-lg border border-[#E2EAE3] bg-white p-2 text-xs font-semibold text-[#1F2937]"
              />
              <select
                value={ch.calculationType}
                onChange={(e) => onChargeChange(idx, "calculationType", e.target.value)}
                className="rounded-lg border border-[#E2EAE3] bg-white p-2 text-xs text-[#1F2937]"
              >
                <option value="FIXED">Fixed Amount</option>
                <option value="PER_UNIT">Per Unit</option>
                <option value="PER_BAG">Per Bag</option>
                <option value="PER_VEHICLE">Per Vehicle</option>
              </select>
              <input
                type="number"
                placeholder="Qty"
                value={ch.quantity}
                onChange={(e) => onChargeChange(idx, "quantity", e.target.value)}
                className="rounded-lg border border-[#E2EAE3] bg-white p-2 text-xs text-[#1F2937]"
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={ch.amount}
                onChange={(e) => onChargeChange(idx, "amount", Number(e.target.value) || 0)}
                className="rounded-lg border border-[#E2EAE3] bg-white p-2 text-xs font-bold text-[#123D2B]"
              />
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => onRemoveCharge(idx)}
                  className="p-1.5 text-[#64748B] hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

