import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { EnterpriseSidebar, EnterpriseHeader } from "../navigation";

export default function RoleBasedLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("nursery_user") || "{}");
    } catch {
      return {};
    }
  })();

  return (
    <div className="min-h-screen bg-[#F5F7F1] text-[#1F2937] md:flex">
      {/* Enterprise Reusable Sidebar with role-wise nav items */}
      <EnterpriseSidebar
        user={user}
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Workspace */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Enterprise Reusable Header */}
        <EnterpriseHeader
          user={user}
          onOpenMobile={() => setMobileOpen(true)}
        />

        {/* Content Outlet */}
        <main className="flex-1 p-4 md:p-8 bg-[#F5F7F1]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
