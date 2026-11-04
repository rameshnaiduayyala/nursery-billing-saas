import React, { useEffect, useState } from "react";
import { ArrowUpRight, Plus, FilePlus2, Receipt, Users, Wallet, Sprout, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
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
      customerCount: 0,
      quotationsCount: 0,
      invoicesCount: 0,
    },
    recentInvoices: [],
  });

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
        }
      } catch (err) {
        console.error("Dashboard overview error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOverview();
  }, []);

  const stats = [
    {
      label: "Total sales",
      value: overview.summary?.totalSales || 0,
      change: "+12.4%",
      icon: Sprout,
    },
    {
      label: "Outstanding balance",
      value: overview.summary?.totalOutstanding || 0,
      change: "Active ledger dues",
      icon: Wallet,
    },
    {
      label: "Invoices issued",
      value: overview.summary?.invoicesCount || 0,
      change: "Non-GST invoices",
      icon: Receipt,
    },
    {
      label: "Active customers",
      value: overview.summary?.customerCount || 0,
      change: "Wholesale & Retail",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-[#28754b]">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Welcome, {user?.name || "Nursery Owner"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Live multi-branch nursery performance & sales metrics.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => navigate("/quotations")}>
            <FilePlus2 size={16} /> New quotation
          </Button>
          <Button onClick={() => navigate("/invoices")}>
            <Plus size={17} /> Create invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{s.label}</span>
                  <span className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                    <Icon size={18} />
                  </span>
                </div>
                <div className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                  {typeof s.value === "number" ? formatCurrency(s.value) : s.value}
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <ArrowUpRight size={14} />
                  {s.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Revenue & Collections</h2>
              <p className="mt-1 text-xs text-slate-500">Monthly billing trends with loading & freight</p>
            </div>
          </div>
          <CardContent>
            <div className="flex items-end justify-between gap-2 pt-4">
              {[45, 60, 52, 78, 65, 88].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-44 w-full items-end rounded-t-lg bg-emerald-50">
                    <div className="w-full rounded-t-lg bg-[#2b8052]" style={{ height: `${h}%` }} />
                  </div>
                  <span className="text-xs text-slate-400">
                    {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm text-slate-500">Total Collections</span>
              <strong className="text-lg text-[#1b6840]">
                {formatCurrency(overview.summary?.totalCollected || 0)}
              </strong>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Quick Actions</h2>
            <p className="mt-1 text-xs text-slate-500">Core operational workflows</p>
          </div>
          <CardContent className="grid gap-3">
            {[
              ["Create invoice", "Issue non-GST bill with transport", Receipt, "/invoices"],
              ["Add customer", "Register wholesale buyer or landscaper", Users, "/customers"],
              ["Record payment", "Post cash or online UPI receipt", Wallet, "/payments"],
              ["Plant catalog", "Update varieties and pot rates", Sprout, "/products"],
            ].map(([title, desc, Icon, path]) => (
              <button
                key={title}
                onClick={() => navigate(path)}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                <span className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <Icon size={18} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-slate-800">{title}</span>
                  <span className="block text-xs text-slate-500">{desc}</span>
                </span>
                <ArrowUpRight size={16} className="text-slate-400" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


