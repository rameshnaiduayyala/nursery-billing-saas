import React from "react";

export default function InvoiceMetaFields({
  customers,
  branches,
  selectedCustomerId,
  setSelectedCustomerId,
  selectedBranchId,
  setSelectedBranchId,
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="block text-xs font-semibold uppercase text-[#64748B]">Customer</label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
        >
          {customers.map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.name} {c.businessName ? `(${c.businessName})` : ""} - {c.phone}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-[#64748B]">Nursery Branch</label>
        <select
          value={selectedBranchId}
          onChange={(e) => setSelectedBranchId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
        >
          {branches.map((b) => (
            <option key={b._id || b.id} value={b._id || b.id}>
              {b.name} ({b.code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-[#64748B]">Invoice Date</label>
        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-[#64748B]">Payment Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
        />
      </div>
    </div>
  );
}

