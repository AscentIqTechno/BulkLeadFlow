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
} from "lucide-react";
import clsx from "clsx";
import { useSelector } from "react-redux";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const roles = useSelector((state: any) => state.auth?.user.roles || []);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  // Collapsible States
  const [openEmail, setOpenEmail] = useState(true);
  const [openSms, setOpenSms] = useState(false);

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
          "fixed md:static z-20 h-full w-64 transform transition-transform duration-300 ease-in-out bg-gray-900 text-white shadow-xl",
          { "-translate-x-full md:translate-x-0": !isOpen, "translate-x-0": isOpen }
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">ReachIQ</h2>
          <button className="md:hidden p-2 hover:bg-gray-800 rounded-md" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 px-2">
          {/* Dashboard */}
          <Link
            to="/ReachIQ/dashboard/overview"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-md",
              location.pathname.includes("/overview")
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-800"
            )}
            onClick={() => setIsOpen(false)}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Link>

          {/* ADMIN ONLY */}
          {isAdmin && (
            <>
              <Link
                to="/ReachIQ/dashboard/users"
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-md",
                  location.pathname.includes("/users")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                )}
              >
                <UserCog size={18} />
                <span>User Management</span>
              </Link>
            </>
          )}

          {/* Email Collapsible Section */}
          <div className="mt-3">
            <button
              className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 rounded-md"
              onClick={() => setOpenEmail(!openEmail)}
            >
              <span className="flex items-center gap-3">
                <Mail size={18} /> Email Operations
              </span>
              {openEmail ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {openEmail && (
              <div className="ml-8 mt-2 space-y-2">
                <Link
                  to="/ReachIQ/dashboard/email_directory"
                  className={clsx(
                    "block text-sm px-3 py-2 rounded-md",
                    location.pathname.includes("/email_directory")
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  )}
                >
                  Email Directory
                </Link>

                <Link
                  to="/ReachIQ/dashboard/smtp"
                  className={clsx(
                    "block text-sm px-3 py-2 rounded-md",
                    location.pathname.includes("/smtp")
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  )}
                >
                  SMTP Configuration
                </Link>

                <Link
                  to="/ReachIQ/dashboard/campaigns"
                  className={clsx(
                    "block text-sm px-3 py-2 rounded-md",
                    location.pathname.includes("/campaigns")
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  )}
                >
                  Email Campaigns
                </Link>
              </div>
            )}
          </div>

          {/* SMS Collapsible Section */}
          <div className="mt-3">
            <button
              className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 rounded-md"
              onClick={() => setOpenSms(!openSms)}
            >
              <span className="flex items-center gap-3">
                <Phone size={18} /> SMS Operations
              </span>
              {openSms ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {openSms && (
              <div className="ml-8 mt-2 space-y-2">
                <Link
                  to="/ReachIQ/dashboard/sms_directory"
                  className={clsx(
                    "block text-sm px-3 py-2 rounded-md",
                    location.pathname.includes("/sms_directory")
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  )}
                >
                  SMS Number Directory
                </Link>

                <Link
                  to="/ReachIQ/dashboard/sms_config"
                  className={clsx(
                    "block text-sm px-3 py-2 rounded-md",
                    location.pathname.includes("/sms_config")
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  )}
                >
                  SMS Gateway Configuration
                </Link>

                <Link
                  to="/ReachIQ/dashboard/sms_campaigns"
                  className={clsx(
                    "block text-sm px-3 py-2 rounded-md",
                    location.pathname.includes("/sms_campaigns")
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  )}
                >
                  SMS Campaigns
                </Link>
              </div>
            )}
          </div>

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
