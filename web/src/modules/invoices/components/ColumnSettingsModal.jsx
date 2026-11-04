import React from "react";
import { Settings, RotateCcw, X, Edit2, Check } from "lucide-react";

export default function ColumnSettingsModal({
  columnsConfig,
  visibleColumns,
  editingColumnKey,
  editingLabel,
  setEditingLabel,
  setEditingColumnKey,
  isOpen,
  onClose,
  onToggleColumn,
  onStartEditLabel,
  onSaveLabelEdit,
  onResetColumns,
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-11 z-30 w-84 rounded-2xl border border-[#E2EAE3] bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-2.5 mb-3">
        <div className="flex items-center gap-1.5">
          <Settings size={15} className="text-[#123D2B]" />
          <span className="text-xs font-bold text-[#1F2937]">Columns & Header Names</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetColumns}
            title="Reset names and visibility to default"
            className="text-[#64748B] hover:text-[#123D2B] text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} /> Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-[#64748B] hover:text-[#1F2937] cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-[#64748B] mb-3">
        Check to show/hide columns. Click pencil icon to rename header.
      </p>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {columnsConfig.map((col) => {
          const isChecked = visibleColumns.includes(col.key);
          const isEditing = editingColumnKey === col.key;

          return (
            <div
              key={col.key}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs transition ${
                isChecked
                  ? "border-[#E2EAE3] bg-[#F5F7F1]/60"
                  : "border-transparent bg-slate-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2 flex-1 mr-2">
                <input
                  type="checkbox"
                  disabled={col.required}
                  checked={isChecked}
                  onChange={() => onToggleColumn(col.key)}
                  className="rounded text-[#123D2B] focus:ring-[#176B45] cursor-pointer disabled:opacity-40"
                />

                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text"
                      autoFocus
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onSaveLabelEdit(col.key);
                        if (e.key === "Escape") setEditingColumnKey(null);
                      }}
                      className="flex-1 rounded border border-[#176B45] bg-white px-1.5 py-0.5 text-xs text-[#1F2937] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onSaveLabelEdit(col.key)}
                      className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      <Check size={13} />
                    </button>
                  </div>
                ) : (
                  <span
                    className={`text-[#1F2937] font-semibold truncate ${
                      col.required ? "font-bold" : ""
                    }`}
                  >
                    {col.label}
                    {col.required && <span className="text-amber-700 ml-1 text-[10px]">*</span>}
                  </span>
                )}
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => onStartEditLabel(col)}
                  title="Rename header"
                  className="p-1 text-[#64748B] hover:text-[#123D2B] rounded-lg hover:bg-white cursor-pointer transition"
                >
                  <Edit2 size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

