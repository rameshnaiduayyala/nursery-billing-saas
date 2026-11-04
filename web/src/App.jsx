import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin/organizations" element={<AdminOrganizationsPage />} />
          <Route
            path="reports"
            element={
              <PlaceholderPage
                title="Reports & Financial Statements"
                description="Review sales, customer ledgers, and branch performance."
              />
            }
          />
          <Route
            path="portal"
            element={
              <PlaceholderPage
                title="Customer Portal"
                description="Customer-facing quotations, invoices, payments and receipts."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
