import React, { useState } from "react";
import Sidebar from "@/components/Sidbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useLogoutUserMutation } from "@/redux/api/authApi";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth?.user || []);

  const [logoutUser] = useLogoutUserMutation();

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();

      localStorage.removeItem("reachiq_user");
      localStorage.removeItem("token");

      navigate("/ReachIQ");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 🔥 Convert URL to a readable page title dynamically
  const getPageTitle = (path: string) => {
    // SMS pages
    if (path.includes("/sms_directory")) return "SMS Number Directory";
    if (path.includes("/sms_config")) return "SMS Gateway Configuration";
    if (path.includes("/sms_campaigns")) return "SMS Campaigns";

    // Email pages
    if (path.includes("/smtp")) return "SMTP Configuration";
    if (path.includes("/users")) return "Manage Users";
    if (path.includes("/campaigns")) return "Email Campaigns";
    if (path.includes("/leads")) return "Leads Management";
    if (path.includes("/email_directory")) return "Email Directory";

    if (path === "/ReachIQ/dashboard") return "Dashboard Overview";

    return "Dashboard";
  };

  // Current dynamic title
  const title = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          {/* Sidebar Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={22} />
          </button>

          {/* Page Title */}
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="w-9 h-9 rounded-full border"
            />
            <span className="hidden md:inline text-gray-700 font-medium">
              {user?.username}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
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
