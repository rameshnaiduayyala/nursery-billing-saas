import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export function EmptyState({
  icon: Icon = null,
  title,
  description = null,
  actionLabel = null,
  onAction = null,
  className = "",
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[#E2EAE3] bg-white p-12 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F7F1] text-[#A8C9A5]">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-base font-bold text-[#1F2937]">{title}</h3>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-xs text-[#64748B]">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} variant="primary" size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;

