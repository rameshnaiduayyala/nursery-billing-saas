import React from "react";
import { cn } from "../../lib/utils";

export function Table({ className = "", children, ...props }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#E2EAE3] bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className={cn("w-full text-left text-sm text-[#1F2937]", className)} {...props}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ className = "", children, ...props }) {
  return (
    <thead
      className={cn(
        "border-b border-[#E2EAE3] bg-[#F5F7F1]/70 text-xs font-semibold uppercase tracking-wider text-[#64748B]",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className = "", children, ...props }) {
  return (
    <tbody className={cn("divide-y divide-[#E2EAE3]", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = "", children, ...props }) {
  return (
    <tr
      className={cn("hover:bg-[#F5F7F1]/50 transition-colors", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className = "", children, ...props }) {
  return (
    <th className={cn("px-6 py-4 font-semibold", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className = "", children, ...props }) {
  return (
    <td className={cn("px-6 py-4 align-middle", className)} {...props}>
      {children}
    </td>
  );
}

