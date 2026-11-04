import React from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "./card";

export function StatCard({
  title,
  value,
  subtitle = null,
  icon: Icon = null,
  trend = null,
  variant = "default",
  className = "",
}) {
  const iconColors = {
    default: "bg-[#123D2B]/10 text-[#123D2B]",
    emerald: "bg-[#176B45]/10 text-[#176B45]",
    gold: "bg-[#C6A76A]/15 text-[#8F7033]",
    sage: "bg-[#A8C9A5]/25 text-[#123D2B]",
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {title}
            </span>
            <div className="mt-2 text-2xl font-bold tracking-tight text-[#1F2937]">
              {value}
            </div>
            {subtitle && (
              <p className="mt-1 text-xs text-[#64748B]">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                "rounded-xl p-3 shrink-0",
                iconColors[variant] || iconColors.default
              )}
            >
              <Icon size={20} />
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 border-t border-[#E2EAE3] pt-3 text-xs font-medium text-[#176B45]">
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StatCard;

