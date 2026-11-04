import React, { useState } from "react";
import { Plus, Trash2, Printer, CheckCircle, Receipt, ArrowRight, Truck } from "lucide-react";

export default function InvoicesPage() {
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'create'
  const [invoices, setInvoices] = useState([
    {
      _id: "inv-1",
      invoiceNumber: "INV-0012",
      customerName: "GreenScape Landscaping LLP",
      branch: "Main Branch",
      date: "2026-11-04",
      subtotal: 42000,
      chargesTotal: 4500,
      grandTotal: 46500,
      amountPaid: 20000,
      balanceDue: 26500,
      status: "PARTIALLY_PAID",
    },
    {
      _id: "inv-2",
      invoiceNumber: "INV-0011",
      customerName: "Anita Sharma",
      branch: "Main Branch",
      date: "2026-11-03",
      subtotal: 4800,
      chargesTotal: 300,
      grandTotal: 5100,
      amountPaid: 5100,
      balanceDue: 0,
      status: "PAID",
    },
  ]);

  // Form State for creating an invoice
  const [customer, setCustomer] = useState("GreenScape Landscaping LLP");
  const [items, setItems] = useState([
    { description: "Areca Palm (Indoor) - 4ft Pot", quantity: 50, unitName: "POT", unitPrice: 320, lineTotal: 16000 },
    { description: "Mango Graft (Kesar)", quantity: 100, unitName: "PCS", unitPrice: 250, lineTotal: 25000 },
  ]);
  const [charges, setCharges] = useState([
    { chargeType: "LOADING", name: "Plant Loading & Labour", amount: 1500 },
    { chargeType: "TRANSPORT", name: "Direct Nursery Vehicle / Transport", amount: 3000 },
  ]);
  const [discount, setDiscount] = useState(0);

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
    setCharges([...charges, { chargeType: "LABOUR", name: "Labour / Packing Charge", amount: 500 }]);
  };

  const removeCharge = (index) => {
    setCharges(charges.filter((_, i) => i !== index));
  };

  const handleSaveInvoice = () => {
    const newInv = {
      _id: "inv-" + Date.now(),
      invoiceNumber: "INV-" + Math.floor(1000 + Math.random() * 9000),
      customerName: customer,
      branch: "Main Branch",
      date: new Date().toISOString().split("T")[0],
      subtotal,
      chargesTotal,
      grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      status: "ISSUED",
    };
    setInvoices([newInv, ...invoices]);
    setViewMode("list");
  };

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoices & Billing</h1>
              <p className="text-sm text-slate-500">
                Non-GST nursery billing with plant items, vehicle transport, loading, and unloading charges.
              </p>
            </div>
            <button
              onClick={() => setViewMode("create")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
            >
              <Plus size={18} /> Create New Invoice
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Plants Subtotal</th>
                  <th className="px-6 py-4">Loading/Transport</th>
                  <th className="px-6 py-4">Grand Total</th>
                  <th className="px-6 py-4">Balance Due</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 text-slate-800">{inv.customerName}</td>
                    <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                    <td className="px-6 py-4 text-slate-700">₹{inv.subtotal.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-emerald-800 font-medium">₹{inv.chargesTotal.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{inv.grandTotal.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={inv.balanceDue > 0 ? "font-semibold text-amber-700" : "text-slate-400"}>
                        ₹{inv.balanceDue.toLocaleString("en-IN")}
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
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Create Invoice Interactive Screen */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">New Nursery Invoice</h2>
              <p className="text-xs text-slate-500">Create non-GST bill with itemized plant catalog & direct transport charges.</p>
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
                className="rounded-xl bg-[#1b6840] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#155433]"
              >
                Issue Invoice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Form Left Side */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Customer & Dispatch</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Select Customer</label>
                    <select
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white"
                    >
                      <option>GreenScape Landscaping LLP</option>
                      <option>Anita Sharma</option>
                      <option>Balaji Agro Farms</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Billing Branch</label>
                    <input
                      type="text"
                      disabled
                      value="Main Nursery Branch (Pune)"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-500"
                    />
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
                          placeholder="Plant name / variety description"
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
                <div className="space-y-3">
                  {charges.map((charge, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
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
                  className="w-full rounded-xl bg-[#1b6840] py-3 text-sm font-bold text-white shadow-md hover:bg-[#155433] transition"
                >
                  Confirm & Issue Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

