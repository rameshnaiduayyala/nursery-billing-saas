import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useInvoices } from "./hooks/useInvoices";
import InvoiceForm from "./components/InvoiceForm";

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const {
    customers,
    branches,
    products,
    chargeTemplates,
    createInvoice,
    submitting,
    error,
  } = useInvoices();

  const handleCreateSubmit = async (payload) => {
    const res = await createInvoice(payload);
    if (res.success) {
      navigate("/invoices");
    } else {
      alert("Error issuing invoice: " + (res.error || "Unknown error"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="inline-flex items-center justify-center rounded-xl border border-[#E2EAE3] bg-white p-2 text-[#1F2937] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
            title="Back to Invoices"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Create Non-GST Invoice</h1>
            <p className="text-sm text-[#64748B]">
              Build custom plant bill with dynamic column layout, loading tariffs, and ledger synchronization.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E2EAE3] bg-white px-4 py-2.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition cursor-pointer"
        >
          Cancel & Return
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Invoice Creation Form */}
      <InvoiceForm
        customers={customers}
        branches={branches}
        products={products}
        chargeTemplates={chargeTemplates}
        onSubmit={handleCreateSubmit}
        onCancel={() => navigate("/invoices")}
        submitting={submitting}
      />
    </div>
  );
}

