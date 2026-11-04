import React from "react";
import { cn } from "../../lib/utils";

/**
 * Reusable Badge component aligned with palette:
 * - Forest Green / Emerald (active, success, paid)
 * - Champagne Gold (pending, quotation, warning)
 * - Sage (neutral info, category)
 * - Slate / Soft Grey (muted, draft)
 * - Rose (cancelled, overdue, error)
 */
const badgeVariants = {
  primary: "bg-[#123D2B] text-white",
  success: "bg-[#176B45]/10 text-[#176B45] border border-[#176B45]/20",
  sage: "bg-[#A8C9A5]/25 text-[#123D2B] border border-[#A8C9A5]/40",
  gold: "bg-[#C6A76A]/15 text-[#8F7033] border border-[#C6A76A]/30",
  neutral: "bg-[#E2EAE3] text-[#1F2937] border border-[#E2EAE3]",
  muted: "bg-slate-100 text-[#64748B]",
  danger: "bg-rose-50 text-rose-700 border border-rose-200",
};

export function Badge({
  children,
  variant = "sage",
  className = "",
  icon: Icon = null,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider select-none",
        badgeVariants[variant] || badgeVariants.sage,
        className
      )}
      {...props}
    >
      {Icon && <Icon size={12} className="shrink-0" />}
      {children}
    </span>
  );
}

export default Badge;

