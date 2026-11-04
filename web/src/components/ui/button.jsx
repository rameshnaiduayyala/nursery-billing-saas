import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Reusable Button component aligned to the design palette:
 * - Primary: Forest Green (#123D2B) -> Hover Deep Emerald (#176B45)
 * - Secondary: Sage outline/tint (#A8C9A5)
 * - Accent: Champagne Gold (#C6A76A)
 * - Outline: White card bg with border #E2EAE3
 * - Ghost: Transparent with hover
 * - Danger: Red indicator
 */
const variants = {
  primary:
    "bg-[#123D2B] text-white hover:bg-[#176B45] shadow-sm focus-visible:ring-[#176B45]",
  secondary:
    "bg-[#A8C9A5]/20 text-[#123D2B] border border-[#A8C9A5]/50 hover:bg-[#A8C9A5]/35 focus-visible:ring-[#A8C9A5]",
  accent:
    "bg-[#C6A76A] text-white hover:bg-[#B39355] shadow-sm focus-visible:ring-[#C6A76A]",
  outline:
    "bg-white text-[#1F2937] border border-[#E2EAE3] hover:bg-[#F5F7F1] hover:border-[#A8C9A5] focus-visible:ring-[#123D2B]",
  ghost:
    "text-[#1F2937] hover:bg-[#E2EAE3]/50 focus-visible:ring-[#123D2B]",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus-visible:ring-rose-500",
};

const sizes = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-5 text-base rounded-xl gap-2.5",
  icon: "h-10 w-10 p-0 rounded-xl justify-center",
};

export const Button = React.forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    loading = false,
    icon: Icon = null,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === "sm" ? 14 : 16} />
      ) : Icon ? (
        <Icon className="shrink-0" size={size === "sm" ? 14 : 16} />
      ) : null}
      {children}
    </button>
  );
});

export default Button;
