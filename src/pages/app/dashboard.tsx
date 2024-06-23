import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StockItem {
  name: string;
  quantity: number;
}

const Dashboard = () => {
  const router = useRouter();
  const [salesData, setSalesData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });
  const [stockData, setStockData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("/api/sales");
        const { labels, data } = response.data;

        setSalesData({
          labels,
          datasets: [
            {
              label: "Ventas",
              data,
              borderColor: "rgba(138, 43, 226, 1)", // Violeta
              backgroundColor: "rgba(138, 43, 226, 0.2)", // Violeta con transparencia
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    const fetchStockData = async () => {
      try {
        const response = await axios.get("/api/stock");
        const stockData: StockItem[] = response.data;

        setStockData({
          labels: stockData.map((item: StockItem) => item.name),
          datasets: [
            {
              label: "Stock Bajo",
              data: stockData.map((item: StockItem) => item.quantity),
              backgroundColor: "rgba(138, 43, 226, 0.2)", // Violeta con transparencia
              borderColor: "rgba(138, 43, 226, 1)", // Violeta
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchSalesData();
    fetchStockData();

    const interval = setInterval(() => {
      fetchSalesData();
      fetchStockData();
    }, 86400000); // Actualiza una vez al día (24 horas)

    return () => clearInterval(interval);
  }, []);

  const handleStockClick = () => {
    router.push("/app/stock");
  };

  const handleFacturacionClick = () => {
    router.push("/app/facturacion");
  };

  const handleProductosClick = () => {
    router.push("/app/productos");
  };

  const handleClientesClick = () => {
    router.push("/app/clientes");
  };

  const handlePOSClick = () => {
    router.push("/app/pos");
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
          className="px-4 py-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 w-full text-left"
        >
          Facturación
        </button>
        <button
          onClick={handleProductosClick}
          className="px-4 py-2 mb-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 w-full text-left"
        >
          Productos
        </button>
        <button
          onClick={handleClientesClick}
          className="px-4 py-2 mb-4 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-300 w-full text-left"
        >
          Clientes
        </button>
        <button
          onClick={handlePOSClick}
          className="px-4 py-2 mb-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 w-full text-left"
        >
          Sistema POS
        </button>
      </div>
      <div className="w-3/4 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard de Ventas</h1>
        <div className="flex space-x-4 flex-col md:flex-row">
          <div className="bg-black p-4 rounded shadow-md text-white flex-1">
            <h2 className="text-xl mb-2">Ventas</h2>
            <div className="h-64">
              <Line data={salesData} options={{ responsive: true }} />
            </div>
          </div>
          <div className="bg-black p-4 rounded shadow-md text-white flex-1">
            <h2 className="text-xl mb-2">Stock Bajo</h2>
            <div className="h-64">
              <Bar data={stockData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
