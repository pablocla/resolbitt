// src/pages/app/pos.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VerFacturas from "./VerFacturas";
import DashboardLayout from "../../components/DashboardLayout"; // Asegúrate de importar el DashboardLayout correctamente
import { Invoice } from "../../types"; // Importar la interfaz Invoice desde el archivo types

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Customer {
  id: number;
  name: string;
}

const PosSystem = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [showInvoices, setShowInvoices] = useState<boolean>(false);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchRecentInvoices = async () => {
      try {
        const response = await axios.get("/api/facturacion");
        setRecentInvoices(response.data.slice(-5)); // Obtener los últimos 5 tickets
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchProducts();
    fetchCustomers();
    fetchRecentInvoices();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== product.id));
  };

  const handleGenerateInvoice = async () => {
    const productIds = cart.map((product) => product.id);
    const amount = cart.reduce((acc, product) => acc + product.price, 0);
    const impIVA = amount * 0.21; // Suponiendo un IVA del 21%
    const impNeto = amount;

    try {
      const response = await axios.post("/api/facturacion", {
        amount,
        productIds,
        customerId: selectedCustomer,
        cbteTipo: 1, // Ejemplo: Factura A
        ptoVta: 1, // Punto de venta
        concepto: 1, // Productos
        docTipo: 80, // CUIT
        docNro: "12345678", // Número de documento del cliente (ejemplo)
        impNeto,
        impIVA,
      });

      alert("Factura generada exitosamente");
      setCart([]);
      const invoicesResponse = await axios.get("/api/facturacion");
      setRecentInvoices(invoicesResponse.data.slice(-5)); // Actualizar los últimos 5 tickets
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Error generando la factura");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvoiceCreated = (newInvoice: Invoice) => {
    setRecentInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Sistema POS</h1>
          <div className="flex justify-between items-start">
            <div className="w-1/2">
              <h2 className="text-2xl mb-2">Productos</h2>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 mb-4 text-black rounded"
              />
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-black text-white p-4 rounded shadow-md flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      <p>${product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 ml-4">
              <h2 className="text-2xl mb-2">Carrito</h2>
              <select
                onChange={(e) => setSelectedCustomer(Number(e.target.value))}
                className="w-full p-2 mb-4 text-black rounded"
                value={selectedCustomer || ""}
              >
                <option value="" disabled>
                  Seleccione un cliente
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <div className="bg-white text-black p-4 rounded shadow-md mb-4">
                {cart.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      <p>${product.price.toFixed(2)} x 1</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(product)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      -
                    </button>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4">
                  <h3 className="text-xl font-bold">
                    Total: $
                    {cart
                      .reduce((acc, product) => acc + product.price, 0)
                      .toFixed(2)}
                  </h3>
                  <button
                    onClick={handleGenerateInvoice}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Generar Factura
                  </button>
                </div>
              </div>
              <div className="bg-white text-black p-4 rounded shadow-md">
                <h3 className="text-xl font-bold mb-2">Últimos 5 Tickets</h3>
                <ul>
                  {recentInvoices.map((invoice) => (
                    <li key={invoice.id} className="mb-2">
                      <div className="flex justify-between items-center">
                        <span>ID: {invoice.id}</span>
                        <span>Cliente ID: {invoice.customerId ?? "N/A"}</span>
                        <span>Monto: ${invoice.amount.toFixed(2)}</span>
                        <span>
                          Fecha: {new Date(invoice.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setShowInvoices(true)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded mt-4"
              >
                Ver Facturas
              </button>
            </div>
          </div>
        </div>
        {showInvoices && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-md w-11/12 md:w-3/4 lg:w-1/2">
              <button
                onClick={() => setShowInvoices(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mb-4"
              >
                Cerrar
              </button>
              <VerFacturas onInvoiceCreated={handleInvoiceCreated} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PosSystem;
