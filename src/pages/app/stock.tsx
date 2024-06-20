import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";

interface StockItem {
  name: string;
  deposit: string;
}

interface ErrorState {
  message: string;
}

const Stock = () => {
  const [data, setData] = useState<StockItem[]>([]);
  const [error, setError] = useState<ErrorState | null>(null);
  const [name, setName] = useState("");
  const [deposit, setDeposit] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/stock");
      setData(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching data:", axiosError);
      setError({ message: axiosError.message });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/stock", { name, deposit });
      setData([...data, response.data]);
      setName("");
      setDeposit("");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error adding product:", axiosError);
      setError({ message: axiosError.message });
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-black flex flex-col items-center p-8">
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
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="bg-gray-100">
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.deposit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
