import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Mail,
  Settings,
  UserCog,
  Phone,
  BookUser,
  ChevronDown,
  ChevronRight,
  X,
  MessageSquare,
  Users,
  Smartphone,
  CreditCard,
  FileText,
  Wallet
} from "lucide-react";
import clsx from "clsx";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const roles = useSelector((state: any) => state.auth?.user.roles || []);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  const [openEmail, setOpenEmail] = useState(true);
  const [openSms, setOpenSms] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={clsx(
          "fixed md:static z-20 h-full w-64 transform transition-transform duration-300 ease-in-out bg-gray-900 text-white shadow-xl border-r border-gray-700",
          { "-translate-x-full md:translate-x-0": !isOpen, "translate-x-0": isOpen }
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-xl font-bold">
            Lead<span className="text-yellow-500">Reach</span>
            <span className="text-white">Xpro</span>
          </h2>
          <button 
            className="md:hidden p-2 hover:bg-gray-700 rounded-md transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            <X size={20} className="text-gray-300" />
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">

          {/* Dashboard */}
          <Link
            to="/dashboard/overview"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              location.pathname.includes("/overview")
                ? "bg-yellow-500 text-gray-900 font-semibold shadow-md"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
            onClick={() => setIsOpen(false)}
          >
            <Home size={18} />
            <span>Dashboard Overview</span>
          </Link>

          {/* ❌ REMOVED DELIVERY ANALYTICS */}

          {/* Billing & Payments */}
          <Link
            to="/dashboard/payment_billing"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              location.pathname.includes("/payment_billing")
                ? "bg-yellow-500 text-gray-900 font-semibold shadow-md"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
            onClick={() => setIsOpen(false)}
          >
            <CreditCard size={18} />
            <span>Billing & Payments</span>
          </Link>

          {/* ADMIN ONLY – USER MANAGEMENT */}
          {isAdmin && (
            <Link
              to="/dashboard/users"
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                location.pathname.includes("/users")
                  ? "bg-yellow-500 text-gray-900 font-semibold shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <UserCog size={18} />
              <span>User Management</span>
            </Link>
          )}

          {/* Email Section (Everyone) */}
          <div className="mt-3">
            <button
              className="flex items-center justify-between w-full px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-gray-800 group"
              onClick={() => setOpenEmail(!openEmail)}
            >
              <span className="flex items-center gap-3 text-gray-300 group-hover:text-white font-medium">
                <Mail size={18} /> Email Operations
              </span>
              {openEmail ? 
                <ChevronDown size={16} className="text-gray-400 group-hover:text-white" /> : 
                <ChevronRight size={16} className="text-gray-400 group-hover:text-white" />
              }
            </button>

            {openEmail && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-700 pl-3">
                <Link
                  to="/dashboard/email_directory"
                  className={clsx(
                    "flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-all duration-200",
                    location.pathname.includes("/email_directory")
                      ? "bg-yellow-500 text-gray-900 font-medium shadow-sm"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <BookUser size={14} />
                  Email Directory
                </Link>

                <Link
                  to="/dashboard/smtp"
                  className={clsx(
                    "flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-all duration-200",
                    location.pathname.includes("/smtp")
                      ? "bg-yellow-500 text-gray-900 font-medium shadow-sm"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Settings size={14} />
                  SMTP Configuration
                </Link>

                <Link
                  to="/dashboard/campaigns"
                  className={clsx(
                    "flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-all duration-200",
                    location.pathname.includes("/campaigns")
                      ? "bg-yellow-500 text-gray-900 font-medium shadow-sm"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Mail size={14} />
                  Email Campaigns
                </Link>
              </div>
            )}
          </div>

          {/* SMS Section */}
          <div className="mt-3">
            <button
              className="flex items-center justify-between w-full px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-gray-800 group"
              onClick={() => setOpenSms(!openSms)}
            >
              <span className="flex items-center gap-3 text-gray-300 group-hover:text-white font-medium">
                <Smartphone size={18} /> SMS Operations
              </span>
              {openSms ? 
                <ChevronDown size={16} className="text-gray-400 group-hover:text-white" /> : 
                <ChevronRight size={16} className="text-gray-400 group-hover:text-white" />
              }
            </button>

            {openSms && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-700 pl-3">
                <Link
                  to="/dashboard/sms_directory"
                  className={clsx(
                    "flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-all duration-200",
                    location.pathname.includes("/sms_directory")
                      ? "bg-yellow-500 text-gray-900 font-medium shadow-sm"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Users size={14} />
                  SMS Number Directory
                </Link>

                <Link
                  to="/dashboard/sms_config"
                  className={clsx(
                    "flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-all duration-200",
                    location.pathname.includes("/sms_config")
                      ? "bg-yellow-500 text-gray-900 font-medium shadow-sm"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Settings size={14} />
                  Android Gateway Setup
                </Link>

                <Link
                  to="/dashboard/sms_campaigns"
                  className={clsx(
                    "flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-all duration-200",
                    location.pathname.includes("/sms_campaigns")
                      ? "bg-yellow-500 text-gray-900 font-medium shadow-sm"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <MessageSquare size={14} />
                  SMS Campaigns
                </Link>
              </div>
            )}
          </div>

          {/* SETTINGS — ADMIN ONLY */}
          {isAdmin && (
            <div className="mt-3">
              <button
                className="flex items-center justify-between w-full px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-gray-800 group"
                onClick={() => setOpenSettings(!openSettings)}
              >
                <span className="flex items-center gap-3 text-gray-300 group-hover:text-white font-medium">
                  <Settings size={18} /> Settings
                </span>
                {openSettings ? 
                  <ChevronDown size={16} className="text-gray-400 group-hover:text-white" /> : 
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-white" />
                }
              </button>

              {openSettings && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-700 pl-3">
                  <Link
                    to="/dashboard/settings/plan_management"
                    className={clsx(
                      "flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-all duration-200",
                      location.pathname.includes("/plan_management")
                        ? "bg-yellow-500 text-gray-900 font-medium shadow-sm"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText size={14} />
                    Plan Management
                  </Link>

                  <Link
                    to="/dashboard/settings/razorpay_config"
                    className={clsx(
                      "flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-all duration-200",
                      location.pathname.includes("/razorpay_config")
                        ? "bg-yellow-500 text-gray-900 font-medium shadow-sm"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Wallet size={14} />
                    Razorpay Configuration
                  </Link>
                </div>
              )}
            </div>
          )}

        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            Personal SMTP & Android Gateway
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
