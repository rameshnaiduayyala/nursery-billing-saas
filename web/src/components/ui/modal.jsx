import React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

export function Modal({
  isOpen = false,
  onClose,
  title,
  description = null,
  children,
  maxWidth = "max-w-lg",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#123D2B]/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={cn(
          "w-full rounded-2xl border border-[#E2EAE3] bg-white text-[#1F2937] shadow-xl",
          "animate-in zoom-in-95 duration-150",
          maxWidth
        )}
      >
        <div className="flex items-center justify-between border-b border-[#E2EAE3] px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-[#1F2937]">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-[#64748B]">{description}</p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-[#64748B] hover:bg-[#F5F7F1] hover:text-[#1F2937] transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

