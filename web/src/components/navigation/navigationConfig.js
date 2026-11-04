import {
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
  Bell,
  Sliders,
  BarChart3,
  Folder,
  Shield,
  UserCheck,
  Store,
  Layers,
  FileSpreadsheet,
} from "lucide-react";

/**
 * Enterprise navigation specifications for every role in the platform.
 * Supports:
 * - SUPER_ADMIN (Platform Central Governance, Tenant Approvals)
 * - OWNER (Nursery Owner / Principal Nursery Admin)
 * - BRANCH_MANAGER (Branch Manager / Operations Lead)
 * - ACCOUNTANT (Financials, Invoicing, Payments, Ledgers, Reports)
 * - SALES_STAFF (Quotations, Invoices, Plant Catalog, Customer Orders)
 * - INVENTORY_STAFF (Stock levels, Plant Catalog, Storage Docs)
 * - CUSTOMER (Self-service Portal: Quotations, Invoices, Account Ledger)
 */

export const navigationByRole = {
  SUPER_ADMIN: [
    {
      label: "Platform Governance",
      items: [
        {
          to: "/admin/organizations",
          label: "Nursery Tenants & Approvals",
          icon: ShieldCheck,
          badge: "Central",
        },
      ],
    },
    {
      label: "System Alerts",
      items: [
        {
          to: "/notifications",
          label: "Platform Notifications",
          icon: Bell,
        },
      ],
    },
  ],

  OWNER: [
    {
      label: "Executive Overview",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/reports", label: "Financial Analytics", icon: BarChart3, badge: "Reports" },
      ],
    },
    {
      label: "Nursery Operations",
      items: [
        { to: "/branches", label: "Branches", icon: Building2 },
        { to: "/employees", label: "Staff & Employees", icon: Users },
        { to: "/roles", label: "Roles & Permissions", icon: Shield },
        { to: "/customers", label: "Customer Profiles", icon: Users },
        { to: "/products", label: "Plant Catalog", icon: Package },
      ],
    },
    {
      label: "Sales & Billing",
      items: [
        { to: "/quotations", label: "Quotations", icon: FileText },
        { to: "/invoices", label: "Non-GST Invoices", icon: ReceiptText },
        { to: "/payments", label: "Payment Collections", icon: Wallet },
        { to: "/expenses", label: "Expenses & Vouchers", icon: Receipt },
      ],
    },
    {
      label: "Organization & Cloud",
      items: [
        { to: "/files", label: "Document Storage", icon: Folder },
        { to: "/notifications", label: "Notifications", icon: Bell },
        { to: "/settings", label: "Business Settings", icon: Settings },
      ],
    },
  ],

  BRANCH_MANAGER: [
    {
      label: "Branch Operations",
      items: [
        { to: "/dashboard", label: "Branch Dashboard", icon: LayoutDashboard },
        { to: "/products", label: "Plant Stock & Catalog", icon: Package },
        { to: "/customers", label: "Branch Customers", icon: Users },
      ],
    },
    {
      label: "Sales & Dispatch",
      items: [
        { to: "/quotations", label: "Quotations", icon: FileText },
        { to: "/invoices", label: "Invoices", icon: ReceiptText },
        { to: "/payments", label: "Payment Receipts", icon: Wallet },
        { to: "/expenses", label: "Branch Daily Expenses", icon: Receipt },
      ],
    },
    {
      label: "Records",
      items: [
        { to: "/files", label: "Branch Documents", icon: Folder },
        { to: "/notifications", label: "Alerts", icon: Bell },
      ],
    },
  ],

  SALES_STAFF: [
    {
      label: "Sales Desk",
      items: [
        { to: "/dashboard", label: "My Activity", icon: LayoutDashboard },
        { to: "/products", label: "Plant Catalog & Pricing", icon: Package },
        { to: "/customers", label: "Customer Directory", icon: Users },
      ],
    },
    {
      label: "Orders & Billing",
      items: [
        { to: "/quotations", label: "Quotations", icon: FileText },
        { to: "/invoices", label: "Generate Invoice", icon: ReceiptText },
        { to: "/payments", label: "Record Payment", icon: Wallet },
      ],
    },
    {
      label: "Alerts",
      items: [
        { to: "/notifications", label: "Notifications", icon: Bell },
      ],
    },
  ],

  ACCOUNTANT: [
    {
      label: "Accounting Desk",
      items: [
        { to: "/dashboard", label: "Financial Overview", icon: LayoutDashboard },
        { to: "/reports", label: "Ledgers & Reports", icon: BarChart3, badge: "Ledgers" },
      ],
    },
    {
      label: "Billing & Collections",
      items: [
        { to: "/customers", label: "Customer Balances", icon: Users },
        { to: "/invoices", label: "Issued Invoices", icon: ReceiptText },
        { to: "/payments", label: "Payments & Receipts", icon: Wallet },
        { to: "/expenses", label: "Operational Expenses", icon: Receipt },
      ],
    },
    {
      label: "Records & Audits",
      items: [
        { to: "/files", label: "Tax & Financial Docs", icon: Folder },
        { to: "/notifications", label: "Alerts", icon: Bell },
      ],
    },
  ],

  INVENTORY_STAFF: [
    {
      label: "Inventory Desk",
      items: [
        { to: "/dashboard", label: "Stock Overview", icon: LayoutDashboard },
        { to: "/products", label: "Plant Catalog & Varieties", icon: Package },
        { to: "/branches", label: "Branch Stock Allocations", icon: Building2 },
      ],
    },
    {
      label: "Media & Storage",
      items: [
        { to: "/files", label: "Plant Photos & Labels", icon: Folder },
        { to: "/notifications", label: "Alerts", icon: Bell },
      ],
    },
  ],

  CUSTOMER: [
    {
      label: "Self-Service Portal",
      items: [
        { to: "/portal", label: "Customer Portal", icon: UserCheck, badge: "Live" },
      ],
    },
  ],
};

export function getNavigationForUser(user) {
  if (user?.isSuperAdmin) {
    return navigationByRole.SUPER_ADMIN;
  }
  const role = (user?.role || "OWNER").toUpperCase();
  return navigationByRole[role] || navigationByRole.OWNER;
}

