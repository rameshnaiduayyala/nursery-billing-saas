import React from "react";
import { Hash } from "lucide-react";

export default function InvoiceMetaFields({
  documentType = "INVOICE",
  invoiceNumber,
  setInvoiceNumber,
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
  const isQuotation = documentType === "QUOTATION";

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. Document / Invoice Number (Editable with auto-generated preview) */}
      <div>
        <label className="block text-xs font-semibold uppercase text-[#64748B]">
          {isQuotation ? "Quotation #" : "Invoice #"}
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder={isQuotation ? "Auto (e.g. QTN-2026-0001)" : "Auto (e.g. INV-2026-0001)"}
            className="w-full rounded-xl border border-[#E2EAE3] p-2.5 pl-8 text-sm font-mono font-bold text-[#1F2937] focus:border-[#176B45] focus:outline-none"
          />
          <Hash size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
        </div>
        <p className="mt-1 text-[10px] text-[#64748B]">Auto-generated or custom editable</p>
      </div>

      {/* 2. Customer */}
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

      {/* 3. Nursery Branch */}
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

      {/* 4. Document Date */}
      <div>
        <label className="block text-xs font-semibold uppercase text-[#64748B]">
          {isQuotation ? "Quotation Date" : "Invoice Date"}
        </label>
        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
        />
      </div>

      {/* 5. Due / Validity Date */}
      <div>
        <label className="block text-xs font-semibold uppercase text-[#64748B]">
          {isQuotation ? "Valid Until" : "Due Date"}
        </label>
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
