import React from "react";
import { cn } from "../../lib/utils";

const variants = {
  primary: "bg-[#1f6b43] text-white hover:bg-[#185536]",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
export function Button({ children, variant = "primary", className = "", ...props }) {
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50", variants[variant], className)} {...props}>{children}</button>;
}
