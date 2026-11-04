import React from "react";
import { Receipt, Eye, Edit2, Ban, Trash2, Loader2 } from "lucide-react";

export default function InvoiceListTable({
  invoices,
  loading,
  onViewInvoice,
  onEditInvoice,
  onCancelInvoice,
  onDeleteInvoice,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#64748B]">
        <Loader2 size={32} className="animate-spin text-[#176B45] mb-2" />
        <span className="text-sm">Fetching invoices...</span>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="p-12 text-center text-[#64748B]">
        <Receipt size={40} className="mx-auto mb-3 text-[#A8C9A5]" />
        <h3 className="font-bold text-[#1F2937] text-base">No invoices issued yet</h3>
        <p className="mt-1 text-xs text-[#64748B]">Click "Create Invoice" to issue your first non-GST bill.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#E2EAE3] bg-[#F5F7F1]/80 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          <tr>
            <th className="px-6 py-4">Invoice #</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Branch</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Amount (₹)</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2EAE3]">
          {invoices.map((inv) => {
            const isCancelled = inv.status === "CANCELLED";

            return (
              <tr key={inv._id || inv.id} className="hover:bg-[#F5F7F1]/50 transition">
                <td className="px-6 py-4 font-mono font-bold text-[#1F2937]">
                  {inv.invoiceNumber}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-[#1F2937]">
                    {inv.customerSnapshot?.name || inv.customerId?.name || "Customer"}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    {inv.customerSnapshot?.phone || inv.customerId?.phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-[#1F2937] text-xs">
                  {inv.branchId?.name || "Main Branch"}
                </td>
                <td className="px-6 py-4 text-xs text-[#64748B]">
                  {new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-extrabold text-[#123D2B]">
                  ₹{Number(inv.grandTotal || 0).toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${
                      isCancelled
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-[#176B45]/10 border border-[#176B45]/20 text-[#176B45]"
                    }`}
                  >
                    {inv.status || "ISSUED"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Button */}
                    <button
                      type="button"
                      onClick={() => onViewInvoice(inv)}
                      title="View Bill"
                      className="inline-flex items-center gap-1 rounded-lg border border-[#E2EAE3] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition cursor-pointer"
                    >
                      <Eye size={13} />
                    </button>

                    {/* Edit Button */}
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => onEditInvoice(inv)}
                        title="Edit Invoice"
                        className="inline-flex items-center gap-1 rounded-lg border border-[#E2EAE3] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition cursor-pointer"
                      >
                        <Edit2 size={13} className="text-[#176B45]" />
                      </button>
                    )}

                    {/* Cancel Button */}
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => onCancelInvoice(inv)}
                        title="Cancel Invoice"
                        className="inline-flex items-center gap-1 rounded-lg border border-[#E2EAE3] bg-white px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                      >
                        <Ban size={13} />
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => onDeleteInvoice(inv)}
                      title="Delete Invoice"
                      className="inline-flex items-center gap-1 rounded-lg border border-[#E2EAE3] bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
