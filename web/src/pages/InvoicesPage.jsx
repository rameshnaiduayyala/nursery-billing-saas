import React, { useEffect, useState } from "react";
import { Plus, Trash2, Printer, CheckCircle, Receipt, ArrowRight, Truck, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function InvoicesPage() {
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'create'
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form State initialized empty
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [items, setItems] = useState([]);
  const [charges, setCharges] = useState([]);
  const [discount, setDiscount] = useState(0);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [invRes, custRes, brRes] = await Promise.all([
        apiRequest("/invoices").catch(() => ({ data: [] })),
        apiRequest("/customers").catch(() => ({ data: [] })),
        apiRequest("/branches").catch(() => ({ data: [] })),
      ]);

      if (invRes.data) setInvoices(invRes.data);
      if (custRes.data) {
        setCustomers(custRes.data);
        if (custRes.data[0]) setSelectedCustomerId(custRes.data[0]._id || custRes.data[0].id);
      }
      if (brRes.data) {
        setBranches(brRes.data);
        if (brRes.data[0]) setSelectedBranchId(brRes.data[0]._id || brRes.data[0].id);
      }
    } catch (err) {
      setError(err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0);
  const chargesTotal = charges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const grandTotal = Math.max(0, subtotal - discount + chargesTotal);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === "quantity" || field === "unitPrice") {
      const q = Number(updated[index].quantity) || 0;
      const p = Number(updated[index].unitPrice) || 0;
      updated[index].lineTotal = q * p;
    }
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitName: "PCS", unitPrice: 0, lineTotal: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addCharge = () => {
    setCharges([
      ...charges,
      { chargeType: "LOADING", name: "Loading / Transportation Charge", calculationType: "FIXED", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeCharge = (index) => {
    setCharges(charges.filter((_, i) => i !== index));
  };

  const handleSaveInvoice = async () => {
    if (!selectedCustomerId) {
      alert("Please select a customer for the invoice");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one plant item to issue an invoice");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiRequest("/invoices", {
        method: "POST",
        body: JSON.stringify({
          customerId: selectedCustomerId,
          branchId: selectedBranchId || branches[0]?._id,
          items,
          charges,
          discountAmount: Number(discount) || 0,
        }),
      });

      if (res.success) {
        setViewMode("list");
        setItems([]);
        setCharges([]);
        loadData();
      }
    } catch (err) {
      alert("Failed to issue invoice: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoices & Billing</h1>
              <p className="text-sm text-slate-500">
                Non-GST nursery billing with plant items, vehicle freight, loading, and automatic customer ledger updates.
              </p>
            </div>
            <button
              onClick={() => {
                setViewMode("create");
                if (items.length === 0) addItem();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
            >
              <Plus size={18} /> Create New Invoice
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                <Loader2 size={32} className="animate-spin text-emerald-700 mb-2" />
                <span className="text-sm">Loading billing records...</span>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Plants Subtotal</th>
                    <th className="px-6 py-4">Loading/Freight</th>
                    <th className="px-6 py-4">Grand Total</th>
                    <th className="px-6 py-4">Balance Due</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                        No invoices issued yet. Click "Create New Invoice" to bill your first plant shipment.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv._id || inv.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td className="px-6 py-4 text-slate-800">
                          {inv.customerId?.name || inv.customerId?.businessName || inv.customerName || "Customer"}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : "Today"}
                        </td>
                        <td className="px-6 py-4 text-slate-700">₹{Number(inv.subtotal || 0).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 text-emerald-800 font-medium">
                          ₹{Number(inv.chargesTotal || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          ₹{Number(inv.grandTotal || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={Number(inv.balanceDue || 0) > 0 ? "font-semibold text-amber-700" : "text-slate-400"}
                          >
                            ₹{Number(inv.balanceDue || 0).toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              inv.status === "PAID"
                                ? "bg-emerald-50 text-emerald-700"
                                : inv.status === "PARTIALLY_PAID"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {inv.status || "ISSUED"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        /* Create Invoice Interactive Screen */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">New Nursery Invoice</h2>
              <p className="text-xs text-slate-500">
                Non-GST billing with live freight, loading charges, and automatic customer ledger posting.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back to List
              </button>
              <button
                onClick={handleSaveInvoice}
                disabled={submitting}
                className="rounded-xl bg-[#1b6840] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] disabled:opacity-50"
              >
                {submitting ? "Issuing..." : "Confirm & Issue Invoice"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Customer & Dispatch</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Select Customer</label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white"
                    >
                      {customers.length === 0 ? (
                        <option value="">No customers available</option>
                      ) : (
                        customers.map((c) => (
                          <option key={c._id || c.id} value={c._id || c.id}>
                            {c.name} {c.businessName ? `(${c.businessName})` : ""}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Billing Branch</label>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white"
                    >
                      {branches.length === 0 ? (
                        <option value="">Main Branch</option>
                      ) : (
                        branches.map((b) => (
                          <option key={b._id || b.id} value={b._id || b.id}>
                            {b.name} ({b.code})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Plant Items Table */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Plant Items</h3>
                  <button
                    onClick={addItem}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus size={16} /> Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="text"
                          placeholder="Plant variety description"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm"
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-center"
                        />
                      </div>
                      <div className="w-24">
                        <select
                          value={item.unitName}
                          onChange={(e) => handleItemChange(idx, "unitName", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm bg-white"
                        >
                          <option value="PCS">Piece</option>
                          <option value="POT">Pot</option>
                          <option value="BAG">Bag</option>
                          <option value="BDL">Bundle</option>
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Rate ₹"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-right"
                        />
                      </div>
                      <div className="w-28 text-right font-semibold text-slate-800 text-sm">
                        ₹{(item.lineTotal || 0).toLocaleString("en-IN")}
                      </div>
                      <button onClick={() => removeItem(idx)} className="text-slate-400 hover:text-red-500 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading & Transportation Charges */}
              <div className="rounded-2xl border border-emerald-100 bg-[#fbfdfb] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-emerald-700" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
                      Loading, Unloading & Transportation Charges
                    </h3>
                  </div>
                  <button
                    onClick={addCharge}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus size={16} /> Add Charge
                  </button>
                </div>
                {charges.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No additional freight or loading charges added.</p>
                ) : (
                  <div className="space-y-3">
                    {charges.map((charge, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Charge description"
                            value={charge.name}
                            onChange={(e) => {
                              const updated = [...charges];
                              updated[idx].name = e.target.value;
                              setCharges(updated);
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm"
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            placeholder="Amount ₹"
                            value={charge.amount}
                            onChange={(e) => {
                              const updated = [...charges];
                              updated[idx].amount = Number(e.target.value) || 0;
                              setCharges(updated);
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-right"
                          />
                        </div>
                        <button onClick={() => removeCharge(idx)} className="text-slate-400 hover:text-red-500 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Live Calculation Sidebar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Invoice Summary</h3>
              <div className="space-y-2 border-b border-slate-100 pb-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Plant Items Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Special Discount</span>
                  <div className="flex items-center gap-1">
                    <span>₹</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                      className="w-20 rounded border border-slate-200 p-1 text-right text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Loading & Transport</span>
                  <span className="font-semibold">₹{chargesTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="text-xl text-[#1b6840]">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveInvoice}
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#1b6840] py-3 text-sm font-bold text-white shadow-md hover:bg-[#155433] transition disabled:opacity-50"
                >
                  {submitting ? "Issuing..." : "Confirm & Issue Invoice"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
