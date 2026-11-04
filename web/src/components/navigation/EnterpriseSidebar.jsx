import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Leaf,
  LogOut,
  ChevronRight,
  Shield,
  Building,
  Sparkles,
  X,
} from "lucide-react";
import { getNavigationForUser } from "./navigationConfig";
import logoImg from "../../assets/branding/NurseryDeskLogo.png";

/**
 * Enterprise Premium Sidebar:
 * - Brand logo: NurseryDeskLogo.png
 * - Color palette:
 *   - Background: White (#FFFFFF) with Soft Green Grey border (#E2EAE3)
 *   - Active links: Forest Green (#123D2B) background, White text, Champagne Gold accent
 *   - Hover: Warm Ivory (#F5F7F1)
 *   - Role pill: Sage (#A8C9A5) tint
 * - Organization / Branch switcher pill
 * - Collapsible on mobile
 */
export function EnterpriseSidebar({ user, isMobileOpen = false, onCloseMobile = () => {} }) {
  const navigate = useNavigate();
  const navigation = getNavigationForUser(user);
  const isSuperAdmin = Boolean(user?.isSuperAdmin);
  const role = (user?.role || "OWNER").toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("nursery_user");
    localStorage.removeItem("nursery_current_org");
    localStorage.removeItem("nursery_current_branch");
    localStorage.removeItem("nursery_token");
    navigate("/");
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

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      {/* 1. Header & Logo */}
      <div className="flex h-20 items-center justify-between border-b border-[#E2EAE3] px-6">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="NurseryDesk"
            className="h-9 w-auto max-w-[155px] object-contain"
          />
        </div>
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F5F7F1] md:hidden cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. Organization & Branch Scope (Only for nursery tenants) */}
      {!isSuperAdmin && role !== "CUSTOMER" && (
        <div className="border-b border-[#E2EAE3] p-4">
          <div className="group flex items-center justify-between rounded-xl border border-[#E2EAE3] bg-[#F5F7F1] p-3 transition hover:border-[#A8C9A5]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#123D2B] text-[#C6A76A]">
                <Leaf size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-[#1F2937]">
                  {user?.organization?.name || "Greenfield Nursery"}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#176B45]" />
                  <span>Main HQ Branch</span>
                </div>
              </div>
            </div>
            <span className="rounded bg-[#A8C9A5]/30 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#123D2B]">
              Active
            </span>
          </div>
        </div>
      )}

      {/* 3. Role-Based Navigation Groups (Smooth independent scrolling) */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5 [scrollbar-width:thin] [scrollbar-color:#A8C9A5_transparent]">
        {navigation.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#64748B]">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#123D2B] text-white font-semibold shadow-sm"
                          : "text-[#1F2937] hover:bg-[#F5F7F1] hover:text-[#123D2B]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            size={18}
                            className={`shrink-0 transition-colors ${
                              isActive ? "text-[#C6A76A]" : "text-[#64748B] group-hover:text-[#123D2B]"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge ? (
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isActive
                                ? "bg-[#C6A76A] text-[#123D2B]"
                                : "bg-[#A8C9A5]/25 text-[#123D2B] border border-[#A8C9A5]/40"
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 4. Enterprise User Profile Footer */}
      <div className="border-t border-[#E2EAE3] p-4 bg-white">
        <div className="flex items-center justify-between rounded-xl border border-[#E2EAE3] bg-[#F5F7F1] p-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123D2B] text-xs font-bold text-[#C6A76A] shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-[#1F2937]">
                {user?.name || (isSuperAdmin ? "Super Admin" : "Staff Member")}
              </div>
              <div className="truncate text-[11px] text-[#64748B]">
                {user?.email || "nursery@desk.com"}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out of NurseryDesk"
            className="rounded-lg p-1.5 text-[#64748B] hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Persistent Sidebar (Fixed to viewport, 100vh) */}
      <aside className="hidden md:block w-68 shrink-0">
        <div className="fixed inset-y-0 left-0 z-30 w-68 border-r border-[#E2EAE3] bg-white shadow-sm">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#123D2B]/40 backdrop-blur-sm animate-in fade-in"
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85%] border-r border-[#E2EAE3] bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default EnterpriseSidebar;

