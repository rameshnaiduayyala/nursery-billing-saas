import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function InvoiceItemsTable({
  items,
  visibleColumns,
  getColLabel,
  products,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F2937]">
          Plant Line Items ({items.length})
        </h3>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#123D2B]/10 px-3 py-1.5 text-xs font-bold text-[#123D2B] hover:bg-[#123D2B]/20 transition cursor-pointer"
        >
          <Plus size={14} /> Add Row
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E2EAE3]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F7F1] border-b border-[#E2EAE3] text-[#64748B] uppercase font-bold">
            <tr>
              <th className="p-3 w-10 text-center">#</th>
              {visibleColumns.includes("plantName") && (
                <th className="p-3 min-w-[180px]">{getColLabel("plantName", "Plant Name")}</th>
              )}
              {visibleColumns.includes("variety") && (
                <th className="p-3 min-w-[130px]">{getColLabel("variety", "Variety")}</th>
              )}
              {visibleColumns.includes("plantSize") && (
                <th className="p-3 min-w-[120px]">{getColLabel("plantSize", "Size / Pot")}</th>
              )}
              {visibleColumns.includes("description") && (
                <th className="p-3 min-w-[160px]">{getColLabel("description", "Description")}</th>
              )}
              {visibleColumns.includes("quantity") && (
                <th className="p-3 w-24">{getColLabel("quantity", "Qty")}</th>
              )}
              {visibleColumns.includes("unitName") && (
                <th className="p-3 w-24">{getColLabel("unitName", "Unit")}</th>
              )}
              {visibleColumns.includes("unitPrice") && (
                <th className="p-3 w-28">{getColLabel("unitPrice", "Rate (₹)")}</th>
              )}
              {visibleColumns.includes("discountAmount") && (
                <th className="p-3 w-24">{getColLabel("discountAmount", "Disc (₹)")}</th>
              )}
              {visibleColumns.includes("lineTotal") && (
                <th className="p-3 w-28 text-right">{getColLabel("lineTotal", "Amount (₹)")}</th>
              )}
              <th className="p-3 w-12 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2EAE3]">
            {items.map((it, idx) => (
              <tr key={idx} className="hover:bg-[#F5F7F1]/30">
                <td className="p-3 text-center text-[#64748B] font-mono">{idx + 1}</td>

                {/* Plant Name */}
                {visibleColumns.includes("plantName") && (
                  <td className="p-3">
                    <input
                      type="text"
                      list={`plants-list-${idx}`}
                      placeholder="Type or pick plant..."
                      value={it.plantName}
                      onChange={(e) => onItemChange(idx, "plantName", e.target.value)}
                      className="w-full rounded-lg border border-[#E2EAE3] p-2 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                    />
                    <datalist id={`plants-list-${idx}`}>
                      {products.map((p) => (
                        <option key={p._id || p.id} value={p.name}>
                          {p.plantVariety ? `${p.name} (${p.plantVariety})` : p.name}
                        </option>
                      ))}
                    </datalist>
                  </td>
                )}

                {/* Variety */}
                {visibleColumns.includes("variety") && (
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder="e.g. Golden Cane"
                      value={it.variety}
                      onChange={(e) => onItemChange(idx, "variety", e.target.value)}
                      className="w-full rounded-lg border border-[#E2EAE3] p-2 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                    />
                  </td>
                )}

                {/* Size */}
                {visibleColumns.includes("plantSize") && (
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder="e.g. 10 inch bag, 5ft"
                      value={it.plantSize}
                      onChange={(e) => onItemChange(idx, "plantSize", e.target.value)}
                      className="w-full rounded-lg border border-[#E2EAE3] p-2 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                    />
                  </td>
                )}

                {/* Description */}
                {visibleColumns.includes("description") && (
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder="Item notes / specifications"
                      value={it.description}
                      onChange={(e) => onItemChange(idx, "description", e.target.value)}
                      className="w-full rounded-lg border border-[#E2EAE3] p-2 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                    />
                  </td>
                )}

                {/* Quantity */}
                {visibleColumns.includes("quantity") && (
                  <td className="p-3">
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={(e) => onItemChange(idx, "quantity", e.target.value)}
                      className="w-full rounded-lg border border-[#E2EAE3] p-2 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                    />
                  </td>
                )}

                {/* Unit */}
                {visibleColumns.includes("unitName") && (
                  <td className="p-3">
                    <select
                      value={it.unitName}
                      onChange={(e) => onItemChange(idx, "unitName", e.target.value)}
                      className="w-full rounded-lg border border-[#E2EAE3] p-2 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                    >
                      <option value="PCS">PCS</option>
                      <option value="POT">POT</option>
                      <option value="BAG">BAG</option>
                      <option value="BUNDLE">BUNDLE</option>
                      <option value="TRAY">TRAY</option>
                    </select>
                  </td>
                )}

                {/* Unit Price */}
                {visibleColumns.includes("unitPrice") && (
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={it.unitPrice}
                      onChange={(e) => onItemChange(idx, "unitPrice", e.target.value)}
                      className="w-full rounded-lg border border-[#E2EAE3] p-2 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none font-semibold"
                    />
                  </td>
                )}

                {/* Discount */}
                {visibleColumns.includes("discountAmount") && (
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={it.discountAmount}
                      onChange={(e) => onItemChange(idx, "discountAmount", e.target.value)}
                      className="w-full rounded-lg border border-[#E2EAE3] p-2 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none text-rose-600"
                    />
                  </td>
                )}

                {/* Line Total */}
                {visibleColumns.includes("lineTotal") && (
                  <td className="p-3 text-right font-extrabold text-[#123D2B]">
                    ₹{Number(it.lineTotal || 0).toLocaleString("en-IN")}
                  </td>
                )}

                {/* Remove Action */}
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    disabled={items.length === 1}
                    className="p-1 text-[#64748B] hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

