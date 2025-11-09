import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Mail,
  Settings,
  Database,
  UserCog,
  X,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/ReachIQ/dashboard/overview", icon: <Home size={18} /> },
    { name: "Users", path: "/ReachIQ/dashboard/users", icon: <UserCog size={18} /> },
    { name: "SMTP Configuration", path: "/ReachIQ/dashboard/smtp", icon: <Settings size={18} /> },
    { name: "Email Campaigns", path: "/ReachIQ/dashboard/campaigns", icon: <Mail size={18} /> },
    { name: "Leads Management", path: "/ReachIQ/dashboard/leads", icon: <Database size={18} /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed md:static z-20 h-full w-64 transform transition-transform duration-300 ease-in-out bg-gray-900 text-white shadow-xl",
          {
            "-translate-x-full md:translate-x-0": !isOpen,
            "translate-x-0": isOpen,
          }
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">ReachIQ</h2>
          <button
            className="md:hidden p-2 hover:bg-gray-800 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-5">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-5 py-3 rounded-md transition-colors duration-200",
                location.pathname === item.path
                  ? "bg-gray-800 text-white font-medium"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
