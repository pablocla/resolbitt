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
      </footer>
    </div>
  );
};

export default Layout;
