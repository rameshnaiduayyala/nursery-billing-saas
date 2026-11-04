import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Enterprise Reusable KPICard component
 * Palette:
 * - Forest Green (#123D2B)
 * - Deep Emerald (#176B45)
 * - Sage (#A8C9A5)
 * - Champagne Gold (#C6A76A)
 * - Charcoal (#1F2937)
 * - Slate (#64748B)
 * - Soft Green Grey (#E2EAE3)
 * - Warm Ivory (#F5F7F1)
 */
export function KPICard({
  title,
  value,
  subtitle = null,
  icon: Icon = null,
  trend = null, // e.g. "+14.2%" or "-3.5%"
  trendLabel = null, // e.g. "vs last month"
  variant = "emerald", // "emerald" | "gold" | "sage" | "primary" | "slate" | "rose"
  className = "",
  badge = null,
}) {
  const variantStyles = {
    primary: {
      iconBg: "bg-[#123D2B]/10 text-[#123D2B]",
      accentBorder: "hover:border-[#123D2B]/40",
      pillBg: "bg-[#123D2B]/10 text-[#123D2B]",
    },
    emerald: {
      iconBg: "bg-[#176B45]/10 text-[#176B45]",
      accentBorder: "hover:border-[#176B45]/40",
      pillBg: "bg-[#176B45]/10 text-[#176B45]",
    },
    gold: {
      iconBg: "bg-[#C6A76A]/20 text-[#8F7033]",
      accentBorder: "hover:border-[#C6A76A]/50",
      pillBg: "bg-[#C6A76A]/15 text-[#8F7033]",
    },
    sage: {
      iconBg: "bg-[#A8C9A5]/30 text-[#123D2B]",
      accentBorder: "hover:border-[#A8C9A5]",
      pillBg: "bg-[#A8C9A5]/25 text-[#123D2B]",
    },
    slate: {
      iconBg: "bg-slate-100 text-[#64748B]",
      accentBorder: "hover:border-slate-300",
      pillBg: "bg-slate-100 text-[#64748B]",
    },
    rose: {
      iconBg: "bg-rose-50 text-rose-700",
      accentBorder: "hover:border-rose-300",
      pillBg: "bg-rose-50 text-rose-700",
    },
  };

  const style = variantStyles[variant] || variantStyles.emerald;

  const isPositive = typeof trend === "string" && trend.startsWith("+");
  const isNegative = typeof trend === "string" && trend.startsWith("-");

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-[#E2EAE3] bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md",
        style.accentBorder,
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            {title}
          </span>
          <div className="flex items-center gap-2">
            {badge && (
              <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", style.pillBg)}>
                {badge}
              </span>
            )}
            {Icon && (
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                  style.iconBg
                )}
              >
                <Icon size={18} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-extrabold tracking-tight text-[#1F2937] sm:text-3xl">
            {value}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-[#64748B] line-clamp-1">{subtitle}</p>
          )}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 border-t border-[#E2EAE3] pt-3 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-bold",
              isPositive
                ? "text-[#176B45]"
                : isNegative
                ? "text-rose-600"
                : "text-[#64748B]"
            )}
          >
            {isPositive ? (
              <TrendingUp size={14} />
            ) : isNegative ? (
              <TrendingDown size={14} />
            ) : (
              <Minus size={14} />
            )}
            {trend}
          </span>
          {trendLabel && (
            <span className="text-[11px] text-[#64748B]">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default KPICard;

