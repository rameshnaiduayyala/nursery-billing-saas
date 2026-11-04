import React from "react";
import { ArrowUpRight, ArrowDownRight, Plus, FilePlus2, Receipt, Users, Wallet, Sprout, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatCurrency } from "../lib/utils";

const stats = [
  { label: "Total sales", value: 1284500, change: "+12.8%", icon: Sprout, positive: true },
  { label: "Outstanding", value: 284500, change: "-4.2%", icon: Wallet, positive: true },
  { label: "Invoices issued", value: "148", change: "+8 this month", icon: Receipt, positive: true },
  { label: "Active customers", value: "86", change: "+6 new", icon: Users, positive: true },
];
const activity = [
  ["INV-2026-0148", "Anji Babu Garu", "Today, 10:42 AM", "₹45,000", "Paid"],
  ["INV-2026-0147", "Green Earth Landscapes", "Yesterday", "₹82,500", "Partial"],
  ["QUO-2026-0092", "Sai Nursery Traders", "Yesterday", "₹1,24,000", "Sent"],
  ["INV-2026-0146", "Vijaya Gardens", "02 Nov 2026", "₹28,500", "Overdue"],
];
export default function DashboardPage() {
  return <div className="space-y-7">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-sm font-medium text-[#28754b]">Tuesday, 04 November 2026</p><h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Good morning, Ramesh</h1><p className="mt-1 text-sm text-slate-500">Here’s what’s happening with your nursery today.</p></div>
      <div className="flex flex-wrap gap-2"><Button variant="secondary"><FilePlus2 size={16}/> New quotation</Button><Button><Plus size={17}/> Create invoice</Button></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => { const Icon=s.icon; return <Card key={s.label}><CardContent className="p-5"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">{s.label}</span><span className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><Icon size={18}/></span></div><div className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{typeof s.value === "number" ? formatCurrency(s.value) : s.value}</div><div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700"><ArrowUpRight size={14}/>{s.change}</div></CardContent></Card>; })}
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <Card><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Revenue overview</h2><p className="mt-1 text-xs text-slate-500">Sales performance for the last 6 months</p></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"><MoreHorizontal size={19}/></button></div><CardContent><div className="flex items-end justify-between gap-2 pt-4">
        {[42,58,48,76,62,92].map((h,i)=><div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="flex h-44 w-full items-end rounded-t-lg bg-emerald-50"><div className="w-full rounded-t-lg bg-[#2b8052]" style={{height:`${h}%`}}/></div><span className="text-xs text-slate-400">{["Jun","Jul","Aug","Sep","Oct","Nov"][i]}</span></div>)}
      </div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-sm text-slate-500">Total revenue</span><strong className="text-lg">{formatCurrency(1284500)}</strong></div></CardContent></Card>
      <Card><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Quick actions</h2><p className="mt-1 text-xs text-slate-500">Common tasks for your business</p></div><CardContent className="grid gap-3">
        {[["Create invoice","Prepare a new customer invoice",Receipt],["Add customer","Save a new customer profile",Users],["Record payment","Record cash or online payment",Wallet],["Add plant","Update your plant catalog",Sprout]].map(([title,desc,Icon])=><button key={title} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50"><span className="rounded-lg bg-slate-100 p-2.5 text-slate-600"><Icon size={18}/></span><span className="flex-1"><span className="block text-sm font-semibold text-slate-800">{title}</span><span className="block text-xs text-slate-500">{desc}</span></span><ArrowUpRight size={16} className="text-slate-400"/></button>)}
      </CardContent></Card>
    </div>
    <Card><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Recent activity</h2><p className="mt-1 text-xs text-slate-500">Latest quotations and invoices</p></div><button className="text-sm font-semibold text-[#28754b]">View all</button></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr>{["Document","Customer","Date","Amount","Status"].map(x=><th key={x} className="px-5 py-3 font-semibold">{x}</th>)}</tr></thead><tbody>{activity.map((r)=><tr key={r[0]} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold text-slate-800">{r[0]}</td><td className="px-5 py-4 text-slate-600">{r[1]}</td><td className="px-5 py-4 text-slate-500">{r[2]}</td><td className="px-5 py-4 font-medium text-slate-800">{r[3]}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r[4]==="Paid"?"bg-emerald-50 text-emerald-700":r[4]==="Overdue"?"bg-red-50 text-red-700":"bg-amber-50 text-amber-700"}`}>{r[4]}</span></td></tr>)}</tbody></table></div></Card>
  </div>;
}
