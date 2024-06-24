import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Line, Radar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import {
  FaUserPlus,
  FaSearch,
  FaPlusCircle,
  FaFileInvoice,
  FaUsers,
} from "react-icons/fa";
import AddClientModal from "../../components/AddClientModal";
import Sidebar from "../../components/sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
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
  const [bestSellingProducts, setBestSellingProducts] = useState<
    ChartData<"radar">
  >({
    labels: [],
    datasets: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

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
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setError("Error fetching sales data");
      }
    };

    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios.get("/api/bestSellingProducts");
        const productData = response.data;

        setBestSellingProducts({
          labels: productData.map((product: { name: string }) => product.name),
          datasets: [
            {
              label: "Productos Más Vendidos",
              data: productData.map(
                (product: { count: number }) => product.count
              ),
              backgroundColor: "rgba(255, 205, 86, 0.2)", // Color de fondo amarillo
              borderColor: "rgba(255, 205, 86, 1)", // Color de borde amarillo
              borderWidth: 2,
              pointBackgroundColor: "rgba(255, 205, 86, 1)", // Color del punto amarillo
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching best selling products data:", error);
        setError("Error fetching best selling products data");
      }
    };

    fetchSalesData();
    fetchBestSellingProducts();

    const interval = setInterval(() => {
      fetchSalesData();
      fetchBestSellingProducts();
    }, 86400000); // Actualiza una vez al día (24 horas)

    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "addClient":
        setShowAddClientModal(true);
        break;
      case "searchPrice":
        console.log("Buscar Precio");
        break;
      case "createProduct":
        console.log("Crear Producto");
        break;
      case "createInvoice":
        console.log("Crear Factura");
        break;
      case "manageUsers":
        router.push("/users"); // Navegar a la página de usuarios
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white">
        <Sidebar />
        <div className="flex-1">
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Dashboard de Ventas</h1>
            {/* Subbarra de navegación */}
            <div className="bg-gray-800 text-black p-4 shadow-md mb-4 flex justify-around">
              <button
                onClick={() => handleQuickAction("addClient")}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300 text-white"
                title="Agregar Cliente"
              >
                <FaUserPlus className="mr-2" />
              </button>
              <button
                onClick={() => handleQuickAction("searchPrice")}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300 text-white"
                title="Buscar Precio"
              >
                <FaSearch className="mr-2" />
              </button>
              <button
                onClick={() => handleQuickAction("createProduct")}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300 text-white"
                title="Crear Producto"
              >
                <FaPlusCircle className="mr-2" />
              </button>
              <button
                onClick={() => handleQuickAction("createInvoice")}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300 text-white"
                title="Crear Factura"
              >
                <FaFileInvoice className="mr-2" />
              </button>
              <button
                onClick={() => handleQuickAction("manageUsers")}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition duration-300 text-white"
                title="Gestionar Usuarios"
              >
                <FaUsers className="mr-2" />
              </button>
            </div>

            <div className="flex space-x-4 flex-col md:flex-row">
              <div className="bg-black p-4 rounded shadow-md text-black flex-1">
                <h2 className="text-xl mb-2">Ventas</h2>
                <div className="h-64">
                  <Line
                    data={salesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                        },
                        y: {
                          grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          labels: {
                            color: "white",
                          },
                        },
                        tooltip: {
                          enabled: true,
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          titleColor: "white",
                          bodyColor: "white",
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="bg-black p-4 rounded shadow-md text-black flex-1">
                <h2 className="text-xl mb-2">Productos Más Vendidos</h2>
                <div className="h-64">
                  <Radar
                    data={bestSellingProducts}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                          pointLabels: {
                            color: "white",
                          },
                          angleLines: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          labels: {
                            color: "white",
                          },
                        },
                        tooltip: {
                          enabled: true,
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          titleColor: "white",
                          bodyColor: "white",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {showAddClientModal && (
            <AddClientModal onClose={() => setShowAddClientModal(false)} />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
