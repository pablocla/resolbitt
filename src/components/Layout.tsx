import React, { ReactNode } from "react";
import Navbar from "./Navbar"; // Importa el componente Navbar

interface LayoutProps {
  children: ReactNode;
  onQuickAction: (action: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onQuickAction }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-gray-800 shadow">
        <Navbar onQuickAction={onQuickAction} />{" "}
        {/* Incluye el cmponente Navbar con la prop onQuickAction */}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="w-full bg-gray-800 shadow mt-8 py-4">
        <div className="max-w-7xl mx-auto text-center text-gray-300">
          &copy; 2024 ResolbIT. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
