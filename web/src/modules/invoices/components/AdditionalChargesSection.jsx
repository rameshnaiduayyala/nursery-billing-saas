import React, { useState } from "react";
import { Plus, Trash2, Edit2, X, PlusCircle } from "lucide-react";

export default function AdditionalChargesSection({
  charges,
  onAddCharge,
  onUpdateCharge,
  onRemoveCharge,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [chargeName, setChargeName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleOpenAddModal = () => {
    setEditingIndex(null);
    setChargeName("");
    setDescription("");
    setAmount("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (idx, ch) => {
    setEditingIndex(idx);
    setChargeName(ch.name || "");
    setDescription(ch.description || "");
    setAmount(ch.amount ?? "");
    setModalOpen(true);
  };

  const handleSaveCharge = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!chargeName.trim()) {
      alert("Please enter a charge name");
      return;
    }
    const parsedAmount = Number(amount) || 0;
    if (parsedAmount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    const payload = {
      name: chargeName.trim(),
      description: description.trim(),
      amount: parsedAmount,
    };

    if (editingIndex !== null && onUpdateCharge) {
      onUpdateCharge(editingIndex, payload);
    } else {
      onAddCharge(payload);
    }

    setModalOpen(false);
  };

  return (
    <div className="mt-8 border-t border-[#E2EAE3] pt-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F2937]">
            Additional Charges ({charges.length})
          </h3>
          <p className="text-xs text-[#64748B]">Add custom tariffs like Loading, Transport, Labour, Packaging, etc.</p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EAE3] bg-white px-3 py-1.5 text-xs font-semibold text-[#123D2B] hover:bg-[#F5F7F1] hover:border-[#176B45]/40 transition shadow-2xs cursor-pointer"
          title="Add Additional Charge"
        >
          <Plus size={14} className="text-[#176B45]" />
          <span>Add Charge</span>
        </button>
      </div>

      {charges.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E2EAE3] p-4 text-center text-xs text-[#64748B]">
          No additional charges added. Click "+ Add Charge" to add custom delivery, freight or labour tariffs.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E2EAE3] bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7F1] border-b border-[#E2EAE3] text-[#64748B] font-bold uppercase">
              <tr>
                <th className="p-3 w-8 text-center">#</th>
                <th className="p-3 min-w-[140px]">Charge Name</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right w-32">Amount (₹)</th>
                <th className="p-3 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE3]">
              {charges.map((ch, idx) => (
                <tr key={idx} className="hover:bg-[#F5F7F1]/30">
                  <td className="p-3 text-center text-[#64748B] font-mono">{idx + 1}</td>
                  <td className="p-3 font-semibold text-[#1F2937]">{ch.name}</td>
                  <td className="p-3 text-[#64748B]">{ch.description || "—"}</td>
                  <td className="p-3 text-right font-bold text-[#123D2B]">
                    ₹{Number(ch.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(idx, ch)}
                        title="Edit charge"
                        className="p-1.5 text-[#64748B] hover:text-[#176B45] hover:bg-[#F5F7F1] rounded-md transition cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveCharge(idx)}
                        title="Remove charge"
                        className="p-1.5 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Charge Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E2EAE3] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <PlusCircle size={18} className="text-[#176B45]" />
                <h3 className="text-sm font-bold text-[#1F2937]">
                  {editingIndex !== null ? "Edit Additional Charge" : "Add Additional Charge"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#64748B] hover:text-[#1F2937] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">
                  Charge Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Loading Charges, Transport, Labour"
                  value={chargeName}
                  onChange={(e) => setChargeName(e.target.value)}
                  className="w-full rounded-xl border border-[#E2EAE3] p-2.5 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">
                  Description / Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vehicle delivery to farm gate, 2 labourers"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#E2EAE3] p-2.5 text-xs text-[#1F2937] focus:border-[#176B45] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">
                  Amount (₹) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B]">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveCharge(e);
                      }
                    }}
                    className="w-full rounded-xl border border-[#E2EAE3] p-2.5 pl-7 text-xs font-bold text-[#123D2B] focus:border-[#176B45] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 border-t border-[#E2EAE3] pt-4 mt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[#E2EAE3] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F5F7F1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCharge}
                  className="rounded-xl bg-[#123D2B] px-5 py-2 text-xs font-bold text-white hover:bg-[#176B45] transition cursor-pointer shadow-xs"
                >
                  {editingIndex !== null ? "Update Charge" : "Add Charge"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
