import React, { useState } from "react";
import { Plus, RotateCw, AlertCircle, Loader2 } from "lucide-react";
import { useEmployees } from "./hooks/useEmployees";
import { EmployeeListTable } from "./components/EmployeeListTable";
import { EmployeeFormModal } from "./components/EmployeeFormModal";

export default function EmployeesPage() {
  const {
    employees,
    branches,
    roles,
    loading,
    error,
    loadData,
    saveEmployee,
    deleteEmployee,
    toggleStatus,
  } = useEmployees();

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleKey: "SALES_STAFF",
    branchIds: [],
    status: "ACTIVE",
  });

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "Password@123",
      roleKey: "SALES_STAFF",
      branchIds: branches.length > 0 ? [branches[0]._id || branches[0].id] : [],
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    const assignedBranchIds = (emp.branchAccess || []).map(
      (b) => b.branchId?._id || b.branchId?.id || b.branchId
    );

    setFormData({
      name: emp.user?.name || emp.userId?.name || "",
      email: emp.user?.email || emp.userId?.email || "",
      phone: emp.user?.phone || emp.userId?.phone || "",
      password: "",
      roleKey: emp.role?.key || emp.roleId?.key || "SALES_STAFF",
      branchIds: assignedBranchIds.length > 0 ? assignedBranchIds : (branches[0] ? [branches[0]._id] : []),
      status: emp.status || "ACTIVE",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchIds || formData.branchIds.length === 0) {
      alert("Please select at least one branch for this employee.");
      return;
    }

    try {
      setSubmitting(true);
      const isEditing = Boolean(editingEmployee);
      const employeeId = editingEmployee?._id || editingEmployee?.membershipId;

      const payload = {
        name: formData.name,
        phone: formData.phone || null,
        roleKey: formData.roleKey,
        branchIds: formData.branchIds,
        status: formData.status,
      };

      if (!isEditing) {
        payload.email = formData.email;
        payload.password = formData.password || "Password@123";
      } else if (formData.password) {
        payload.password = formData.password;
      }

      const res = await saveEmployee({ isEditing, employeeId, payload });
      if (res.success) {
        setShowModal(false);
        await loadData();
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (emp) => {
    const id = emp._id || emp.membershipId;
    const name = emp.user?.name || emp.userId?.name || "Staff member";
    if (!confirm(`Are you sure you want to remove "${name}" from this nursery?`)) return;

    try {
      const res = await deleteEmployee(id);
      if (res.success) {
        await loadData();
      }
    } catch (err) {
      alert("Error deleting employee: " + err.message);
    }
  };

  const handleToggleStatus = async (emp) => {
    const id = emp._id || emp.membershipId;
    const nextStatus = emp.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await toggleStatus(id, nextStatus);
      if (res.success) {
        await loadData();
      }
    } catch (err) {
      alert("Error toggling status: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Employee & Access Management</h1>
          <p className="text-sm text-[#64748B]">
            Invite staff, configure permissions, and allocate branch-level operational access.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
          >
            <RotateCw size={14} /> Refresh
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-[#123D2B] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#176B45] transition cursor-pointer"
          >
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. List View */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-[#176B45]" size={32} />
        </div>
      ) : (
        <EmployeeListTable
          employees={employees}
          onEdit={handleOpenEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}

      {/* 3. Add & Edit Form Modal */}
      <EmployeeFormModal
        isOpen={showModal}
        isEditing={Boolean(editingEmployee)}
        formData={formData}
        setFormData={setFormData}
        branches={branches}
        roles={roles}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
