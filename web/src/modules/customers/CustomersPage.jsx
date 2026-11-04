import React, { useState } from "react";
import { Plus, RotateCw, AlertCircle, Loader2, Search } from "lucide-react";
import { useCustomers } from "./hooks/useCustomers";
import { CustomerListGrid } from "./components/CustomerListGrid";
import { CustomerFormModal } from "./components/CustomerFormModal";
import { CustomerLedgerModal } from "./components/CustomerLedgerModal";

export default function CustomersPage() {
  const {
    customers,
    loading,
    error,
    loadCustomers,
    saveCustomer,
    deleteCustomer,
    getCustomerLedger,
  } = useCustomers();

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    customerType: "INDIVIDUAL",
    city: "",
    state: "",
    creditLimit: "",
    openingBalance: "",
    isActive: true,
  });

  const customerTypes = [
    { key: "INDIVIDUAL", label: "Retail / Individual" },
    { key: "WHOLESALE", label: "Wholesale Buyer" },
    { key: "LANDSCAPER", label: "Landscaper / Contractor" },
    { key: "NURSERY_TRADER", label: "Nursery Reseller" },
    { key: "EXPORTER", label: "Plant Exporter" },
    { key: "CORPORATE", label: "Corporate Account" },
  ];

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      businessName: "",
      phone: "",
      email: "",
      customerType: "INDIVIDUAL",
      city: "",
      state: "",
      creditLimit: "",
      openingBalance: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name || "",
      businessName: c.businessName || "",
      phone: c.phone || "",
      email: c.email || "",
      customerType: c.customerType || "INDIVIDUAL",
      city: c.billingAddress?.city || "",
      state: c.billingAddress?.state || "",
      creditLimit: c.creditLimit || "",
      openingBalance: c.openingBalance || "",
      isActive: c.isActive !== false,
    });
    setShowModal(true);
  };

  const handleOpenLedger = async (c) => {
    try {
      const res = await getCustomerLedger(c._id || c.id);
      if (res.success && res.data) {
        setSelectedCustomerDetail(res.data);
        setShowDetailModal(true);
      }
    } catch (err) {
      alert("Error loading customer ledger statement: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    try {
      setSubmitting(true);
      const isEditing = Boolean(editingCustomer);
      const customerId = editingCustomer?._id || editingCustomer?.id;

      const payload = {
        name: formData.name.trim(),
        businessName: formData.businessName ? formData.businessName.trim() : null,
        phone: formData.phone.trim(),
        email: formData.email ? formData.email.trim() : null,
        customerType: formData.customerType,
        billingAddress: {
          city: formData.city || null,
          state: formData.state || null,
        },
        creditLimit: Number(formData.creditLimit) || 0,
        openingBalance: Number(formData.openingBalance) || 0,
        isActive: Boolean(formData.isActive),
      };

      const res = await saveCustomer({ isEditing, customerId, payload });
      if (res.success) {
        setShowModal(false);
        await loadCustomers();
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c) => {
    const id = c._id || c.id;
    if (!confirm(`Are you sure you want to delete customer "${c.name}"?`)) return;

    try {
      const res = await deleteCustomer(id);
      if (res.success) {
        await loadCustomers();
      }
    } catch (err) {
      alert("Error deleting customer: " + err.message);
    }
  };

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.customerCode?.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === "ALL" || c.customerType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Customer Directory & Accounts</h1>
          <p className="text-sm text-[#64748B]">
            Manage retail buyers, wholesale landscapers, credit limits, and real-time outstanding ledger balances.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCustomers}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
          >
            <RotateCw size={14} /> Refresh
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-[#123D2B] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#176B45] transition cursor-pointer"
          >
            <Plus size={18} /> Add Customer
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, business, mobile, or code..."
            className="w-full rounded-xl border border-[#E2EAE3] bg-white py-2 pl-10 pr-4 text-xs text-[#1F2937] placeholder-[#64748B] focus:border-[#176B45] focus:outline-none"
          />
        </div>

        <div className="flex rounded-xl bg-white border border-[#E2EAE3] p-1 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              typeFilter === "ALL" ? "bg-[#123D2B] text-white shadow-xs" : "text-[#64748B] hover:text-[#1F2937]"
            }`}
          >
            All Accounts
          </button>
          {customerTypes.slice(0, 4).map((t) => (
            <button
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer whitespace-nowrap ${
                typeFilter === t.key ? "bg-[#123D2B] text-white shadow-xs" : "text-[#64748B] hover:text-[#1F2937]"
              }`}
            >
              {t.label.split("/")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Customer Cards Grid Component */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-[#176B45]" size={32} />
        </div>
      ) : (
        <CustomerListGrid
          customers={filtered}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onViewLedger={handleOpenLedger}
        />
      )}

      {/* 4. Add & Edit Modal Component */}
      <CustomerFormModal
        isOpen={showModal}
        isEditing={Boolean(editingCustomer)}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
      />

      {/* 5. Financial Ledger Modal Component */}
      <CustomerLedgerModal
        isOpen={showDetailModal}
        customerDetail={selectedCustomerDetail}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}
