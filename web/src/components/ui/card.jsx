import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className = "", children }) {
  return <section className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>{children}</section>;
}
export function CardHeader({ className = "", children }) {
  return <div className={cn("border-b border-slate-100 px-5 py-4", className)}>{children}</div>;
}
export function CardContent({ className = "", children }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
