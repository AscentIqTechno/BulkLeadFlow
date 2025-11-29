import React, { useState } from "react";
import Sidebar from "@/components/Sidbar";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, User, ChevronDown, CheckCircle } from "lucide-react";
import { authApi } from "@/redux/api/authApi";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth?.user || []);

  const [logoutUser] = authApi.useLogoutUserMutation();

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser(null);

      localStorage.removeItem("reachiq_user");
      localStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Convert URL to a readable page title dynamically
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

    // ⭐ Billing & Settings (Missing earlier — now added)
    if (path.includes("/payment_billing")) return "Billing & Payments";
    if (path.includes("/plan_management")) return "Plan Management";
    if (path.includes("/razorpay_config")) return "Razorpay Configuration";
    if (path.includes("/user_profile")) return "User Profile"

    // Dashboard overview
    if (path === "/dashboard" || path.includes("/overview"))
      return "Dashboard Overview";

    return "Dashboard";
  };


  // Current dynamic title
  const title = getPageTitle(location.pathname);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4 border-b border-gray-200">
          {/* Sidebar Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-200 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={22} className="text-gray-700" />
          </button>

          {/* Page Title */}
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* User Dropdown */}
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user?.photo?.url ? (
                  <img
                    src={user.photo.url}
                    alt={user?.username || "User"}
                    className="w-9 h-9 rounded-full border-2 border-yellow-500 object-cover"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full border-2 border-yellow-500 bg-gray-200 flex items-center justify-center text-gray-800 font-semibold uppercase"
                  >
                    {user?.username?.charAt(0) || "U"}
                  </div>
                )}

                <div className="hidden md:flex flex-col items-start">
                  <span className="text-gray-800 font-medium text-sm flex items-center gap-1">
                    {user?.username}

                    {/* Premium Badge */}
                    {user?.currentPlan && user?.subscriptionStatus === "active" && (
                      <CheckCircle
                        size={14}
                        className="text-blue-500"

                      />
                    )}
                  </span>

                  <span className="text-gray-500 text-xs">
                    {user?.email}

                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* Profile Option */}
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      // Navigate to profile page or open profile modal
                      console.log("Navigate to profile");
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} className="text-gray-500" />
                    <Link to="user_profile"><span>Profile</span></Link>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-1"></div>

                  {/* Logout Option */}
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <span className="font-semibold text-gray-800">
                Lead<span className="text-yellow-500">Reach</span>Xpro
              </span>
              <span>•</span>
              <span>Bulk Email & SMS Platform</span>
            </div>
            <div className="flex gap-4">
              <span>Personal SMTP & Android Gateway</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;