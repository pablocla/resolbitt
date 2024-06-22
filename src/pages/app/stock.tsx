import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";

interface StockItem {
  id: number;
  product: {
    name: string;
  };
  deposit: string;
  quantity: number;
}

interface ErrorState {
  message: string;
}

const Stock = () => {
  const [data, setData] = useState<StockItem[]>([]);
  const [error, setError] = useState<ErrorState | null>(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [name, setName] = useState("");
  const [deposit, setDeposit] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [userId, setUserId] = useState(1); // Suponiendo que tienes un userId fijo por ahora

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/stock");
      setData(response.data);
      setLoading(false); // Desactivar la carga una vez que los datos se han cargado
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching data:", axiosError);
      setError({ message: axiosError.message });
      setLoading(false); // Desactivar la carga incluso si hay un error
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/stock", {
        name,
        deposit,
        userId,
        quantity,
      });
      setData([...data, response.data]);
      setName("");
      setDeposit("");
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
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-black flex flex-col items-center p-8">
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
              <input
                type="text"
                placeholder="Nombre del producto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded w-full"
              />
              <input
                type="text"
                placeholder="Depósito"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded w-full"
              />
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
                <th className="py-2">Depósito</th>
                <th className="py-2">Cantidad</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="bg-gray-100">
                  <td className="border px-4 py-2">{item.product.name}</td>
                  <td className="border px-4 py-2">{item.deposit}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleAdjustment(item.id, 1)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleAdjustment(item.id, -1)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
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
  );
};

export default Stock;
