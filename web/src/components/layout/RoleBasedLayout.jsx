import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  Building2,
  Users,
  Package,
  FileText,
  ReceiptText,
  Wallet,
  Receipt,
  Settings,
  ShieldCheck,
  ChevronDown,
  Bell,
  Menu,
  Leaf,
  LogOut,
  Sliders,
  BarChart3,
  Folder,
  Shield,
  UserCheck,
} from "lucide-react";

export default function RoleBasedLayout() {
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("nursery_user") || "{}");
    } catch {
      return {};
    }
  })();

  const isSuperAdmin = Boolean(user?.isSuperAdmin);
  const role = (user?.role || "OWNER").toUpperCase();

  // 1. Super Admin Layout (Platform Central Administration only)
  const superAdminNav = [
    {
      label: "Platform Administration",
      items: [
        { to: "/admin/organizations", label: "Nursery Tenants & Approvals", icon: ShieldCheck },
      ],
    },
  ];

  // 2. Customer Portal Layout
  const customerPortalNav = [
    {
      label: "Self-Service",
      items: [
        { to: "/portal", label: "Customer Portal", icon: UserCheck },
      ],
    },
  ];

  // 3. Nursery Business Staff / Manager / Owner Layouts
  const nurseryOwnerNav = [
    { label: "Overview", items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
    {
      label: "Nursery Business",
      items: [
        { to: "/branches", label: "Branches", icon: Building2 },
        { to: "/employees", label: "Employees & Staff", icon: Users },
        { to: "/roles", label: "Roles & Permissions", icon: Shield },
        { to: "/customers", label: "Customers", icon: Users },
        { to: "/products", label: "Plant Catalog", icon: Package },
      ],
    },
    {
      label: "Billing & Accounts",
      items: [
        { to: "/quotations", label: "Quotations", icon: FileText },
        { to: "/invoices", label: "Invoices", icon: ReceiptText },
        { to: "/charges", label: "Charges & Tariffs", icon: Sliders },
        { to: "/payments", label: "Payments", icon: Wallet },
        { to: "/expenses", label: "Expenses", icon: Receipt },
      ],
    },
    {
      label: "Analytics & Organization",
      items: [
        { to: "/reports", label: "Financial Reports", icon: BarChart3 },
        { to: "/files", label: "Documents & Files", icon: Folder },
        { to: "/notifications", label: "Notifications", icon: Bell },
        { to: "/settings", label: "Business Settings", icon: Settings },
      ],
    },
  ];

  const salesStaffNav = [
    { label: "Overview", items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
    {
      label: "Sales Operations",
      items: [
        { to: "/products", label: "Plant Catalog", icon: Package },
        { to: "/customers", label: "Customers", icon: Users },
        { to: "/quotations", label: "Quotations", icon: FileText },
        { to: "/invoices", label: "Invoices", icon: ReceiptText },
        { to: "/payments", label: "Record Payment", icon: Wallet },
      ],
    },
    {
      label: "Notifications",
      items: [
        { to: "/notifications", label: "Alerts", icon: Bell },
      ],
    },
  ];

  const accountantNav = [
    { label: "Overview", items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
    {
      label: "Accounts & Financials",
      items: [
        { to: "/customers", label: "Customers & Ledgers", icon: Users },
        { to: "/invoices", label: "Invoices", icon: ReceiptText },
        { to: "/payments", label: "Payments & Receipts", icon: Wallet },
        { to: "/expenses", label: "Expenses", icon: Receipt },
        { to: "/charges", label: "Charges & Tariffs", icon: Sliders },
        { to: "/reports", label: "Financial Statements", icon: BarChart3 },
      ],
    },
    {
      label: "Records",
      items: [
        { to: "/files", label: "Document Storage", icon: Folder },
        { to: "/notifications", label: "Alerts", icon: Bell },
      ],
    },
  ];

  const inventoryStaffNav = [
    { label: "Overview", items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
    {
      label: "Inventory Operations",
      items: [
        { to: "/products", label: "Plant Catalog & Stock", icon: Package },
        { to: "/branches", label: "Branch Stock", icon: Building2 },
        { to: "/files", label: "Plant Images & Docs", icon: Folder },
        { to: "/notifications", label: "Alerts", icon: Bell },
      ],
    },
  ];

  // Select navigation based on authenticated role
  let navigation = nurseryOwnerNav;
  if (isSuperAdmin) {
    navigation = superAdminNav;
  } else if (role === "CUSTOMER") {
    navigation = customerPortalNav;
  } else if (role === "SALES_STAFF") {
    navigation = salesStaffNav;
  } else if (role === "ACCOUNTANT") {
    navigation = accountantNav;
  } else if (role === "INVENTORY_STAFF") {
    navigation = inventoryStaffNav;
  }

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
    : "NO";

  return (
    <div className="min-h-screen bg-[#F5F7F1] text-[#1F2937] md:flex">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[#E2EAE3] bg-white md:flex md:flex-col">
        {/* Brand header */}
        <div className="flex h-20 items-center gap-3 border-b border-[#E2EAE3] px-6">
          <div className="rounded-xl bg-[#123D2B] p-2 text-white">
            <Sprout size={24} />
          </div>
          <div>
            <div className="font-bold tracking-tight text-[#123D2B] text-lg">NurseryOS</div>
            <div className="text-xs text-[#64748B] font-medium">
              {isSuperAdmin
                ? "Platform Admin"
                : role === "CUSTOMER"
                ? "Customer Portal"
                : `${role.replace("_", " ")}`}
            </div>
          </div>
        </div>

        {/* Nursery switcher is ONLY shown for nursery tenants */}
        {!isSuperAdmin && role !== "CUSTOMER" && (
          <div className="border-b border-[#E2EAE3] p-4">
            <div className="flex w-full items-center gap-3 rounded-xl border border-[#E2EAE3] p-3 bg-[#F5F7F1]">
              <div className="rounded-lg bg-[#A8C9A5]/30 p-2 text-[#123D2B]">
                <Leaf size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-[#1F2937]">
                  {user?.organization?.name || "Greenfield Nursery"}
                </div>
                <div className="text-xs text-[#64748B]">Active Organization</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navigation.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#64748B]">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? "bg-[#123D2B] text-white font-semibold shadow-sm"
                            : "text-[#1F2937] hover:bg-[#F5F7F1] hover:text-[#123D2B]"
                        }`
                      }
                    >
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer badge */}
        <div className="border-t border-[#E2EAE3] p-4">
          <div className="flex items-center justify-between rounded-xl bg-[#F5F7F1] p-3 border border-[#E2EAE3]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123D2B] text-sm font-bold text-[#C6A76A]">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-[#1F2937]">
                  {user?.name || (isSuperAdmin ? "Super Admin" : "User")}
                </div>
                <div className="truncate text-xs text-[#64748B]">
                  {user?.email || "user@nursery.com"}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-[#64748B] hover:text-rose-600 rounded-lg transition cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content body */}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#E2EAE3] bg-white/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <div className="text-sm text-[#64748B]">
              Role:{" "}
              <span className="font-semibold text-[#123D2B]">
                {isSuperAdmin ? "Global Super Admin" : role}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NavLink
              to="/notifications"
              className="relative rounded-xl border border-[#E2EAE3] p-2 text-[#64748B] hover:bg-[#F5F7F1] hover:text-[#123D2B] transition"
              title="Notifications"
            >
              <Bell size={18} />
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2937] border border-[#E2EAE3] rounded-xl px-3 py-2 bg-white hover:bg-[#F5F7F1] transition cursor-pointer"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>
        <div className="p-4 md:p-8 bg-[#F5F7F1]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
