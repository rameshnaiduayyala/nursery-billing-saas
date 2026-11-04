import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import ColumnSettingsModal from "./ColumnSettingsModal";
import InvoiceMetaFields from "./InvoiceMetaFields";
import InvoiceItemsTable from "./InvoiceItemsTable";
import AdditionalChargesSection from "./AdditionalChargesSection";
import InvoiceSummaryFooter from "./InvoiceSummaryFooter";

export const DEFAULT_COLUMNS = [
  { key: "plantName", label: "Plant Name", required: true },
  { key: "variety", label: "Variety / Cultivar" },
  { key: "plantSize", label: "Size / Spec" },
  { key: "description", label: "Description / Notes" },
  { key: "quantity", label: "Quantity", required: true },
  { key: "unitName", label: "Unit", required: true },
  { key: "unitPrice", label: "Rate (₹)", required: true },
  { key: "discountAmount", label: "Item Discount (₹)" },
  { key: "lineTotal", label: "Amount (₹)", required: true },
];

export default function InvoiceForm({
  initialData = null,
  customers,
  branches,
  products,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialData?.customerId?._id || initialData?.customerId || ""
  );
  const [selectedBranchId, setSelectedBranchId] = useState(
    initialData?.branchId?._id || initialData?.branchId || ""
  );
  const [invoiceDate, setInvoiceDate] = useState(
    initialData?.invoiceDate
      ? new Date(initialData.invoiceDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [discount, setDiscount] = useState(initialData?.discountAmount || 0);
  const [notes, setNotes] = useState(initialData?.notes || "");

  // Columns definition list with custom labels
  const [columnsConfig, setColumnsConfig] = useState(DEFAULT_COLUMNS);

  // Active visible columns state
  const [visibleColumns, setVisibleColumns] = useState(
    initialData?.visibleColumns && initialData.visibleColumns.length > 0
      ? initialData.visibleColumns
      : [
          "plantName",
          "variety",
          "plantSize",
          "quantity",
          "unitName",
          "unitPrice",
          "lineTotal",
        ]
  );

  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [editingColumnKey, setEditingColumnKey] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");

  const [items, setItems] = useState(
    initialData?.items && initialData.items.length > 0
      ? initialData.items.map((it) => ({
          productId: it.productId?._id || it.productId || "",
          plantName: it.plantName || "",
          variety: it.variety || "",
          plantSize: it.plantSize || "",
          description: it.description || it.plantName || "",
          quantity: it.quantity || 1,
          unitName: it.unitName || "PCS",
          unitPrice: it.unitPrice || 0,
          discountAmount: it.discountAmount || 0,
          lineTotal: it.lineTotal || 0,
        }))
      : [
          {
            productId: "",
            plantName: "",
            variety: "",
            plantSize: "",
            description: "",
            quantity: 1,
            unitName: "PCS",
            unitPrice: 0,
            discountAmount: 0,
            lineTotal: 0,
          },
        ]
  );

  const [charges, setCharges] = useState(
    initialData?.charges && initialData.charges.length > 0
      ? initialData.charges.map((ch) => ({
          name: ch.name || "",
          description: ch.description || "",
          amount: Number(ch.amount) || 0,
        }))
      : []
  );

  useEffect(() => {
    if (customers && customers.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(customers[0]._id || customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  useEffect(() => {
    if (branches && branches.length > 0 && !selectedBranchId) {
      const savedBranch = localStorage.getItem("nursery_current_branch");
      if (savedBranch) {
        setSelectedBranchId(savedBranch);
      } else {
        setSelectedBranchId(branches[0]._id || branches[0].id);
      }
    }
  }, [branches, selectedBranchId]);

  // Toggle dynamic column visibility
  const toggleColumn = (key) => {
    const col = columnsConfig.find((c) => c.key === key);
    if (col?.required) return;

    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const startEditLabel = (col) => {
    setEditingColumnKey(col.key);
    setEditingLabel(col.label);
  };

  const saveLabelEdit = (key) => {
    if (editingLabel.trim()) {
      setColumnsConfig((prev) =>
        prev.map((c) => (c.key === key ? { ...c, label: editingLabel.trim() } : c))
      );
    }
    setEditingColumnKey(null);
    setEditingLabel("");
  };

  const resetColumnsToDefault = () => {
    setColumnsConfig(DEFAULT_COLUMNS);
    setVisibleColumns([
      "plantName",
      "variety",
      "plantSize",
      "quantity",
      "unitName",
      "unitPrice",
      "lineTotal",
    ]);
  };

  const getColLabel = (key, fallback) => {
    const found = columnsConfig.find((c) => c.key === key);
    return found?.label || fallback;
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0);
  const chargesTotal = charges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0) + chargesTotal);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    const q = Number(updated[index].quantity) || 0;
    const p = Number(updated[index].unitPrice) || 0;
    const d = Number(updated[index].discountAmount) || 0;
    updated[index].lineTotal = Math.max(0, q * p - d);

    if (!updated[index].description) {
      updated[index].description = updated[index].plantName || "Plant Item";
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        plantName: "",
        variety: "",
        plantSize: "",
        description: "",
        quantity: 1,
        unitName: "PCS",
        unitPrice: 0,
        discountAmount: 0,
        lineTotal: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const addCharge = () => {
    setCharges([
      ...charges,
      {
        name: "",
        description: "",
        amount: 0,
      },
    ]);
  };

  const handleChargeChange = (index, field, value) => {
    const updated = [...charges];
    updated[index][field] = value;
    setCharges(updated);
  };

  const removeCharge = (index) => {
    setCharges(charges.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert("Please select a customer for the invoice");
      return;
    }
    if (!selectedBranchId) {
      alert("Please select a nursery branch");
      return;
    }
    if (items.length === 0 || !items[0].plantName) {
      alert("Please add at least one plant with a name and rate");
      return;
    }

    onSubmit({
      customerId: selectedCustomerId,
      branchId: selectedBranchId,
      invoiceDate,
      dueDate: dueDate || null,
      items: items.map((it) => ({
        ...it,
        productId: it.productId && it.productId.trim() !== "" ? it.productId : null,
        description: it.description || it.plantName,
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        discountAmount: Number(it.discountAmount) || 0,
        lineTotal: Number(it.lineTotal) || 0,
      })),
      charges: charges
        .filter((c) => c.name && c.name.trim() !== "")
        .map((c) => ({
          name: c.name.trim(),
          description: c.description || "",
          amount: Number(c.amount) || 0,
        })),
      discountAmount: Number(discount) || 0,
      visibleColumns,
      customColumnLabels: columnsConfig.reduce((acc, c) => {
        acc[c.key] = c.label;
        return acc;
      }, {}),
      notes: notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-[#E2EAE3] bg-white p-6 shadow-xs">
        {/* Header toolbar & Column Settings (Gear Icon) */}
        <div className="flex flex-col gap-4 border-b border-[#E2EAE3] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]">Generate Non-GST Bill</h2>
            <p className="text-xs text-[#64748B]">Choose customer, nursery branch, and customize table columns and names.</p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2 text-xs font-bold text-[#123D2B] hover:border-[#176B45] hover:bg-[#F5F7F1] transition shadow-xs cursor-pointer"
              title="Configure Table Columns & Labels"
            >
              <Settings size={16} className="text-[#176B45]" />
              <span>Columns Settings ({visibleColumns.length})</span>
            </button>

            <ColumnSettingsModal
              isOpen={showColumnSettings}
              columnsConfig={columnsConfig}
              visibleColumns={visibleColumns}
              editingColumnKey={editingColumnKey}
              editingLabel={editingLabel}
              setEditingLabel={setEditingLabel}
              setEditingColumnKey={setEditingColumnKey}
              onClose={() => setShowColumnSettings(false)}
              onToggleColumn={toggleColumn}
              onStartEditLabel={startEditLabel}
              onSaveLabelEdit={saveLabelEdit}
              onResetColumns={resetColumnsToDefault}
            />
          </div>
        </div>

        {/* Customer, Branch, Dates */}
        <InvoiceMetaFields
          customers={customers}
          branches={branches}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          selectedBranchId={selectedBranchId}
          setSelectedBranchId={setSelectedBranchId}
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />

        {/* Dynamic Plant Items Table */}
        <InvoiceItemsTable
          items={items}
          visibleColumns={visibleColumns}
          getColLabel={getColLabel}
          products={products}
          onItemChange={handleItemChange}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />

        {/* Additional Charges (Charge Name, Description, Amount) */}
        <AdditionalChargesSection
          charges={charges}
          onAddCharge={addCharge}
          onChargeChange={handleChargeChange}
          onRemoveCharge={removeCharge}
        />

        {/* Notes, Totals, Discount & Submittal */}
        <InvoiceSummaryFooter
          isEdit={!!initialData}
          notes={notes}
          setNotes={setNotes}
          subtotal={subtotal}
          chargesTotal={chargesTotal}
          discount={discount}
          setDiscount={setDiscount}
          grandTotal={grandTotal}
          submitting={submitting}
          onCancel={onCancel}
        />
      </div>
    </form>
  );
}
