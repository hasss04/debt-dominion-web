import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const UserLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-secondary text-slate-800 dark:text-brand-light">
    <Header />
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default UserLayout;