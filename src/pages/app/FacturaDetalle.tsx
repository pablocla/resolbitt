import React, { useEffect, useState } from "react";
import axios from "axios";
import { Radar } from "react-chartjs-2";

interface Product {
  name: string;
  count: number;
}

interface BestSellingProductsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    pointBackgroundColor: string;
  }[];
}

const BestSellingProducts: React.FC = () => {
  const [bestSellingProducts, setBestSellingProducts] =
    useState<BestSellingProductsData>({
      labels: [],
      datasets: [
        {
          label: "Productos Más Vendidos",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(255, 99, 132, 1)",
        },
      ],
    });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const source = axios.CancelToken.source(); // Crear un token de cancelación

    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios.get("/api/bestSellingProducts", {
          cancelToken: source.token, // Vincular el token a la solicitud
        });
        const productData: Product[] = response.data;

        setBestSellingProducts({
          labels: productData.map((product) => product.name),
          datasets: [
            {
              label: "Productos Más Vendidos",
              data: productData.map((product) => product.count),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(255, 99, 132, 1)",
            },
          ],
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.error("Error fetching best selling products data:", error);
          setError("Error fetching best selling products data");
        }
      }
    };

    fetchBestSellingProducts();

    return () => {
      source.cancel("Component unmounted"); // Cancelar la solicitud si el componente se desmonta
    };
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="h-64">
      <Radar
        data={bestSellingProducts}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              grid: {
                color: "rgba(255, 255, 0, 0.5)", // Color amarillo para las líneas internas
              },
              pointLabels: {
                color: "white",
              },
              angleLines: {
                color: "rgba(255, 255, 0, 0.5)", // Color amarillo para las líneas radiales
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
  );
};

export default BestSellingProducts;
