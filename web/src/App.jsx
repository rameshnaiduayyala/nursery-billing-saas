import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import QuotationsPage from "./pages/QuotationsPage";
import PaymentsPage from "./pages/PaymentsPage";
import BranchesPage from "./pages/BranchesPage";
import ExpensesPage from "./pages/ExpensesPage";
import SettingsPage from "./pages/SettingsPage";
import AdminOrganizationsPage from "./pages/AdminOrganizationsPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";

/**
 * Route guard that redirects unauthenticated users to /
 */
function ProtectedLayout() {
  const user = localStorage.getItem("nursery_user");
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <AppLayout />;
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
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin/organizations" element={<AdminOrganizationsPage />} />
          <Route
            path="/reports"
            element={
              <PlaceholderPage
                title="Reports & Financial Statements"
                description="Review sales, customer ledgers, and branch performance."
              />
            }
          />
          <Route
            path="/portal"
            element={
              <PlaceholderPage
                title="Customer Portal"
                description="Customer-facing quotations, invoices, payments and receipts."
              />
            }
          />
        </Route>

        {/* Fallback unknown paths to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
