import React, { ReactNode } from "react";
import Sidebar from "./sidebar"; // Asegúrate de que la ruta y el nombre del archivo sean correctos

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
