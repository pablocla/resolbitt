import React, { useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBox,
  faFileInvoiceDollar,
  faCubes,
  faUsers,
  faCashRegister,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../hooks/useTheme";

interface SidebarProps {
  onQuickAction?: (action: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onQuickAction }) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: faBox, label: "Stock", path: "/app/stock" },
    { icon: faFileInvoiceDollar, label: "Facturación", path: "/app/facturacion" },
    { icon: faCubes, label: "Productos", path: "/app/productos" },
    { icon: faUsers, label: "Clientes", path: "/app/clientes" },
    { icon: faCashRegister, label: "Sistema POS", path: "/app/pos" },
  ];

  return (
    <div
      className={`h-screen p-4 flex flex-col items-start transition-width duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } fixed z-50 bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-r-lg`}
      style={{
        top: 0, // Ajustado para que esté fijado en la parte superior
        left: 0, // Ajustado para que esté al borde izquierdo
        height: '100vh', // Ocupa toda la altura de la ventana
      }}
    >
      <button onClick={toggleSidebar} className="mb-4 text-black dark:text-white">
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={() => router.push(item.path)}
          className="relative flex items-center w-full p-2 my-2 transition duration-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={item.icon} size="lg" />
          {!isCollapsed && <span className="ml-4">{item.label}</span>}
        </button>
      ))}
      <div className="mt-auto">
        <button onClick={toggleTheme} className="my-2 text-black dark:text-white">
          <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} size="lg" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
