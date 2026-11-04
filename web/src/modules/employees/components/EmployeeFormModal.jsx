import React from "react";
import { X, Building2 } from "lucide-react";

export function EmployeeFormModal({
  isOpen,
  isEditing,
  formData,
  setFormData,
  branches = [],
  roles = [],
  submitting,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null;

  const standardRoles = [
    { key: "BRANCH_MANAGER", name: "Branch Manager" },
    { key: "SALES_STAFF", name: "Sales Executive" },
    { key: "ACCOUNTANT", name: "Accountant" },
    { key: "INVENTORY_STAFF", name: "Inventory Supervisor" },
    { key: "OWNER", name: "Co-Owner / Admin" },
  ];

  const toggleBranchSelection = (branchId) => {
    setFormData((prev) => {
      const exists = prev.branchIds.includes(branchId);
      if (exists) {
        if (prev.branchIds.length === 1) {
          alert("An employee must be assigned to at least one branch.");
          return prev;
        }
        return { ...prev, branchIds: prev.branchIds.filter((id) => id !== branchId) };
      } else {
        return { ...prev, branchIds: [...prev.branchIds, branchId] };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D2B]/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#E2EAE3] animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-3">
          <h2 className="text-lg font-bold text-[#1F2937]">
            {isEditing ? "Edit Employee & Branch Access" : "Enroll New Team Member"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#64748B] hover:bg-[#F5F7F1] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#64748B]">Full Name</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Patil"
              className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">Email Address</label>
              <input
                required
                type="email"
                disabled={Boolean(isEditing)}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@nursery.com"
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none disabled:bg-[#F5F7F1] disabled:text-[#64748B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">Contact Phone</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 00000"
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#64748B]">Assign Role</label>
            <select
              value={formData.roleKey}
              onChange={(e) => setFormData({ ...formData, roleKey: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
            >
              {standardRoles.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.name}
                </option>
              ))}
              {roles
                .filter((cr) => !standardRoles.some((sr) => sr.key === cr.key))
                .map((cr) => (
                  <option key={cr.key} value={cr.key}>
                    {cr.name} (Custom)
                  </option>
                ))}
            </select>
          </div>

          {/* Branch Access Checkbox Allocation */}
          <div>
            <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1.5">
              Authorize Branch Access (Select One or More)
            </label>
            <div className="max-h-40 overflow-y-auto space-y-2 rounded-xl border border-[#E2EAE3] p-3 bg-[#F5F7F1]/40">
              {branches.length === 0 ? (
                <span className="text-xs text-[#64748B]">No branches available.</span>
              ) : (
                branches.map((b) => {
                  const bId = b._id || b.id;
                  const isChecked = formData.branchIds.includes(bId);
                  return (
                    <label
                      key={bId}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E2EAE3] cursor-pointer hover:border-[#176B45]/40 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBranchSelection(bId)}
                          className="rounded text-[#123D2B] focus:ring-[#176B45]"
                        />
                        <span className="text-xs font-bold text-[#1F2937]">{b.name}</span>
                      </div>
                      <span className="text-[10px] font-mono rounded bg-[#F5F7F1] px-1.5 py-0.5 text-[#64748B]">
                        {b.code}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#64748B]">
              {isEditing ? "Reset Password (Optional)" : "Temporary Password"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={isEditing ? "Leave blank to keep existing password" : "••••••••"}
              className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#E2EAE3]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E2EAE3] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F5F7F1] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#123D2B] px-5 py-2 text-xs font-bold text-white hover:bg-[#176B45] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {submitting ? "Saving..." : isEditing ? "Update Employee" : "Enroll Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeFormModal;

