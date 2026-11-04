import React, { useEffect, useState } from "react";
import { Building2, Save, Check, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch organization profile directly from API
        const res = await apiRequest("/organizations/profile").catch(() => null);
        if (res && res.data) {
          const org = res.data;
          const addr = org.address || {};
          setProfile({
            businessName: org.name || "",
            phone: org.phone || "",
            email: org.email || "",
            address: addr.street || addr.line1 || (typeof addr === "string" ? addr : ""),
            city: addr.city || "",
            state: addr.state || "",
            pincode: addr.pincode || addr.postalCode || "",
          });

          // Cache in local storage for instant sync across PDF & header
          localStorage.setItem("nursery_current_org_data", JSON.stringify(org));
        } else {
          // Fallback to local storage
          const storedOrg = JSON.parse(localStorage.getItem("nursery_current_org_data") || "{}");
          const addr = storedOrg.address || {};
          setProfile({
            businessName: storedOrg.name || "",
            phone: storedOrg.phone || "",
            email: storedOrg.email || "",
            address: addr.street || addr.line1 || (typeof addr === "string" ? addr : ""),
            city: addr.city || "",
            state: addr.state || "",
            pincode: addr.pincode || addr.postalCode || "",
          });
        }
      } catch (err) {
        console.error("Failed to load nursery settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        name: profile.businessName,
        phone: profile.phone || null,
        email: profile.email || null,
        address: {
          street: profile.address || null,
          city: profile.city || null,
          state: profile.state || null,
          pincode: profile.pincode || null,
        },
      };

      const res = await apiRequest("/organizations/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (res && res.data) {
        localStorage.setItem("nursery_current_org_data", JSON.stringify(res.data));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to save organization settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-[#64748B]">
        <Loader2 size={36} className="animate-spin text-[#176B45] mb-2" />
        <span className="text-sm font-semibold">Loading business settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Nursery Business Settings</h1>
        <p className="text-sm text-[#64748B]">
          Update your official nursery business name, phone, email, and address. These details appear directly on all generated Invoices, Quotations, and client PDFs.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-[#E2EAE3] bg-white p-7 shadow-xs">
        <div className="border-b border-[#E2EAE3] pb-4">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
            <Building2 size={18} className="text-[#176B45]" />
            Nursery Organization Profile
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            This name and address are used on all customer printouts and legal billing records.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#64748B] uppercase mb-1">
            Nursery Business / Farm Name
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Green Valley Farm & Agro Nursery"
            value={profile.businessName}
            onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
            className="w-full rounded-xl border border-[#E2EAE3] p-3 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#64748B] uppercase mb-1">Business Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full rounded-xl border border-[#E2EAE3] p-3 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] uppercase mb-1">Business Email Address</label>
            <input
              type="email"
              placeholder="contact@nurseryfarm.com"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-xl border border-[#E2EAE3] p-3 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-[#E2EAE3] pt-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Official Nursery Address</h3>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] uppercase mb-1">
              Street / Farm Location / Landmark
            </label>
            <input
              type="text"
              placeholder="e.g. Survey No. 42, Main Road, Near Canal"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full rounded-xl border border-[#E2EAE3] p-3 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase mb-1">City / Hub</label>
              <input
                type="text"
                placeholder="e.g. Kadiyam"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full rounded-xl border border-[#E2EAE3] p-3 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase mb-1">State</label>
              <input
                type="text"
                placeholder="e.g. Andhra Pradesh"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full rounded-xl border border-[#E2EAE3] p-3 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase mb-1">Pincode</label>
              <input
                type="text"
                placeholder="e.g. 533126"
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                className="w-full rounded-xl border border-[#E2EAE3] p-3 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2EAE3]">
          {saved && (
            <span className="text-xs font-semibold text-[#176B45] flex items-center gap-1">
              <Check size={16} /> Saved Successfully
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#123D2B] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#176B45] transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? "Saving Changes..." : "Save Nursery Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

