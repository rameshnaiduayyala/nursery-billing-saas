import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../../lib/api";

export function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [chargeTemplates, setChargeTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [invRes, custRes, brRes, prodRes, chgRes] = await Promise.all([
        apiRequest("/invoices").catch(() => ({ data: [] })),
        apiRequest("/customers").catch(() => ({ data: [] })),
        apiRequest("/branches").catch(() => ({ data: [] })),
        apiRequest("/products").catch(() => ({ data: [] })),
        apiRequest("/charges/templates").catch(() => ({ data: [] })),
      ]);

      if (invRes.data) setInvoices(invRes.data);
      if (custRes.data) setCustomers(custRes.data);
      if (brRes.data) setBranches(brRes.data);
      if (prodRes.data) setProducts(prodRes.data);
      if (chgRes.data) setChargeTemplates(chgRes.data);
    } catch (err) {
      setError(err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createInvoice = async (invoicePayload) => {
    try {
      setSubmitting(true);
      const res = await apiRequest("/invoices", {
        method: "POST",
        body: JSON.stringify(invoicePayload),
      });
      if (res.success || res.data) {
        await loadData();
        return { success: true, data: res.data };
      }
      return { success: false, error: "Failed to create invoice" };
    } catch (err) {
      return { success: false, error: err.message || "Network error" };
    } finally {
      setSubmitting(false);
    }
  };

  const updateInvoice = async (id, invoicePayload) => {
    try {
      setSubmitting(true);
      const res = await apiRequest(`/invoices/${id}`, {
        method: "PUT",
        body: JSON.stringify(invoicePayload),
      });
      if (res.success || res.data) {
        await loadData();
        return { success: true, data: res.data };
      }
      return { success: false, error: "Failed to update invoice" };
    } catch (err) {
      return { success: false, error: err.message || "Network error" };
    } finally {
      setSubmitting(false);
    }
  };

  const cancelInvoice = async (id, reason = "Cancelled by user") => {
    try {
      setSubmitting(true);
      const res = await apiRequest(`/invoices/${id}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      if (res.success || res.data) {
        await loadData();
        return { success: true, data: res.data };
      }
      return { success: false, error: "Failed to cancel invoice" };
    } catch (err) {
      return { success: false, error: err.message || "Network error" };
    } finally {
      setSubmitting(false);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      setSubmitting(true);
      const res = await apiRequest(`/invoices/${id}`, {
        method: "DELETE",
      });
      if (res.success) {
        await loadData();
        return { success: true };
      }
      return { success: false, error: "Failed to delete invoice" };
    } catch (err) {
      return { success: false, error: err.message || "Network error" };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    invoices,
    customers,
    branches,
    products,
    chargeTemplates,
    loading,
    submitting,
    error,
    loadData,
    createInvoice,
    updateInvoice,
    cancelInvoice,
    deleteInvoice,
  };
}

