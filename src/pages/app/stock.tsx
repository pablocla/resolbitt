import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar"; // Asegúrate de importar el Sidebar correctamente

interface StockItem {
  id: number;
  product: {
    name: string;
  };
  quantity: number;
}

interface Product {
  id: number;
  name: string;
}

interface ErrorState {
  message: string;
}

const Stock = () => {
  const [data, setData] = useState<StockItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<ErrorState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    fetchData();
    fetchProducts();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/stock");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching data:", axiosError);
      setError({ message: axiosError.message });
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching products:", axiosError);
      setError({ message: axiosError.message });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProductId) {
      setError({ message: "Debe seleccionar un producto" });
      return;
    }

    try {
      const response = await axios.post("/api/stock", {
        productId: selectedProductId,
        quantity,
      });
      setData([...data, response.data]);
      setSelectedProductId(null);
      setQuantity(0);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error adding product:", axiosError);
      setError({ message: axiosError.message });
    }
  };

  const handleAdjustment = async (id: number, adjustment: number) => {
    try {
      const response = await axios.patch(`/api/stock`, { id, adjustment });
      setData(
        data.map((item) =>
          item.id === id ? { ...item, quantity: response.data.quantity } : item
        )
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error adjusting stock:", axiosError);
      setError({ message: axiosError.message });
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-black p-8">
        {loading ? (
          <img
            src="/logo.png"
            alt="ResolbIT Logo"
            className="h-20 w-20 mb-4 animate-pulse"
          />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Stock</h1>
            <form onSubmit={handleSubmit} className="mb-4 w-full max-w-md">
              <div className="flex space-x-2">
                <select
                  value={selectedProductId || ""}
                  onChange={(e) =>
                    setSelectedProductId(parseInt(e.target.value))
                  }
                  required
                  className="px-4 py-2 border border-gray-300 rounded w-full"
                >
                  <option value="" disabled>
                    Seleccione un producto
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                  className="px-4 py-2 border border-gray-300 rounded w-full"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-black rounded"
                >
                  Agregar Producto
                </button>
              </div>
            </form>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2">Nombre del producto</th>
                  <th className="py-2">Cantidad</th>
                  <th className="py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="bg-gray-100">
                    <td className="border px-4 py-2">
                      {item.product?.name ?? "Desconocido"}
                    </td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => handleAdjustment(item.id, 1)}
                        className="px-2 py-1 bg-green-500 text-black rounded hover:bg-green-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleAdjustment(item.id, -1)}
                        className="px-2 py-1 bg-red-500 text-black rounded hover:bg-red-700"
                      >
                        -
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Stock;
