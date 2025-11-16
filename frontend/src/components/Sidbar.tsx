import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Mail,
  Settings,
  Database,
  UserCog,
  Phone,
  BookUser,
  X,
} from "lucide-react";
import clsx from "clsx";
  import { useSelector } from "react-redux";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {


const roles = useSelector((state: any) => state.auth?.user.roles|| []);
const isAdmin = Array.isArray(roles) && roles.includes("admin");


  const menuItems = [
    { name: "Dashboard", path: "/ReachIQ/dashboard/overview", icon: <Home size={18} /> },

    // ADMIN ONLY SECTION
    ...(isAdmin
      ? [
          { name: "Users", path: "/ReachIQ/dashboard/users", icon: <UserCog size={18} /> },
          // { name: "Number Directory", path: "/ReachIQ/dashboard/number-directory", icon: <Phone size={18} /> },
        ]
        : []),
        
        // Common Menus For All Roles
    { name: "Email Directory", path: "/ReachIQ/dashboard/email_directory", icon: <BookUser size={18} /> },
    { name: "SMTP Configuration", path: "/ReachIQ/dashboard/smtp", icon: <Settings size={18} /> },
    { name: "Email Campaigns", path: "/ReachIQ/dashboard/campaigns", icon: <Mail size={18} /> },


  
  ];

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
