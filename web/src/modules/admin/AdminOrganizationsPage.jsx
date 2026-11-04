import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Search,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Check,
  X,
  Clock,
  Ban,
  RotateCw,
} from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [metrics, setMetrics] = useState({ totalOrgs: 0, activeOrgs: 0, pendingOrgs: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  const handleUpdateStatus = async (id, newStatus, orgName) => {
    const actionLabel = newStatus === "APPROVED" ? "approve and activate" : newStatus.toLowerCase();
    if (!confirm(`Are you sure you want to ${actionLabel} "${orgName}"?`)) return;

    try {
      setActionLoading(id);
      const res = await apiRequest(`/admin/organizations/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        await loadData();
      }
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Platform Governance: Nursery Registrations</h1>
          <p className="text-sm text-[#64748B]">
            Newly registered nurseries are kept in Pending Approval status. Verify business credentials to approve, reject, or suspend.
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
        >
          <RotateCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E2EAE3] bg-white p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Total Registrations</div>
          <div className="mt-2 text-2xl font-bold text-[#1F2937]">{metrics.totalOrgs || organizations.length}</div>
          <div className="mt-1 text-xs text-[#64748B]">Nurseries registered on platform</div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Pending Verification</span>
            <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900">Requires Action</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-800">
            {metrics.pendingOrgs ?? organizations.filter((o) => o.status === "PENDING").length}
          </div>
          <div className="mt-1 text-xs text-amber-700">Awaiting your approval to access business features</div>
        </div>

        <div className="rounded-2xl border border-[#A8C9A5]/60 bg-emerald-50/30 p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#123D2B]">Approved & Active</div>
          <div className="mt-2 text-2xl font-bold text-[#176B45]">
            {metrics.activeOrgs ?? organizations.filter((o) => o.status === "APPROVED").length}
          </div>
          <div className="mt-1 text-xs text-[#176B45]">Operating nurseries with full access</div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by nursery name, email, or mobile..."
            className="w-full rounded-xl border border-[#E2EAE3] bg-white py-2 pl-10 pr-4 text-xs text-[#1F2937] placeholder-[#64748B] focus:border-[#176B45] focus:outline-none"
          />
        </div>

        <div className="flex rounded-xl bg-white border border-[#E2EAE3] p-1 text-xs font-semibold">
          {["ALL", "PENDING", "APPROVED", "SUSPENDED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                statusFilter === st
                  ? "bg-[#123D2B] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#1F2937]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Nurseries Management Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E2EAE3] bg-white shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-[#64748B]">
            <Loader2 size={32} className="animate-spin text-[#176B45] mb-2" />
            <span className="text-sm">Fetching tenant registrations...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E2EAE3] bg-[#F5F7F1]/80 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Nursery Business</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE3]">
              {filteredOrgs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">
                    No nursery organizations match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrgs.map((org) => {
                  const isBusy = actionLoading === (org._id || org.id);
                  return (
                    <tr key={org._id || org.id} className="hover:bg-[#F5F7F1]/50 transition">
                      <td className="px-6 py-4 font-bold text-[#1F2937]">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#123D2B]/10 text-[#123D2B]">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#1F2937]">{org.name}</div>
                            <div className="text-[11px] font-mono text-[#64748B]">slug: {org.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-[#1F2937]">
                        <div className="font-medium text-xs">{org.phone || "—"}</div>
                        <div className="text-xs text-[#64748B]">{org.email || "—"}</div>
                      </td>

                      <td className="px-6 py-4 text-xs text-[#64748B]">
                        {org.address?.city ? `${org.address.city}, ${org.address.state || ""}` : "Not provided"}
                      </td>

                      <td className="px-6 py-4 text-xs text-[#64748B]">
                        {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                            org.status === "APPROVED"
                              ? "bg-[#176B45]/10 text-[#176B45] border border-[#176B45]/20"
                              : org.status === "PENDING"
                              ? "bg-amber-100/80 text-amber-900 border border-amber-300"
                              : org.status === "SUSPENDED"
                              ? "bg-slate-100 text-slate-700 border border-slate-300"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {org.status === "PENDING" && <Clock size={12} />}
                          {org.status === "APPROVED" && <CheckCircle2 size={12} />}
                          {org.status === "SUSPENDED" && <Ban size={12} />}
                          {org.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {isBusy ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[#64748B]">
                            <Loader2 size={14} className="animate-spin" /> Updating...
                          </span>
                        ) : org.status === "PENDING" ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(org._id || org.id, "APPROVED", org.name)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#123D2B] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#176B45] transition cursor-pointer"
                            >
                              <Check size={14} /> Approve & Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(org._id || org.id, "REJECTED", org.name)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                            >
                              <X size={14} /> Reject
                            </button>
                          </>
                        ) : org.status === "APPROVED" ? (
                          <button
                            onClick={() => handleUpdateStatus(org._id || org.id, "SUSPENDED", org.name)}
                            className="inline-flex items-center gap-1 rounded-xl border border-[#E2EAE3] bg-white px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition cursor-pointer"
                          >
                            <Ban size={13} /> Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(org._id || org.id, "APPROVED", org.name)}
                            className="inline-flex items-center gap-1 rounded-xl border border-[#A8C9A5] bg-[#A8C9A5]/20 px-3 py-1.5 text-xs font-semibold text-[#123D2B] hover:bg-[#A8C9A5]/40 transition cursor-pointer"
                          >
                            <CheckCircle2 size={13} /> Reactivate / Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
