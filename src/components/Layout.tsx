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
      </footer>
    </div>
  );
};

export default DashboardLayout;
