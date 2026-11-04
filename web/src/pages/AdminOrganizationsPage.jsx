import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Building2, Search, ExternalLink } from "lucide-react";

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState([
    {
      _id: "org-1",
      name: "Green Valley Farm & Wholesale Nursery",
      slug: "green-valley-farm",
      owner: "Ramesh Patel",
      email: "ramesh@greenvalleynursery.in",
      phone: "+91 98221 44556",
      status: "APPROVED",
      city: "Kadiyam, Andhra Pradesh",
      registeredAt: "2026-11-01",
    },
    {
      _id: "org-2",
      name: "Flora Exotica Agro Nursery",
      slug: "flora-exotica-agro",
      owner: "Sunil Verma",
      email: "contact@floraexotica.com",
      phone: "+91 94112 33445",
      status: "PENDING",
      city: "Bengaluru, Karnataka",
      registeredAt: "2026-11-04",
    },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setOrganizations(
      organizations.map((org) => (org._id === id ? { ...org, status: newStatus } : org))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Admin: Nursery Registrations</h1>
          <p className="text-sm text-slate-500">
            Review onboarding submissions, review documents, and approve or suspend nursery tenants.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Nurseries</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{organizations.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approved Tenants</div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            {organizations.filter((o) => o.status === "APPROVED").length}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Review</div>
          <div className="mt-2 text-2xl font-bold text-amber-700">
            {organizations.filter((o) => o.status === "PENDING").length}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Nursery Business</th>
              <th className="px-6 py-4">Owner & Contact</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Registered Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {organizations.map((org) => (
              <tr key={org._id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-emerald-700" />
                    <span>{org.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700">
                  <div className="font-medium">{org.owner}</div>
                  <div className="text-xs text-slate-400">{org.phone} • {org.email}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{org.city}</td>
                <td className="px-6 py-4 text-slate-500">{org.registeredAt}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      org.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700"
                        : org.status === "PENDING"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {org.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {org.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(org._id, "APPROVED")}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#1b6840] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#155433]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(org._id, "REJECTED")}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </>
                  ) : org.status === "APPROVED" ? (
                    <button
                      onClick={() => handleUpdateStatus(org._id, "SUSPENDED")}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(org._id, "APPROVED")}
                      className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      Reactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

