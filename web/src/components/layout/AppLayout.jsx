import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Sprout, LayoutDashboard, Building2, Users, Package, FileText,
  ReceiptText, Wallet, ChartNoAxesCombined, Settings, ChevronDown,
  Search, Bell, Menu, Leaf
} from "lucide-react";

const navigation = [
  { label: "Overview", items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Business", items: [
    { to: "/branches", label: "Branches", icon: Building2 },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/products", label: "Plant catalog", icon: Package },
  ]},
  { label: "Sales & billing", items: [
    { to: "/quotations", label: "Quotations", icon: FileText },
    { to: "/invoices", label: "Invoices", icon: ReceiptText },
    { to: "/payments", label: "Payments", icon: Wallet },
  ]},
  { label: "Insights", items: [{ to: "/reports", label: "Reports", icon: ChartNoAxesCombined }] },
  { label: "Workspace", items: [{ to: "/settings", label: "Settings", icon: Settings }] },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f6f8f6] md:flex">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="rounded-xl bg-[#e8f4eb] p-2 text-[#1f6b43]"><Sprout size={23}/></div>
          <div><div className="font-bold tracking-tight text-slate-900">NurseryOS</div><div className="text-xs text-slate-500">Business workspace</div></div>
        </div>
        <div className="border-b border-slate-100 p-4">
          <button className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><Leaf size={18}/></div>
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">Green Valley Nursery</div><div className="text-xs text-slate-500">Main branch</div></div>
            <ChevronDown size={16} className="text-slate-400"/>
          </button>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navigation.map(group => <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">{group.label}</p>
            <div className="space-y-1">{group.items.map(item => {
              const Icon = item.icon;
              return <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({isActive}) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-[#eaf4ed] text-[#1b6840]" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={18}/>{item.label}</NavLink>;
            })}</div>
          </div>)}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dceee2] text-sm font-bold text-[#1f6b43]">RA</div>
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">Ramesh Admin</div><div className="text-xs text-slate-500">Nursery owner</div></div>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-slate-500 md:hidden"><Menu size={20}/></button><div className="text-sm text-slate-500">Workspace <span className="mx-2">/</span><span className="font-semibold text-slate-800">Management</span></div></div>
          <div className="flex items-center gap-3"><button className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 sm:flex"><Search size={16}/> Search <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">⌘ K</kbd></button><button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell size={19}/><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500"/></button><div className="h-8 w-8 rounded-full bg-emerald-100"/></div>
        </header>
        <div className="p-4 md:p-8"><Outlet/></div>
      </main>
    </div>
  );
}
