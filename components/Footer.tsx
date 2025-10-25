import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* --- Logo and Tagline --- */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Debt & Dominion Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-black font-serif text-slate-900 dark:text-brand-light">
                Debt & Dominion
              </span>
            </Link>
            <p className="text-slate-600 dark:text-brand-medium text-sm">
              Navigating the currents of finance, power, and geopolitics.
            </p>
          </div>

          {/* --- Quick Links --- */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-600 dark:text-brand-medium hover:text-brand-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 dark:text-brand-medium hover:text-brand-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              {user && user.role === 'admin' && (
                <li>
                  <Link
                    to="/create"
                    className="text-slate-600 dark:text-brand-medium hover:text-brand-primary transition-colors"
                  >
                    Create Post
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* --- Legal --- */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-600 dark:text-brand-medium hover:text-brand-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 dark:text-brand-medium hover:text-brand-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* --- Follow Us --- */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Follow Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-brand-medium hover:text-brand-primary transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-brand-medium hover:text-brand-primary transition-colors"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Footer Bottom --- */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-brand-medium">
          &copy; {new Date().getFullYear()} Debt & Dominion. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;