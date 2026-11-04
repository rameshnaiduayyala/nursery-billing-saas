import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Building2, Search, ExternalLink, Loader2 } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [metrics, setMetrics] = useState({ totalOrgs: 0, activeOrgs: 0, pendingOrgs: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [orgsRes, metRes] = await Promise.all([
        apiRequest("/admin/organizations").catch(() => ({ data: [] })),
        apiRequest("/admin/metrics").catch(() => ({ data: {} })),
      ]);

      if (orgsRes.data) setOrganizations(orgsRes.data);
      if (metRes.data) setMetrics(metRes.data);
    } catch (err) {
      setError(err.message || "Failed to load platform organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await apiRequest(`/admin/organizations/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert("Error updating organization status: " + err.message);
    }
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

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Nurseries</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.totalOrgs || organizations.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approved Tenants</div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            {metrics.activeOrgs || organizations.filter((o) => o.status === "APPROVED").length}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Review</div>
          <div className="mt-2 text-2xl font-bold text-amber-700">
            {metrics.pendingOrgs || organizations.filter((o) => o.status === "PENDING").length}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 size={32} className="animate-spin text-emerald-700 mb-2" />
            <span className="text-sm">Fetching tenant registrations...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Nursery Business</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {organizations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No nursery organizations registered on platform yet.
                  </td>
                </tr>
              ) : (
                organizations.map((org) => (
                  <tr key={org._id || org.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-emerald-700" />
                        <span>{org.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div>{org.phone || "—"}</div>
                      <div className="text-xs text-slate-400">{org.email || "—"}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {org.address?.city ? `${org.address.city}, ${org.address.state || ""}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : "—"}
                    </td>
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
                            onClick={() => handleUpdateStatus(org._id || org.id, "APPROVED")}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#1b6840] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#155433]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(org._id || org.id, "REJECTED")}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </>
                      ) : org.status === "APPROVED" ? (
                        <button
                          onClick={() => handleUpdateStatus(org._id || org.id, "SUSPENDED")}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(org._id || org.id, "APPROVED")}
                          className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
