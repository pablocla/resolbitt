import React from "react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();

  const handleStockClick = () => {
    router.push("/app/stock");
  };

  const handleFacturacionClick = () => {
    router.push("/app/facturacion");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white flex">
      <div className="w-1/4 p-4 bg-gray-800 flex flex-col items-start">
        <button
          onClick={handleStockClick}
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 w-full text-left"
        >
          Stock
        </button>
        <button
          onClick={handleFacturacionClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 w-full text-left"
        >
          Facturación
        </button>
      </div>
      <div className="w-3/4 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard de Ventas</h1>
        {/* Esto es una version 100% de testing con fines a */}
        <div className="bg-white p-6 rounded shadow-md text-black">
          <p>Esta app esta echa con fines educativos.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
