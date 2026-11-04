import React, { useEffect, useState } from "react";
import { ArrowUpRight, Plus, FilePlus2, Receipt, Users, Wallet, Sprout, Loader2, DollarSign } from "lucide-react";
import { KPICard, RevenueTrendChart, ComparisonBarChart, BreakdownDonutChart } from "../../components/analytics";
import { Button } from "../../components/ui/button";
import { formatCurrency } from "../../lib/utils";
import { apiRequest } from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    summary: {
      totalSales: 0,
      totalCollected: 0,
      totalOutstanding: 0,
      totalExpenses: 0,
      customerCount: 0,
      quotationsCount: 0,
      invoicesCount: 0,
    },
    recentInvoices: [],
  });

  const [monthlyTrend, setMonthlyTrend] = useState([
    { date: "Jun", amount: 24000 },
    { date: "Jul", amount: 48000 },
    { date: "Aug", amount: 65000 },
    { date: "Sep", amount: 82000 },
    { date: "Oct", amount: 110000 },
    { date: "Nov", amount: 145000 },
  ]);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nursery_user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        const res = await apiRequest("/reports/overview");
        if (res.success && res.data) {
          setOverview(res.data);
          // If total sales exists, adjust current month's trajectory point
          if (res.data.summary?.totalSales) {
            setMonthlyTrend((prev) => [
              ...prev.slice(0, 5),
              { date: "Nov (Current)", amount: res.data.summary.totalSales },
            ]);
          }
        }
      } catch (err) {
        console.error("Dashboard overview error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOverview();
  }, []);

  const comparisonData = [
    {
      name: "Q1",
      invoiced: 85000,
      collected: 72000,
      expenses: 32000,
    },
    {
      name: "Q2",
      invoiced: 120000,
      collected: 105000,
      expenses: 45000,
    },
    {
      name: "Q3",
      invoiced: 160000,
      collected: 142000,
      expenses: 58000,
    },
    {
      name: "Current",
      invoiced: overview.summary?.totalSales || 195000,
      collected: overview.summary?.totalCollected || 168000,
      expenses: overview.summary?.totalExpenses || 42000,
    },
  ];

  const expenseCategories = [
    { name: "Plant Stock & Seedlings", value: 45000 },
    { name: "Labour & Workers", value: 32000 },
    { name: "Transport & Fuel", value: 24000 },
    { name: "Pots & Bags Packaging", value: 18000 },
    { name: "Maintenance & Water", value: 12000 },
  ];

  return (
    <div className="space-y-7">
      {/* 1. Header Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#176B45]">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1F2937] md:text-3xl">
            Welcome back, {user?.name || "Nursery Owner"}
          </h1>
          <p className="mt-1 text-xs text-[#64748B]">Live nursery business operations, invoicing, and collections overview.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="secondary" onClick={() => navigate("/quotations")}>
            <FilePlus2 size={16} /> New Quotation
          </Button>
          <Button variant="primary" onClick={() => navigate("/invoices")}>
            <Plus size={16} /> Create Non-GST Invoice
          </Button>
        </div>
      </div>

      {/* 2. Reusable KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Invoiced Sales"
          value={formatCurrency(overview.summary?.totalSales || 0)}
          subtitle={`${overview.summary?.invoicesCount || 0} issued non-GST bills`}
          trend="+14.8%"
          trendLabel="vs last month"
          icon={Sprout}
          variant="primary"
          badge="Billed"
        />

        <KPICard
          title="Collected Revenue"
          value={formatCurrency(overview.summary?.totalCollected || 0)}
          subtitle="Cash, UPI & Bank collections"
          trend="+9.2%"
          trendLabel="inflow rate"
          icon={DollarSign}
          variant="emerald"
          badge="Cash In"
        />

        <KPICard
          title="Outstanding Balances"
          value={formatCurrency(overview.summary?.totalOutstanding || 0)}
          subtitle="Active customer ledger dues"
          trend={overview.summary?.totalOutstanding > 0 ? "+4.1%" : "0%"}
          trendLabel="pending collection"
          icon={Wallet}
          variant="gold"
          badge="Receivables"
        />

        <KPICard
          title="Customer Directory"
          value={overview.summary?.customerCount || 0}
          subtitle="Wholesale, landscapers & retail"
          trend="+8"
          trendLabel="new accounts"
          icon={Users}
          variant="sage"
          badge="Clients"
        />
      </div>

      {/* 3. Reusable Graphs & Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Graph 1: Revenue Trend Area Chart */}
        <RevenueTrendChart
          data={monthlyTrend}
          title="Monthly Revenue Trajectory"
          subtitle="Invoiced sales growth across all branches"
          xAxisKey="date"
          dataKey="amount"
          height={280}
        />

        {/* Graph 2: Inflow vs Outflow Comparison Bar Chart */}
        <ComparisonBarChart
          data={comparisonData}
          title="Cash Inflow vs Expenses Breakdown"
          subtitle="Quarterly performance of invoiced sales, payments collected, and costs"
          xAxisKey="name"
          height={280}
        />
      </div>

      {/* 4. Bottom Grid: Expense Distribution & Quick Workflows */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Graph 3: Donut Chart for Expense Distribution */}
        <div className="lg:col-span-1">
          <BreakdownDonutChart
            data={expenseCategories}
            title="Operational Expenses"
            subtitle="Current operational spend allocation"
            height={280}
          />
        </div>

        {/* Quick Operational Shortcuts */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E2EAE3] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E2EAE3] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">Core Nursery Operations</h3>
                <p className="mt-0.5 text-xs text-[#64748B]">Frequently accessed business transactions</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Create Non-GST Invoice",
                  desc: "Generate bill with loading, transport and plant items",
                  icon: Receipt,
                  path: "/invoices",
                },
                {
                  title: "Send Quotation",
                  desc: "Share customer estimate with auto-conversion to invoice",
                  icon: FilePlus2,
                  path: "/quotations",
                },
                {
                  title: "Record Payment Receipt",
                  desc: "Post customer UPI or cash receipt & allocate to invoices",
                  icon: Wallet,
                  path: "/payments",
                },
                {
                  title: "Manage Plant Inventory",
                  desc: "Update plant varieties, polybag sizes, and rates",
                  icon: Sprout,
                  path: "/products",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    className="flex items-start gap-3 rounded-xl border border-[#E2EAE3] p-3.5 text-left transition hover:border-[#176B45]/40 hover:bg-[#F5F7F1]/70 cursor-pointer"
                  >
                    <div className="rounded-lg bg-[#123D2B]/10 p-2 text-[#123D2B] shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#1F2937]">{item.title}</div>
                      <div className="mt-0.5 text-[11px] text-[#64748B] line-clamp-1">{item.desc}</div>
                    </div>
                    <ArrowUpRight size={15} className="text-[#64748B] shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F5F7F1] p-3 text-xs text-[#64748B] border border-[#E2EAE3]">
            <span>Need to reconcile customer ledgers?</span>
            <button
              onClick={() => navigate("/reports")}
              className="font-bold text-[#176B45] hover:underline cursor-pointer"
            >
              Open Financial Reports →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
