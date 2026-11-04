import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "../../lib/utils";

/**
 * Enterprise Category / Expense Breakdown Donut Chart
 * Palette Colors:
 * - Forest Green (#123D2B)
 * - Deep Emerald (#176B45)
 * - Sage (#A8C9A5)
 * - Champagne Gold (#C6A76A)
 * - Warm Ivory Tint (#8F7033)
 */
export function BreakdownDonutChart({
  data = [],
  title = "Expense Distribution",
  subtitle = "Breakdown by operational category",
  dataKey = "value",
  nameKey = "name",
  height = 300,
  className = "",
  colors = ["#123D2B", "#176B45", "#A8C9A5", "#C6A76A", "#8F7033", "#64748B"],
}) {
  const total = data.reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0);

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E2EAE3] bg-white p-6 shadow-xs",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1F2937]">{title}</h3>
        {subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0];
                  const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="rounded-xl border border-[#E2EAE3] bg-white p-3 shadow-lg">
                      <div className="text-xs font-semibold text-[#64748B]">{entry.name}</div>
                      <div className="mt-1 text-sm font-bold text-[#1F2937]">
                        ₹{Number(entry.value).toLocaleString("en-IN")}{" "}
                        <span className="text-xs font-normal text-[#176B45]">({percentage}%)</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BreakdownDonutChart;

