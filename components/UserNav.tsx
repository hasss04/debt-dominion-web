import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../services/types";
import { useAuth } from "./AuthContext";
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  ShieldCheckIcon,
} from "./icons";

interface UserNavProps {
  user: User;
}

const UserNav: React.FC<UserNavProps> = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Normalize role to lowercase for safe comparison
  const normalizedRole = user.role?.toLowerCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar / Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-brand-primary transition"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-slate-500" />
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-2 animate-fade-in z-50">
          {/* User Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.displayName}
                {normalizedRole === "admin" && (
                  <span className="ml-1 text-orange-500 font-semibold">
                    (Admin)
                  </span>
                )}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Admin-only Dashboard */}
            {normalizedRole === "admin" && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            {/* Profile */}
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <SettingsIcon className="w-4 h-4" />
              Profile Settings
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <LogOutIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNav;