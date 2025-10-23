import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  SearchIcon,
  SunIcon,
  MoonIcon,
  XIcon,
  PlusIcon,
  MenuIcon,
} from "./icons";
import { useAuth } from "./AuthContext";
import UserNav from "./UserNav";

const Header: React.FC = () => {
  const { user, loading, theme, setTheme } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setIsMobileMenuOpen(false), [location]);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const userRole = user?.role?.toLowerCase();

  return (
    <header className="sticky top-0 z-50 bg-brand-light/80 dark:bg-brand-secondary/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {!isSearchOpen ? (
            <>
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Debt & Dominion Logo"
                  className="h-8 w-8 object-contain"
                />
                <span className="hidden sm:block text-2xl font-black font-serif text-slate-900 dark:text-brand-light tracking-tight">
                  Debt & Dominion
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-3">
                {user && userRole === "admin" && (
                  <button
                    onClick={() => navigate("/create")}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-brand-primary text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Create Post</span>
                  </button>
                )}

                {/* Search */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center justify-center p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label="Open search"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={handleThemeToggle}
                  className="flex items-center justify-center p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>

                {/* User Profile Button (fixed alignment) */}
                {!loading && (
                  <div className="flex items-center">
                    {user ? (
                      <div className="flex items-center h-full">
                        <UserNav user={user} />
                      </div>
                    ) : (
                      <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-bold bg-brand-primary text-white rounded-md hover:bg-orange-600 transition-colors"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <XIcon className="h-6 w-6" />
                  ) : (
                    <MenuIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </>
          ) : (
            // Search Mode
            <div className="w-full flex items-center">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full flex items-center gap-2"
              >
                <SearchIcon className="h-5 w-5 text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles and press Enter"
                  autoFocus
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label="Close search"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;