import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "../../lib/utils";

/**
 * Enterprise Inflow vs Outflow / Branch Comparison Bar Chart
 * Palette Colors:
 * - Sales / Invoiced: Forest Green (#123D2B)
 * - Collections / Paid: Deep Emerald (#176B45)
 * - Expenses: Champagne Gold (#C6A76A)
 */
export function ComparisonBarChart({
  data = [],
  title = "Invoiced vs Collections vs Expenses",
  subtitle = "Comparative performance breakdown",
  xAxisKey = "name",
  series = [
    { key: "invoiced", label: "Invoiced", color: "#123D2B" },
    { key: "collected", label: "Collected", color: "#176B45" },
    { key: "expenses", label: "Expenses", color: "#C6A76A" },
  ],
  height = 300,
  className = "",
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
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      <div className="text-[11px] font-semibold text-[#64748B] mb-1.5">{label}</div>
                      <div className="space-y-1">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-[#64748B]">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-bold text-[#1F2937]">
                              ₹{Number(entry.value).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 16, fontSize: 11 }}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ComparisonBarChart;

