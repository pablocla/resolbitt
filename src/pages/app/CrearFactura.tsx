import React, { useEffect, useState } from "react";
import axios from "axios";
import { Product, Customer } from "@prisma/client";
import { Invoice } from "../../types";

interface CrearFacturaProps {
  onInvoiceCreated: (invoice: Invoice) => void;
  onClose: () => void;
}

const CrearFactura: React.FC<CrearFacturaProps> = ({
  onInvoiceCreated,
  onClose,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [productIds, setProductIds] = useState<
    { id: number; quantity: number }[]
  >([]);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cbteTipo, setCbteTipo] = useState<number>(0);
  const [ptoVta, setPtoVta] = useState<number>(0);
  const [concepto, setConcepto] = useState<number>(0);
  const [docTipo, setDocTipo] = useState<number>(0);
  const [docNro, setDocNro] = useState<string>("");
  const [impNeto, setImpNeto] = useState<number>(0);
  const [impIVA, setImpIVA] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, customersResponse] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/customers"),
        ]);
        setProducts(productsResponse.data);
        setCustomers(customersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData();

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !amount ||
      productIds.length === 0 ||
      !customerId ||
      !cbteTipo ||
      !ptoVta ||
      !concepto ||
      !docTipo ||
      !docNro ||
      !impNeto ||
      !impIVA
    ) {
      alert("Todos los valores deben ser válidos");
      return;
    }

    try {
      const customer = customers.find((cust) => cust.id === customerId);
      if (!customer) {
        alert("Cliente no encontrado");
        return;
      }

      const response = await axios.post<Invoice>("/api/facturacion", {
        amount,
        productIds: productIds.map((item) => item.id),
        customerId,
        cuit: customer.cuit,
        cbteTipo,
        ptoVta,
        concepto,
        docTipo,
        docNro,
        impNeto,
        impIVA,
        impTotal: amount + impIVA,
      });

      const newInvoice: Invoice = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        products: response.data.products,
      };

      onInvoiceCreated(newInvoice);
      resetForm();
    } catch (error) {
      console.error("Error creating invoice:", error);
      setError("Error creating invoice");
    }
  };

  const handleAddProduct = () => {
    setProductIds([...productIds, { id: 0, quantity: 1 }]);
  };

  const handleProductChange = (index: number, productId: number) => {
    const newProductIds = [...productIds];
    newProductIds[index].id = productId;
    setProductIds(newProductIds);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newProductIds = [...productIds];
    newProductIds[index].quantity = quantity;
    setProductIds(newProductIds);
  };

  const resetForm = () => {
    setAmount(0);
    setProductIds([]);
    setCustomerId(null);
    setCbteTipo(0);
    setPtoVta(0);
    setConcepto(0);
    setDocTipo(0);
    setDocNro("");
    setImpNeto(0);
    setImpIVA(0);
    setError(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl bg-white p-8 rounded shadow-md text-black"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Factura</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cliente</label>
          <select
            value={customerId || ""}
            onChange={(e) => setCustomerId(Number(e.target.value))}
            className="w-full p-2 border rounded"
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
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {productIds.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <select
                value={item.id || ""}
                onChange={(e) =>
                  handleProductChange(index, Number(e.target.value))
                }
                className="w-full p-2 border rounded"
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
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(index, Number(e.target.value))
                }
                className="w-20 p-2 border rounded"
                min="1"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddProduct}
            className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Añadir Producto
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Monto</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Tipo de Comprobante
            </label>
            <input
              type="number"
              value={cbteTipo}
              onChange={(e) => setCbteTipo(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Punto de Venta</label>
            <input
              type="number"
              value={ptoVta}
              onChange={(e) => setPtoVta(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Concepto</label>
            <input
              type="number"
              value={concepto}
              onChange={(e) => setConcepto(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Tipo de Documento
            </label>
            <input
              type="number"
              value={docTipo}
              onChange={(e) => setDocTipo(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Número de Documento
            </label>
            <input
              type="text"
              value={docNro}
              onChange={(e) => setDocNro(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Importe Neto</label>
            <input
              type="number"
              value={impNeto}
              onChange={(e) => setImpNeto(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Importe IVA</label>
            <input
              type="number"
              value={impIVA}
              onChange={(e) => setImpIVA(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Crear Factura
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </form>
    </div>
  );
};

export default CrearFactura;
