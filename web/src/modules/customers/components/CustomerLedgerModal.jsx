import React from "react";
import { X } from "lucide-react";

export function CustomerLedgerModal({
  isOpen,
  customerDetail,
  onClose,
}) {
  if (!isOpen || !customerDetail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D2B]/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-[#E2EAE3] animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]">{customerDetail.name}</h2>
            <span className="text-xs text-[#64748B]">
              Code: {customerDetail.customerCode} | Phone: {customerDetail.phone}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#64748B] hover:bg-[#F5F7F1] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="my-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#E2EAE3] bg-[#F5F7F1] p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Total Invoiced</span>
            <div className="text-base font-bold text-[#1F2937]">
              ₹{Number(customerDetail.totalInvoiced || 0).toLocaleString("en-IN")}
            </div>
          </div>
          <div className="rounded-xl border border-[#A8C9A5]/50 bg-emerald-50/40 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-[#176B45]">Total Paid</span>
            <div className="text-base font-bold text-[#176B45]">
              ₹{Number(customerDetail.totalPaid || 0).toLocaleString("en-IN")}
            </div>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-rose-700">Closing Due</span>
            <div className="text-base font-extrabold text-rose-600">
              ₹{Number(customerDetail.outstandingBalance || 0).toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Recent Invoices */}
          <div>
            <h4 className="text-xs font-bold uppercase text-[#1F2937] mb-2">Recent Invoices</h4>
            {customerDetail.recentInvoices?.length === 0 ? (
              <div className="text-xs text-[#64748B] italic">No issued invoices yet.</div>
            ) : (
              <div className="space-y-1.5">
                {customerDetail.recentInvoices?.map((inv) => (
                  <div
                    key={inv._id}
                    className="flex items-center justify-between rounded-xl border border-[#E2EAE3] p-2.5 text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#1F2937]">{inv.invoiceNumber}</span>
                      <span className="ml-2 text-[11px] text-[#64748B]">
                        {new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1F2937]">
                        ₹{Number(inv.grandTotal || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#64748B]">
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Payments */}
          <div>
            <h4 className="text-xs font-bold uppercase text-[#1F2937] mb-2">Payment Receipts</h4>
            {customerDetail.recentPayments?.length === 0 ? (
              <div className="text-xs text-[#64748B] italic">No payments recorded yet.</div>
            ) : (
              <div className="space-y-1.5">
                {customerDetail.recentPayments?.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between rounded-xl border border-[#E2EAE3] p-2.5 text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#176B45]">Receipt #{p.receiptNumber || p._id.slice(-6)}</span>
                      <span className="ml-2 text-[11px] text-[#64748B]">{p.paymentMethod}</span>
                    </div>
                    <div className="font-bold text-[#176B45]">
                      +₹{Number(p.amount || 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end border-t border-[#E2EAE3] pt-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#123D2B] px-5 py-2 text-xs font-bold text-white hover:bg-[#176B45] cursor-pointer"
          >
            Close Statement
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerLedgerModal;

