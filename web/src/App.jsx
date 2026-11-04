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
import { LoginPage, RegisterPage } from "./pages/AuthPages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route
            path="branches"
            element={
              <PlaceholderPage
                title="Branches"
                description="Manage nursery locations, addresses and branch access."
              />
            }
          />
          <Route
            path="reports"
            element={
              <PlaceholderPage
                title="Reports"
                description="Review sales, outstanding balances and branch performance."
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Settings"
                description="Configure business profile, numbering, users and permissions."
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
          <Route
            path="admin/organizations"
            element={
              <PlaceholderPage
                title="Organization Approvals"
                description="Review nursery registrations and manage platform tenants."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
