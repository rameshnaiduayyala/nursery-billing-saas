import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "../../lib/utils";

/**
 * Enterprise Area & Line Revenue Chart
 * Palette Colors:
 * - Primary stroke: Deep Emerald (#176B45)
 * - Gradient fill: Deep Emerald to transparent
 * - Grid: Soft Green Grey (#E2EAE3)
 * - Axis text: Slate (#64748B)
 */
export function RevenueTrendChart({
  data = [],
  title = "Revenue & Sales Performance",
  subtitle = "Monthly invoicing and collection trajectory",
  dataKey = "amount",
  xAxisKey = "date",
  height = 300,
  className = "",
  formatter = (val) => `₹${Number(val).toLocaleString("en-IN")}`,
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E2EAE3] bg-white p-6 shadow-xs",
        className
      )}
    >
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1F2937]">{title}</h3>
          {subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="nurseryRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#176B45" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#176B45" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EAE3" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-[#E2EAE3] bg-white p-3 shadow-lg">
                      <div className="text-[11px] font-semibold text-[#64748B]">{label}</div>
                      <div className="mt-1 text-sm font-extrabold text-[#123D2B]">
                        {formatter(payload[0].value)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#176B45"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#nurseryRevenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueTrendChart;

