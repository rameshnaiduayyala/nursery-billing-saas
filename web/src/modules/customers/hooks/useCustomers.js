import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../../lib/api";

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiRequest("/customers");
      if (res.success && Array.isArray(res.data)) {
        setCustomers(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load customers from API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const saveCustomer = async ({ isEditing, customerId, payload }) => {
    if (isEditing) {
      return await apiRequest(`/customers/${customerId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } else {
      return await apiRequest("/customers", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
  };

  const deleteCustomer = async (customerId) => {
    return await apiRequest(`/customers/${customerId}`, {
      method: "DELETE",
    });
  };

  const getCustomerLedger = async (customerId) => {
    return await apiRequest(`/customers/${customerId}`);
  };

  return {
    customers,
    loading,
    error,
    loadCustomers,
    saveCustomer,
    deleteCustomer,
    getCustomerLedger,
  };
}

export default useCustomers;

