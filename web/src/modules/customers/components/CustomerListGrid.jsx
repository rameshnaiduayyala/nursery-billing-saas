import React from "react";
import { User, Phone, MapPin, Edit2, Trash2, Eye } from "lucide-react";

export function CustomerListGrid({
  customers = [],
  onEdit,
  onDelete,
  onViewLedger,
}) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E2EAE3] bg-white p-12 text-center text-[#64748B]">
        <User size={40} className="mx-auto mb-3 text-[#A8C9A5]" />
        <h3 className="font-bold text-[#1F2937] text-base">No customers found</h3>
        <p className="mt-1 text-xs text-[#64748B]">
          Click "Add Customer" to register your first retail buyer or wholesale account.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {customers.map((c) => {
        const hasDue = (c.outstandingBalance || 0) > 0;
        return (
          <div
            key={c._id || c.id}
            className="rounded-2xl border border-[#E2EAE3] bg-white p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#123D2B]/10 text-[#123D2B]">
                    <User size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F2937] text-base leading-tight">{c.name}</h3>
                    <div className="text-xs text-[#64748B]">
                      {c.businessName || <span className="font-mono">{c.customerCode}</span>}
                    </div>
                  </div>
                </div>
                <span className="rounded-md bg-[#A8C9A5]/25 border border-[#A8C9A5]/40 px-2 py-0.5 text-[10px] font-bold uppercase text-[#123D2B]">
                  {c.customerType}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[#64748B]" />
                  <span className="font-medium text-[#1F2937]">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#64748B]" />
                  <span>{c.billingAddress?.city || "Location not set"}</span>
                </div>
              </div>

              {/* Financial Balance Strip */}
              <div className="mt-4 rounded-xl border border-[#E2EAE3] bg-[#F5F7F1]/80 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Outstanding Due</span>
                  <div
                    className={`text-base font-extrabold ${
                      hasDue ? "text-rose-600" : "text-[#176B45]"
                    }`}
                  >
                    ₹{Number(c.outstandingBalance || 0).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Invoices</span>
                  <div className="text-xs font-bold text-[#1F2937]">
                    {c.invoicesCount || 0} bills
                  </div>
                </div>
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="mt-5 border-t border-[#E2EAE3] pt-3.5 flex items-center justify-between text-xs">
              <button
                onClick={() => onViewLedger(c)}
                className="inline-flex items-center gap-1 font-bold text-[#176B45] hover:underline cursor-pointer"
              >
                <Eye size={13} /> View Ledger
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEdit(c)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E2EAE3] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition cursor-pointer"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => onDelete(c)}
                  className="inline-flex items-center rounded-lg border border-rose-200 bg-white p-1.5 text-xs text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Delete Customer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomerListGrid;

