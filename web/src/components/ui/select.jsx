import React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

export const Select = React.forwardRef(function Select(
  {
    className = "",
    label = null,
    error = null,
    helperText = null,
    children,
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
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-xl border border-[#E2EAE3] bg-white px-3.5 py-2.5 pr-10 text-sm text-[#1F2937] transition",
            "focus:border-[#176B45] focus:outline-none focus:ring-2 focus:ring-[#176B45]/15",
            "disabled:bg-[#F5F7F1] disabled:text-[#64748B] disabled:cursor-not-allowed",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 text-[#64748B]"
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

export default Select;

