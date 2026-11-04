import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  LogOut,
  Menu,
  Shield,
  Building,
  Sparkles,
  Command,
} from "lucide-react";

/**
 * Enterprise Premium Header:
 * - Search bar with shortcut indicator
 * - Live active role pill badge (Forest Green & Champagne Gold)
 * - Notification bell with unread indicator
 * - User Avatar badge with Name & Role preview
 * - Logout CTA
 * - Mobile drawer hamburger toggle
 */
export function EnterpriseHeader({ user, onOpenMobile = () => {} }) {
  const navigate = useNavigate();
  const isSuperAdmin = Boolean(user?.isSuperAdmin);
  const role = (user?.role || "OWNER").toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("nursery_user");
    localStorage.removeItem("nursery_current_org");
    localStorage.removeItem("nursery_current_branch");
    localStorage.removeItem("nursery_token");
    navigate("/");
  };

  const getRoleDisplayName = () => {
    if (isSuperAdmin) return "Super Admin (Global)";
    switch (role) {
      case "OWNER":
        return "Nursery Owner";
      case "BRANCH_MANAGER":
        return "Branch Manager";
      case "ACCOUNTANT":
        return "Accountant";
      case "SALES_STAFF":
        return "Sales Executive";
      case "INVENTORY_STAFF":
        return "Inventory Supervisor";
      case "CUSTOMER":
        return "Customer";
      default:
        return role;
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : isSuperAdmin
    ? "SA"
    : "ND";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E2EAE3] bg-white/95 px-4 backdrop-blur-md md:px-8">
      {/* 1. Left section: Mobile menu button & breadcrumb role indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-xl border border-[#E2EAE3] p-2 text-[#1F2937] hover:bg-[#F5F7F1] md:hidden cursor-pointer"
          title="Open menu"
        >
          <Menu size={20} />
        </button>

      </div>

      {/* 2. Center search bar (Hidden on mobile) */}
      {!isSuperAdmin && role !== "CUSTOMER" && (
        <div className="hidden max-w-md flex-1 px-8 lg:block">
          <div className="relative flex items-center">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 text-[#64748B]"
            />
            <input
              type="text"
              placeholder="Search plants, non-GST invoices, customer ledgers..."
              className="w-full rounded-xl border border-[#E2EAE3] bg-[#F5F7F1]/60 py-2 pl-10 pr-16 text-xs text-[#1F2937] placeholder-[#64748B] transition focus:border-[#176B45] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#176B45]/15"
            />
            <div className="pointer-events-none absolute right-3 flex items-center gap-0.5 rounded border border-[#E2EAE3] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#64748B]">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Right actions: Notifications & User Avatar with Name and Role */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications Icon with active pulse indicator */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `relative rounded-xl border p-2.5 text-[#64748B] transition ${
              isActive
                ? "border-[#123D2B] bg-[#123D2B] text-white"
                : "border-[#E2EAE3] bg-white hover:border-[#A8C9A5] hover:bg-[#F5F7F1] hover:text-[#123D2B]"
            }`
          }
          title="Notifications & Alerts"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#C6A76A] ring-2 ring-white" />
        </NavLink>

        {/* User Profile Avatar with Name and Role */}
        <div className="flex items-center gap-3 rounded-xl border border-[#E2EAE3] bg-[#F5F7F1]/80 px-3 py-1.5 shadow-xs">
          {/* Avatar Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#123D2B] text-xs font-bold text-[#C6A76A] shadow-sm">
            {initials}
          </div>
          {/* Name & Role Text */}
          <div className="hidden flex-col sm:flex min-w-0 pr-1">
            <span className="truncate text-xs font-bold text-[#1F2937] max-w-[130px]">
              {user?.name || (isSuperAdmin ? "Super Admin" : "Staff Member")}
            </span>
            <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-[#176B45]">
              {getRoleDisplayName()}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}

export default EnterpriseHeader;
