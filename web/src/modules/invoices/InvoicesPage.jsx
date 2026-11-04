import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, RotateCw, AlertCircle, X, FileText, ReceiptText } from "lucide-react";
import { useInvoices } from "./hooks/useInvoices";
import InvoiceListTable from "./components/InvoiceListTable";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceDetailModal from "./components/InvoiceDetailModal";

export default function InvoicesPage({ defaultFilter = "ALL" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL path (/quotations -> QUOTATION, /invoices -> INVOICE) or prop
  const getTabFromPath = () => {
    if (location.pathname.startsWith("/quotations")) return "QUOTATION";
    if (location.pathname.startsWith("/invoices")) return "INVOICE";
    return defaultFilter;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Sync tab whenever URL pathname changes (e.g. clicking Quotations vs Invoices in sidebar)
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

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
    convertQuotationToInvoice,
    cancelInvoice,
    deleteInvoice,
  } = useInvoices();

  // Filter list by selected tab
  const displayedInvoices = invoices.filter((inv) => {
    if (activeTab === "ALL") return true;
    return (inv.documentType || "INVOICE") === activeTab;
  });

  const handleEditSubmit = async (payload) => {
    if (!editingInvoice) return;
    const res = await updateInvoice(editingInvoice._id || editingInvoice.id, payload);
    if (res.success) {
      setEditingInvoice(null);
    } else {
      alert("Error updating document: " + (res.error || "Unknown error"));
    }
  };

  const handleConvertQuotation = async (inv) => {
    const confirmed = window.confirm(
      `Convert Quotation ${inv.invoiceNumber} to an official Non-GST Invoice? This will generate a new Invoice number and post the balance of ₹${Number(inv.grandTotal).toLocaleString("en-IN")} to the customer's ledger.`
    );
    if (confirmed) {
      const res = await convertQuotationToInvoice(inv._id || inv.id);
      if (res.success) {
        alert("Quotation successfully converted to Invoice!");
      } else {
        alert("Failed to convert quotation: " + res.error);
      }
    }
  };

  const handleCancel = async (inv) => {
    const isQuotation = inv.documentType === "QUOTATION";
    const reason = window.prompt(
      `Are you sure you want to cancel ${isQuotation ? "Quotation" : "Invoice"} ${inv.invoiceNumber}? Enter reason:`,
      "Customer request / cancelled order"
    );
    if (reason !== null) {
      const res = await cancelInvoice(inv._id || inv.id, reason);
      if (!res.success) {
        alert("Failed to cancel: " + res.error);
      }
    }
  };

  const handleDelete = async (inv) => {
    const isQuotation = inv.documentType === "QUOTATION";
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${isQuotation ? "Quotation" : "Invoice"} ${inv.invoiceNumber}?`
    );
    if (confirmed) {
      const res = await deleteInvoice(inv._id || inv.id);
      if (!res.success) {
        alert("Failed to delete: " + res.error);
      }
    }
  };

  const pageTitle =
    activeTab === "QUOTATION"
      ? "Plant Quotations & Estimates"
      : activeTab === "INVOICE"
      ? "Non-GST Invoices & Billing"
      : "Billing & Quotations";

  const pageSubtitle =
    activeTab === "QUOTATION"
      ? "Draft and issue estimates to customers without affecting ledger balance until converted."
      : "Issue immutable non-GST bills, customized plant line items, tariffs, and customer ledger entries.";

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">{pageTitle}</h1>
          <p className="text-sm text-[#64748B]">{pageSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
          >
            <RotateCw size={14} /> Refresh
          </button>

          {/* Create Button with dynamic default based on current tab */}
          <button
            type="button"
            onClick={() =>
              navigate(
                activeTab === "QUOTATION"
                  ? "/invoices/create?type=quotation"
                  : "/invoices/create?type=invoice"
              )
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#123D2B] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#176B45] transition cursor-pointer"
          >
            <Plus size={18} />
            <span>{activeTab === "QUOTATION" ? "Create Quotation" : "Create Invoice"}</span>
          </button>
        </div>
      </div>

      {/* 2. Document Filter Tabs (All / Invoices / Quotations) */}
      <div className="flex border-b border-[#E2EAE3] gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("ALL");
          }}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "ALL"
              ? "border-[#123D2B] text-[#123D2B]"
              : "border-transparent text-[#64748B] hover:text-[#1F2937]"
          }`}
        >
          <span>All Documents</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-[#64748B]">
            {invoices.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("INVOICE");
            if (location.pathname.startsWith("/quotations")) {
              navigate("/invoices", { replace: true });
            }
          }}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "INVOICE"
              ? "border-[#123D2B] text-[#123D2B]"
              : "border-transparent text-[#64748B] hover:text-[#1F2937]"
          }`}
        >
          <ReceiptText size={14} />
          <span>Invoices</span>
          <span className="rounded-full bg-[#123D2B]/10 px-2 py-0.5 text-[10px] text-[#123D2B] font-bold">
            {invoices.filter((i) => (i.documentType || "INVOICE") === "INVOICE").length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("QUOTATION");
            if (location.pathname.startsWith("/invoices")) {
              navigate("/quotations", { replace: true });
            }
          }}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "QUOTATION"
              ? "border-[#123D2B] text-[#123D2B]"
              : "border-transparent text-[#64748B] hover:text-[#1F2937]"
          }`}
        >
          <FileText size={14} />
          <span>Quotations</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800 font-bold">
            {invoices.filter((i) => i.documentType === "QUOTATION").length}
          </span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. Invoices / Quotations List Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E2EAE3] bg-white shadow-xs">
        <InvoiceListTable
          invoices={displayedInvoices}
          loading={loading}
          onViewInvoice={(invoice) => setSelectedInvoice(invoice)}
          onEditInvoice={(invoice) => setEditingInvoice(invoice)}
          onConvertQuotation={handleConvertQuotation}
          onCancelInvoice={handleCancel}
          onDeleteInvoice={handleDelete}
        />
      </div>

      {/* 4. Edit Modal / Overlay */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-[#E2EAE3]">
            <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1F2937]">
                  Edit {editingInvoice.documentType === "QUOTATION" ? "Quotation" : "Invoice"}{" "}
                  {editingInvoice.invoiceNumber}
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
              initialDocumentType={editingInvoice.documentType || "INVOICE"}
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

      {/* 5. View Modal (Printable snapshot preview) */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
