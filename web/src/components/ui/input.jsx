import React from "react";
import { cn } from "../../lib/utils";

/**
 * Reusable Input component:
 * - Background: White (#FFFFFF)
 * - Border: Soft Green Grey (#E2EAE3)
 * - Focus ring: Forest Green (#123D2B) or Deep Emerald (#176B45)
 * - Text: Charcoal (#1F2937)
 * - Placeholder / Muted: Slate (#64748B)
 */
export const Input = React.forwardRef(function Input(
  {
    className = "",
    type = "text",
    label = null,
    error = null,
    helperText = null,
    icon: Icon = null,
    ...props
  },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2937]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 text-[#64748B]">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2.5 text-sm text-[#1F2937] placeholder-[#64748B]/60 transition",
            "focus:border-[#176B45] focus:outline-none focus:ring-2 focus:ring-[#176B45]/15",
            "disabled:bg-[#F5F7F1] disabled:text-[#64748B] disabled:cursor-not-allowed",
            Icon && "pl-10",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B]">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;

