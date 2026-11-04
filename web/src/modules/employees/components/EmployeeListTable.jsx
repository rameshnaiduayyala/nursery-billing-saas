import React from "react";
import {
  Shield,
  Phone,
  CheckCircle2,
  XCircle,
  Building2,
  Edit2,
  Power,
  Trash2,
  Users,
} from "lucide-react";

export function EmployeeListTable({
  employees = [],
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  if (employees.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E2EAE3] bg-white p-12 text-center text-[#64748B]">
        <Users className="mx-auto mb-3 text-[#A8C9A5]" size={40} />
        <h3 className="font-bold text-[#1F2937] text-base">No staff members enrolled</h3>
        <p className="mt-1 text-xs text-[#64748B]">
          Click "Add Employee" to register branch managers, billing staff, and sales coordinators.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2EAE3] bg-white shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#E2EAE3] bg-[#F5F7F1]/80 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          <tr>
            <th className="px-6 py-4">Employee</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Assigned Branches</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2EAE3]">
          {employees.map((emp) => {
            const userObj = emp.user || emp.userId || {};
            const roleObj = emp.role || emp.roleId || {};
            const branchList = emp.branchAccess || [];
            const isOwner = roleObj.key === "OWNER";

            return (
              <tr key={emp._id || emp.membershipId} className="hover:bg-[#F5F7F1]/50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-[#1F2937]">{userObj.name || "Staff Member"}</div>
                  <div className="text-xs text-[#64748B]">{userObj.email}</div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#123D2B]/10 px-2.5 py-1 text-xs font-bold text-[#123D2B] border border-[#123D2B]/15">
                    <Shield size={12} className="text-[#176B45]" />
                    {roleObj.name || roleObj.key || "STAFF"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {branchList.length > 0 ? (
                      branchList.map((ba, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded bg-[#F5F7F1] border border-[#E2EAE3] px-2 py-0.5 text-[11px] font-medium text-[#1F2937]"
                        >
                          <Building2 size={11} className="text-[#64748B]" />
                          {ba.branchId?.name || ba.branchId?.code || "Branch"}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#64748B] italic">All Organization Branches</span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-[#1F2937]">
                  <div className="flex items-center gap-2 text-xs">
                    <Phone size={13} className="text-[#64748B]" />
                    <span>{userObj.phone || "No mobile"}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                      emp.status === "ACTIVE"
                        ? "bg-[#176B45]/10 text-[#176B45] border border-[#176B45]/20"
                        : "bg-slate-100 text-slate-600 border border-slate-300"
                    }`}
                  >
                    {emp.status === "ACTIVE" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {emp.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-1.5">
                  <button
                    onClick={() => onEdit(emp)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E2EAE3] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition cursor-pointer"
                    title="Edit Roles & Branch Access"
                  >
                    <Edit2 size={12} /> Edit
                  </button>

                  {!isOwner && (
                    <>
                      <button
                        onClick={() => onToggleStatus(emp)}
                        className="inline-flex items-center rounded-lg border border-[#E2EAE3] bg-white p-1.5 text-xs text-[#64748B] hover:text-[#123D2B] transition cursor-pointer"
                        title={emp.status === "ACTIVE" ? "Suspend Access" : "Activate Access"}
                      >
                        <Power size={13} />
                      </button>

                      <button
                        onClick={() => onDelete(emp)}
                        className="inline-flex items-center rounded-lg border border-rose-200 bg-white p-1.5 text-xs text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Remove Employee"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeListTable;

