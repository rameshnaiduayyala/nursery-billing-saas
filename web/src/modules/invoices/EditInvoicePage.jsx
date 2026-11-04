import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { useInvoices } from "./hooks/useInvoices";
import { apiRequest } from "../../lib/api";
import InvoiceForm from "./components/InvoiceForm";

export default function EditInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const {
    customers,
    branches,
    products,
    updateInvoice,
    submitting,
    error,
  } = useInvoices();

  useEffect(() => {
    let isMounted = true;
    const fetchInvoice = async () => {
      try {
        setLoadingInvoice(true);
        setFetchError("");
        const res = await apiRequest(`/invoices/${id}`);
        if (isMounted) {
          if (res.success && res.data) {
            setInvoice(res.data);
          } else {
            setFetchError("Document not found");
          }
        }
      } catch (err) {
        if (isMounted) setFetchError(err.message || "Failed to load document");
      } finally {
        if (isMounted) setLoadingInvoice(false);
      }
    };

    if (id) fetchInvoice();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleEditSubmit = async (payload) => {
    const res = await updateInvoice(id, payload);
    if (res.success) {
      const isQuotation = (invoice?.documentType || payload.documentType) === "QUOTATION";
      navigate(isQuotation ? "/quotations" : "/invoices");
    } else {
      alert("Error updating document: " + (res.error || "Unknown error"));
    }
  };

  const isQuotation = invoice?.documentType === "QUOTATION";
  const returnUrl = isQuotation ? "/quotations" : "/invoices";

  if (loadingInvoice) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-[#64748B]">
        <Loader2 size={36} className="animate-spin text-[#176B45] mb-2" />
        <span className="text-sm font-semibold">Loading document details...</span>
      </div>
    );
  }

  if (fetchError || !invoice) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-800 space-y-4">
        <AlertCircle size={36} className="mx-auto text-red-600" />
        <h2 className="text-lg font-bold">Unable to load document</h2>
        <p className="text-sm">{fetchError || "The requested document could not be found."}</p>
        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#123D2B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#176B45] transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Return to Billing
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(returnUrl)}
            className="inline-flex items-center justify-center rounded-xl border border-[#E2EAE3] bg-white p-2 text-[#1F2937] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
            title="Back to List"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                  isQuotation
                    ? "bg-amber-600 text-white"
                    : "bg-[#123D2B] text-white"
                }`}
              >
                {isQuotation ? "Quotation" : "Non-GST Invoice"}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
                Edit {invoice.invoiceNumber}
              </h1>
            </div>
            <p className="text-sm text-[#64748B] mt-0.5">
              Modify plant items, quantities, rates, custom column fields, or additional freight charges.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(returnUrl)}
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

      {/* Main Invoice / Quotation Edit Form */}
      <InvoiceForm
        initialData={invoice}
        initialDocumentType={invoice.documentType || "INVOICE"}
        customers={customers}
        branches={branches}
        products={products}
        onSubmit={handleEditSubmit}
        onCancel={() => navigate(returnUrl)}
        submitting={submitting}
      />
    </div>
  );
}
