import React, { useEffect, useState } from "react";
import { Sliders, Truck, Users, Key, Save, Check, Loader2 } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'charges'
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  const [charges, setCharges] = useState([]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        // Load user info from localStorage session
        const storedUser = JSON.parse(localStorage.getItem("nursery_user") || "{}");
        if (storedUser) {
          setProfile((p) => ({
            ...p,
            contactPerson: storedUser.name || "",
            email: storedUser.email || "",
            phone: storedUser.phone || "",
          }));
        }

        // Load charges templates from API
        const chRes = await apiRequest("/charges/templates").catch(() => ({ data: [] }));
        if (chRes.data) setCharges(chRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nursery Business Settings</h1>
        <p className="text-sm text-slate-500">
          Configure business profile, banking/UPI instructions, document numbering sequences, and default freight charges.
        </p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "profile"
              ? "border-[#1b6840] text-[#1b6840]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Business Profile & Bank Details
        </button>
        <button
          onClick={() => setActiveTab("charges")}
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "charges"
              ? "border-[#1b6840] text-[#1b6840]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Default Freight & Loading Matrix
        </button>
      </div>

      {activeTab === "profile" ? (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Nursery Firm Name</label>
              <input
                type="text"
                placeholder="e.g. Green Valley Farm"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Owner / Contact Person</label>
              <input
                type="text"
                placeholder="Owner full name"
                value={profile.contactPerson}
                onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Phone Number</label>
              <input
                type="text"
                placeholder="+91"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Email Address</label>
              <input
                type="email"
                placeholder="email@domain.com"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">UPI ID (For Receipt QR / Invoices)</label>
              <input
                type="text"
                placeholder="e.g. nursery@upi"
                value={profile.upiId}
                onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Bank Account for Invoices & Receipts</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India"
                  value={profile.bankName}
                  onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Account Number</label>
                <input
                  type="text"
                  placeholder="Account number"
                  value={profile.accountNumber}
                  onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">IFSC Code</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  value={profile.ifscCode}
                  onChange={(e) => setProfile({ ...profile, ifscCode: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433]"
            >
              {saved ? <Check size={18} /> : <Save size={18} />}
              {saved ? "Saved Successfully" : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-bold text-slate-900">Configured Reusable Charges</h3>
          </div>
          {charges.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              No custom charge templates configured. Reusable charges can be set up in the charges module.
            </p>
          ) : (
            <div className="space-y-3">
              {charges.map((c) => (
                <div key={c._id || c.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div>
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500">
                      Calculation: {c.calculationType} • Category: {c.chargeType}
                    </div>
                  </div>
                  <div className="text-right font-bold text-slate-900">₹{c.defaultRate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
