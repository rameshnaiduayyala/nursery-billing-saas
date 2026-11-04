import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Leaf,
  LogOut,
  ChevronDown,
  Building2,
  Check,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import { getNavigationForUser } from "./navigationConfig";
import { apiRequest } from "../../lib/api";
import logoImg from "../../assets/branding/NurseryDeskLogo.png";

/**
 * Enterprise Premium Sidebar:
 * - Brand logo: NurseryDeskLogo.png
 * - Interactive Branch Switcher Dropdown (reads branches, updates current branch, emits window event)
 * - Navigation menu with active and hover states
 * - Role-tailored menu groups
 * - User Profile & Logout footer
 */
export function EnterpriseSidebar({ user, isMobileOpen = false, onCloseMobile = () => {} }) {
  const navigate = useNavigate();
  const navigation = getNavigationForUser(user);
  const isSuperAdmin = Boolean(user?.isSuperAdmin);
  const role = (user?.role || "OWNER").toUpperCase();

  // Branch switcher state
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const dropdownRef = useRef(null);

  // Load branches for current organization
  useEffect(() => {
    if (isSuperAdmin || role === "CUSTOMER") return;

    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const res = await apiRequest("/branches");
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setBranches(res.data);
          const savedBranchId = localStorage.getItem("nursery_current_branch");
          const matched = res.data.find((b) => (b._id || b.id) === savedBranchId);
          const activeBranch = matched || res.data[0];
          setCurrentBranch(activeBranch);
          localStorage.setItem("nursery_current_branch", activeBranch._id || activeBranch.id);
        }
      } catch (err) {
        console.warn("Could not fetch branches:", err.message);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, [isSuperAdmin, role]);

  // Close branch dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectBranch = (branch) => {
    const branchId = branch._id || branch.id;
    setCurrentBranch(branch);
    localStorage.setItem("nursery_current_branch", branchId);
    setDropdownOpen(false);

    // Notify other components (Dashboard, Invoices, Quotations) that the branch changed
    window.dispatchEvent(
      new CustomEvent("nursery:branch-changed", {
        detail: { branchId, branchName: branch.name, branchCode: branch.code },
      })
    );
  };

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

      {/* 2. Interactive Branch Switcher Dropdown (Only for nursery staff/owners) */}
      {!isSuperAdmin && role !== "CUSTOMER" && (
        <div className="relative border-b border-[#E2EAE3] p-4" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="group flex w-full items-center justify-between rounded-xl border border-[#E2EAE3] bg-[#F5F7F1] p-3 transition hover:border-[#176B45]/40 hover:bg-[#F5F7F1]/80 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#123D2B] text-[#C6A76A]">
                <Building2 size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-[#1F2937]">
                  {currentBranch?.name || user?.organization?.name || "Main Branch"}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#176B45]" />
                  <span>
                    {currentBranch ? `Branch: ${currentBranch.code || "HQ"}` : "Select Branch"}
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown
              size={15}
              className={`text-[#64748B] transition-transform duration-200 shrink-0 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Branch Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute left-4 right-4 top-[84px] z-50 rounded-2xl border border-[#E2EAE3] bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Switch Active Branch
              </div>

              {loadingBranches ? (
                <div className="flex items-center justify-center p-4 text-[#64748B]">
                  <Loader2 size={16} className="animate-spin text-[#176B45] mr-2" />
                  <span className="text-xs">Loading branches...</span>
                </div>
              ) : branches.length === 0 ? (
                <div className="p-3 text-center text-xs text-[#64748B]">
                  No additional branches created yet.
                </div>
              ) : (
                <div className="max-h-56 space-y-1 overflow-y-auto">
                  {branches.map((b) => {
                    const isSelected = (currentBranch?._id || currentBranch?.id) === (b._id || b.id);
                    return (
                      <button
                        key={b._id || b.id}
                        type="button"
                        onClick={() => handleSelectBranch(b)}
                        className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-[#123D2B] text-white"
                            : "text-[#1F2937] hover:bg-[#F5F7F1]"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2
                            size={14}
                            className={isSelected ? "text-[#C6A76A]" : "text-[#64748B]"}
                          />
                          <span className="truncate">{b.name}</span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-[#64748B]"
                            }`}
                          >
                            {b.code}
                          </span>
                        </div>
                        {isSelected && <Check size={14} className="text-[#C6A76A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-2 border-t border-[#E2EAE3] pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/branches");
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-[#176B45] hover:bg-[#176B45]/10 transition cursor-pointer"
                >
                  <Plus size={14} /> Manage / Add Branches
                </button>
              </div>
            </div>
          )}
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
      {/* Desktop Fixed Persistent Sidebar */}
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
