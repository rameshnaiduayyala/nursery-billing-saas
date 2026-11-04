import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoleBasedLayout from "./components/layout/RoleBasedLayout";

// Module Pages
import { LoginPage, RegisterPage } from "./modules/auth/AuthPages";
import DashboardPage from "./modules/dashboard/DashboardPage";
import BranchesPage from "./modules/branches/BranchesPage";
import CustomersPage from "./modules/customers/CustomersPage";
import ProductsPage from "./modules/products/ProductsPage";
import QuotationsPage from "./modules/quotations/QuotationsPage";
import InvoicesPage from "./modules/invoices/InvoicesPage";
import CreateInvoicePage from "./modules/invoices/CreateInvoicePage";
import PaymentsPage from "./modules/payments/PaymentsPage";
import ExpensesPage from "./modules/expenses/ExpensesPage";
import SettingsPage from "./modules/settings/SettingsPage";
import AdminOrganizationsPage from "./modules/admin/AdminOrganizationsPage";
import EmployeesPage from "./modules/employees/EmployeesPage";
import RolesPage from "./modules/roles/RolesPage";
import ChargesPage from "./modules/charges/ChargesPage";
import ReportsPage from "./modules/reports/ReportsPage";
import NotificationsPage from "./modules/notifications/NotificationsPage";
import FilesPage from "./modules/files/FilesPage";
import CustomerPortalPage from "./modules/portal/CustomerPortalPage";

/**
 * Route guard that redirects unauthenticated users to /
 */
function ProtectedLayout() {
  const user = localStorage.getItem("nursery_user");
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <RoleBasedLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root URL renders Login page directly */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected SaaS Workspace routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/create" element={<CreateInvoicePage />} />
          <Route path="/charges" element={<ChargesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/portal" element={<CustomerPortalPage />} />
          <Route path="/admin/organizations" element={<AdminOrganizationsPage />} />
        </Route>

        {/* Fallback unknown paths to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
