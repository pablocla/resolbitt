import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";

interface Invoice {
  id: number;
  amount: number;
  productId: number;
  user: {
    id: number;
    username: string;
  } | null;
  product: {
    id: number;
    name: string;
  } | null;
}

interface ErrorState {
  message: string;
}

const Facturacion = () => {
  const [data, setData] = useState<Invoice[] | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [userId, setUserId] = useState<number>(1); // Asume un userId válido
  const [productId, setProductId] = useState<number>(1); // Asume un productId válido

  useEffect(() => {
    axios
      .get("/api/facturacion")
      .then((response) => setData(response.data))
      .catch((error: AxiosError) => setError({ message: error.message }));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/facturacion", {
        amount,
        userId,
        productId,
      });
      setData((prevData) =>
        prevData ? [...prevData, response.data] : [response.data]
      );
      setAmount(0);
      setUserId(1);
      setProductId(1);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error creating invoice:", axiosError);
      setError({ message: axiosError.message });
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-black flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Facturación</h1>
      <form onSubmit={handleSubmit} className="mb-4 w-full max-w-md">
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
            className="px-4 py-2 border border-gray-300 rounded w-full"
          />
          <input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(parseInt(e.target.value))}
            required
            className="px-4 py-2 border border-gray-300 rounded w-full"
          />
          <input
            type="number"
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(parseInt(e.target.value))}
            required
            className="px-4 py-2 border border-gray-300 rounded w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-black rounded"
          >
            Crear Factura
          </button>
        </div>
      </form>
      <div className="bg-white p-6 rounded shadow-md text-black w-full max-w-md">
        <ul>
          {data.map((invoice) => (
            <li key={invoice.id}>
              {invoice.user ? invoice.user.username : "Usuario desconocido"} -{" "}
              {invoice.product ? invoice.product.name : "Producto desconocido"}{" "}
              - ${invoice.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Facturacion;
