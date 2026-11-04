import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RotateCw, AlertCircle, X } from "lucide-react";
import { useInvoices } from "./hooks/useInvoices";
import InvoiceListTable from "./components/InvoiceListTable";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceDetailModal from "./components/InvoiceDetailModal";

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const {
    invoices,
    customers,
    branches,
    products,
    loading,
    submitting,
    error,
    loadData,
    updateInvoice,
    cancelInvoice,
    deleteInvoice,
  } = useInvoices();

  const handleEditSubmit = async (payload) => {
    if (!editingInvoice) return;
    const res = await updateInvoice(editingInvoice._id || editingInvoice.id, payload);
    if (res.success) {
      setEditingInvoice(null);
    } else {
      alert("Error updating invoice: " + (res.error || "Unknown error"));
    }
  };

  const handleCancel = async (inv) => {
    const reason = window.prompt(
      `Are you sure you want to cancel Invoice ${inv.invoiceNumber}? Enter reason:`,
      "Customer request / cancelled order"
    );
    if (reason !== null) {
      const res = await cancelInvoice(inv._id || inv.id, reason);
      if (!res.success) {
        alert("Failed to cancel invoice: " + res.error);
      }
    }
  };

  const handleDelete = async (inv) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete Invoice ${inv.invoiceNumber}? This will reverse the customer ledger entry.`
    );
    if (confirmed) {
      const res = await deleteInvoice(inv._id || inv.id);
      if (!res.success) {
        alert("Failed to delete invoice: " + res.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Non-GST Invoices & Billing</h1>
          <p className="text-sm text-[#64748B]">
            Issue immutable non-GST bills, customized plant line items, loading/freight tariffs, and customer ledger entries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
          >
            <RotateCw size={14} /> Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate("/invoices/create")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#123D2B] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#176B45] transition cursor-pointer"
          >
            <Plus size={18} /> Create Invoice
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Invoices List Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E2EAE3] bg-white shadow-xs">
        <InvoiceListTable
          invoices={invoices}
          loading={loading}
          onViewInvoice={(invoice) => setSelectedInvoice(invoice)}
          onEditInvoice={(invoice) => setEditingInvoice(invoice)}
          onCancelInvoice={handleCancel}
          onDeleteInvoice={handleDelete}
        />
      </div>

      {/* 3. Edit Invoice Modal / Overlay */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-[#E2EAE3]">
            <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1F2937]">
                  Edit Invoice {editingInvoice.invoiceNumber}
                </h2>
                <p className="text-xs text-[#64748B]">
                  Modify plant line items, custom columns, or delivery tariffs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingInvoice(null)}
                className="rounded-xl border border-[#E2EAE3] p-1.5 text-[#64748B] hover:bg-[#F5F7F1] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <InvoiceForm
              initialData={editingInvoice}
              customers={customers}
              branches={branches}
              products={products}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingInvoice(null)}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* 4. View Modal (Printable snapshot preview) */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
