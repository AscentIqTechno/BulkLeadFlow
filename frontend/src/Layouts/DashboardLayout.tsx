import React, { useState } from "react";
import Sidebar from "@/components/Sidbar";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // Optional: Map paths to readable titles
  const pageTitles: Record<string, string> = {
    "/ReachIQ/dashboard": "Dashboard Overview",
    "/ReachIQ/dashboard/users": "Manage Users",
    "/ReachIQ/dashboard/smtp": "SMTP Configuration",
    "/ReachIQ/dashboard/campaigns": "Email Campaigns",
    "/ReachIQ/dashboard/leads": "Leads Management",
  };

  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          {/* Sidebar Toggle (for mobile) */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={22} />
          </button>

          {/* Page Title */}
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

          {/* Right Side (User Profile / Actions) */}
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="w-9 h-9 rounded-full border"
            />
            <span className="hidden md:inline text-gray-700 font-medium">
              Admin
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};



export default DashboardLayout;
