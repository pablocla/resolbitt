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
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: faBox, label: "Stock", path: "/app/stock" },
    {
      icon: faFileInvoiceDollar,
      label: "Facturación",
      path: "/app/facturacion",
    },
    { icon: faCubes, label: "Productos", path: "/app/productos" },
    { icon: faUsers, label: "Clientes", path: "/app/clientes" },
    { icon: faCashRegister, label: "Sistema POS", path: "/app/pos" },
  ];

  return (
    <div
      className={`h-screen bg-gray-800 p-4 flex flex-col items-start transition-width duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } fixed md:relative z-50`}
    >
      <button onClick={toggleSidebar} className="mb-4 text-white">
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={() => router.push(item.path)}
          className="relative flex items-center w-full p-2 my-2 text-white hover:bg-gray-700 transition duration-300 rounded"
        >
          <FontAwesomeIcon icon={item.icon} size="lg" />
          {!isCollapsed && <span className="ml-4">{item.label}</span>}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
