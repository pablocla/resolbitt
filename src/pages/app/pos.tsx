import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  FaPlus, FaMinus, FaShoppingCart, FaSearch, FaClipboardList, FaUsers, FaWarehouse, FaTags 
} from "react-icons/fa";
import VerFacturas from "./VerFacturas";
import DashboardLayout from "../../components/DashboardLayout";
import { useTheme } from "../hooks/useTheme";
import Ticket from "../../components/ticket";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface Customer {
  id: number;
  name: string;
}

const PosSystem: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number; discount: number; price: number }[]>([]);
  const [search, setSearch] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [showInvoices, setShowInvoices] = useState<boolean>(false);
  const ticketRef = useRef<HTMLDivElement>(null);

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

    fetchProducts();
    fetchCustomers();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showInvoices) {
        setShowInvoices(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showInvoices]);

  const handleAddToCart = (product: Product) => {
    const existingProduct = cart.find((item) => item.product.id === product.id);
    if (existingProduct) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { product, quantity: 1, discount: 0, price: product.price }]);
    }
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== product.id));
  };

  const handleUpdateQuantity = (product: Product, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const handleUpdateDiscount = (product: Product, discount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === product.id ? { ...item, discount: discount } : item
      )
    );
  };

  const handleUpdatePrice = (product: Product, price: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === product.id ? { ...item, price: price } : item
      )
    );
  };

  const handleGenerateInvoice = async () => {
    const productIds = cart.map((item) => item.product.id);
    const amount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity * (1 - item.discount / 100),
      0
    );
    const impIVA = amount * 0.21;
    const impNeto = amount;

    try {
      await axios.post("/api/facturacion", {
        amount,
        productIds,
        customerId: selectedCustomer,
        cbteTipo: 1,
        ptoVta: 1,
        concepto: 1,
        docTipo: 80,
        docNro: "12345678",
        impNeto,
        impIVA,
      });

      alert("Factura generada exitosamente");
      setCart([]);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Error generando la factura");
    }
  };

  const handlePrintInvoice = () => {
    if (ticketRef.current) {
      const printContent = ticketRef.current.innerHTML;
      const newWindow = window.open("", "_blank");
      newWindow?.document.write(`
        <html>
          <head>
            <title>Imprimir Ticket</title>
            <style>
              .ticket {
                width: 80mm;
                font-size: 12px;
                line-height: 1.5;
                font-family: Arial, sans-serif;
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `);
      newWindow?.document.close();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity * (1 - item.discount / 100),
    0
  );
  const totalIVA = totalAmount * 0.21;
  const totalNeto = totalAmount;

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <div className="container mx-auto p-4">
          <nav className="flex justify-between items-center bg-gray-900 p-4 mb-4 rounded">
            <h1 className="text-3xl font-bold flex items-center">
              <FaShoppingCart className="mr-2" />
              Sistema POS
            </h1>
            <div className="flex items-center space-x-4">
              <button className="primary px-4 py-2 rounded flex items-center">
                <FaClipboardList className="mr-2" />
                Pedidos
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p-2 text-black rounded"
                />
                <FaSearch className="absolute right-2 top-2 text-black" />
              </div>
              <button id="theme-switcher" className="p-2 rounded bg-gray-800 text-white">
                Toggle Theme
              </button>
            </div>
          </nav>
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="lg:w-2/3 w-full">
              <h2 className="text-2xl mb-2">Productos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-800 text-white p-4 rounded shadow-md flex flex-col justify-between items-center"
                  >
                    <img
                      src={product.imageUrl || "/default-product.png"}
                      alt={product.name}
                      className="w-20 h-20 object-cover mb-2 rounded-full"
                    />
                    <div className="text-center">
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      <p>${product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="primary px-4 py-2 rounded mt-2"
                    >
                      <FaPlus />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3 w-full mt-4 lg:mt-0 lg:ml-4">
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
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{item.product.name}</h3>
                      <p>
                        ${item.price?.toFixed(2) ?? '0.00'} x {item.quantity} - Descuento: {item.discount}%
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) => handleUpdateQuantity(item.product, Number(e.target.value))}
                        className="w-16 p-2 text-black rounded"
                      />
                      <input
                        type="number"
                        value={item.discount}
                        min={0}
                        max={100}
                        onChange={(e) => handleUpdateDiscount(item.product, Number(e.target.value))}
                        className="w-16 p-2 text-black rounded"
                      />
                      <input
                        type="number"
                        value={item.price}
                        min={0}
                        onChange={(e) => handleUpdatePrice(item.product, Number(e.target.value))}
                        className="w-16 p-2 text-black rounded"
                      />
                      <button
                        onClick={() => handleRemoveFromCart(item.product)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        <FaMinus />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4">
                  <h3 className="text-xl font-bold">
                    Total: ${totalAmount.toFixed(2)}
                  </h3>
                  <button
                    onClick={handleGenerateInvoice}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Generar Factura
                  </button>
                  <button
                    onClick={handlePrintInvoice}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-2"
                  >
                    Imprimir
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowInvoices(true)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded mt-4"
              >
                Ver Facturas
              </button>
            </div>
          </div>
          <div ref={ticketRef} style={{ display: 'none' }}>
            <Ticket cart={cart} total={totalAmount} />
          </div>
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-md flex items-center space-x-4">
            <button className="primary px-4 py-2 rounded">
              <FaUsers /> Clientes
            </button>
            <button className="primary px-4 py-2 rounded">
              <FaWarehouse /> Stock
            </button>
            <button className="primary px-4 py-2 rounded">
              <FaTags /> Precios
            </button>
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
              <VerFacturas />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PosSystem;
