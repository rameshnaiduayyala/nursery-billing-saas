import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../../lib/api";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [empRes, branchRes, roleRes] = await Promise.all([
        apiRequest("/employees").catch(() => ({ data: [] })),
        apiRequest("/branches").catch(() => ({ data: [] })),
        apiRequest("/roles").catch(() => ({ data: [] })),
      ]);

      if (empRes.success && Array.isArray(empRes.data)) {
        setEmployees(empRes.data);
      }
      if (branchRes.success && Array.isArray(branchRes.data)) {
        setBranches(branchRes.data);
      }
      if (roleRes.success && Array.isArray(roleRes.data)) {
        setRoles(roleRes.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load staff records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveEmployee = async ({ isEditing, employeeId, payload }) => {
    if (isEditing) {
      return await apiRequest(`/employees/${employeeId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } else {
      return await apiRequest("/employees", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
  };

  const deleteEmployee = async (employeeId) => {
    return await apiRequest(`/employees/${employeeId}`, {
      method: "DELETE",
    });
  };

  const toggleStatus = async (employeeId, nextStatus) => {
    return await apiRequest(`/employees/${employeeId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });
  };

  return {
    employees,
    branches,
    roles,
    loading,
    error,
    loadData,
    saveEmployee,
    deleteEmployee,
    toggleStatus,
  };
}

export default useEmployees;

