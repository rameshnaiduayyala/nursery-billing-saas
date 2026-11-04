import React from "react";
import { cn } from "../../lib/utils";

/**
 * Reusable Card component aligned to the design palette:
 * - Cards: White (#FFFFFF)
 * - Borders: Soft Green Grey (#E2EAE3)
 * - Main text: Charcoal (#1F2937)
 * - Muted text: Slate (#64748B)
 */
export function Card({ className = "", children, ...props }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E2EAE3] bg-white text-[#1F2937] shadow-sm transition-shadow",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CardHeader({ className = "", children, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 border-b border-[#E2EAE3] px-6 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }) {
  return (
    <h3
      className={cn("text-base font-bold tracking-tight text-[#1F2937]", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }) {
  return (
    <p className={cn("text-xs text-[#64748B]", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }) {
  return (
    <div
      className={cn("flex items-center border-t border-[#E2EAE3] px-6 py-3.5 bg-[#F5F7F1]/30 rounded-b-2xl", className)}
      {...props}
    >
      {children}
    </div>
  );
}
