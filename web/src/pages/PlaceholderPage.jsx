import React from "react";
import { Construction } from "lucide-react";
export default function PlaceholderPage({ title, description }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Construction size={25}/></div>
    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description || "This module is scaffolded and ready for implementation."}</p>
    <span className="mt-5 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Starter page</span>
  </div>;
}
