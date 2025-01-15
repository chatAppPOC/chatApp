// Layout.tsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 hidden md:flex flex-col">
        <div className="flex flex-col items-center">
          <img
            src="/atvilogo-wht.png"
            alt="Activision Logo"
            className="h-30 w-auto opacity-80"
          />
          <p className="text-center text-blue-100 ">{t("welcome")}</p>
        </div>
        {/* Navigation Links */}
        <nav className="mt-8">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                Chat Page
              </Link>
            </li>
            <li>
              <Link
                to="/qa-content-grid"
                className="block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                Q/A Content Grid
              </Link>
            </li>

            <li>
              <Link
                to="/case-deatils-grid"
                className="block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                Case Deatils Grid
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
