import React from "react";
import { X } from "lucide-react";

export function CustomerFormModal({
  isOpen,
  isEditing,
  formData,
  setFormData,
  submitting,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null;

  const customerTypes = [
    { key: "INDIVIDUAL", label: "Retail / Individual" },
    { key: "WHOLESALE", label: "Wholesale Buyer" },
    { key: "LANDSCAPER", label: "Landscaper / Contractor" },
    { key: "NURSERY_TRADER", label: "Nursery Reseller" },
    { key: "EXPORTER", label: "Plant Exporter" },
    { key: "CORPORATE", label: "Corporate Account" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D2B]/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#E2EAE3] animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-3">
          <h2 className="text-lg font-bold text-[#1F2937]">
            {isEditing ? `Edit Customer: ${formData.name}` : "Register New Customer Profile"}
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
            <label className="block text-xs font-semibold uppercase text-[#64748B]">Customer Name</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Suresh Kumar"
              className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">Business / Firm Name</label>
              <input
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Green Scape Landscaping"
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">Customer Type</label>
              <select
                value={formData.customerType}
                onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              >
                {customerTypes.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">Mobile Number</label>
              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@domain.com"
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">City / Location</label>
              <input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Pune"
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">State</label>
              <input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Maharashtra"
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">Opening Balance (₹)</label>
              <input
                type="number"
                step="any"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#64748B]">Credit Limit (₹)</label>
              <input
                type="number"
                step="any"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-[#E2EAE3] p-2.5 text-sm text-[#1F2937] focus:border-[#176B45] focus:outline-none"
              />
            </div>
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
              {submitting ? "Saving..." : isEditing ? "Update Profile" : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerFormModal;

