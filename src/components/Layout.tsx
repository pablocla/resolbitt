<<<<<<< HEAD
import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";
import { useTheme } from "../hooks/useTheme";

interface LayoutProps {
  children: ReactNode;
  onQuickAction?: (action: string) => void;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children, onQuickAction }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <header className="w-full bg-gray-800 shadow">
        <Navbar onQuickAction={onQuickAction} />
      </header>
      <div className="flex flex-1">
        <Sidebar onQuickAction={onQuickAction} />
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
      <footer className="footer">
        &copy; 2024 ResolbIT. Todos los derechos reservados.
=======
// components/Layout.tsx
import React from "react";
import Link from "next/link";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">ResolbIT</h1>
          <nav className="space-x-4">
            <Link href="/quote" legacyBehavior>
              <a className="text-gray-700 hover:text-gray-900">
                Cotizar Software Personalizado
              </a>
            </Link>
            <Link href="/ecommerce" legacyBehavior>
              <a className="text-gray-700 hover:text-gray-900">E-commerce</a>
            </Link>
            <Link href="/cloud-services" legacyBehavior>
              <a className="text-gray-700 hover:text-gray-900">
                Cloud Services
              </a>
            </Link>
            <Link href="/blockchain" legacyBehavior>
              <a className="text-gray-700 hover:text-gray-900">Blockchain</a>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="w-full bg-white shadow mt-8 py-4">
        <div className="max-w-7xl mx-auto text-center text-gray-700">
          &copy; 2024 ResolbIT. Todos los derechos reservados.
        </div>
>>>>>>> 6b7626470a55dafe12231f2164104a1a31fd70de
      </footer>
    </div>
  );
};

<<<<<<< HEAD
export default DashboardLayout;
=======
export default Layout;
>>>>>>> 6b7626470a55dafe12231f2164104a1a31fd70de
