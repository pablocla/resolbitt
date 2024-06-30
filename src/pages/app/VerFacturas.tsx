// src/pages/app/VerFacturas.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Invoice } from "../../types";
import CrearFactura from "./CrearFactura";

interface VerFacturasProps {
  onInvoiceCreated?: (newInvoice: Invoice) => void;
}

const VerFacturas: React.FC<VerFacturasProps> = ({ onInvoiceCreated }) => {
  const [data, setData] = useState<Invoice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showActions, setShowActions] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/facturacion");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const handleTransmit = async () => {
    try {
      await Promise.all(
        selectedInvoices.map((invoiceId) =>
          axios.post("/api/afip", { invoiceId })
        )
      );
      alert("Facturas transmitidas exitosamente a la AFIP");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.error);
        } else {
          setError("Error de comunicación con el servidor");
        }
      } else {
        setError("Error al transmitir las facturas");
      }
    }
  };

  const handleGeneratePdf = async () => {
    try {
      const response = await axios.post(
        "/api/facturacion?action=generate-pdf",
        {
          invoiceId: selectedInvoices[0],
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${selectedInvoices[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      setError("Error generating invoice PDF");
    }
  };

  const handleSelectInvoice = (id: number) => {
    setSelectedInvoices((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((invoiceId) => invoiceId !== id)
        : [...prevSelected, id]
    );
  };

  const handleView = (id: number) => {
    router.push(`/app/facturacion/${id}`);
  };

  const handleEdit = (id: number) => {
    // Implementar lógica para editar factura
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/facturacion/${id}`);
      setData(
        (prevData) => prevData?.filter((invoice) => invoice.id !== id) || null
      );
    } catch (error) {
      console.error("Error deleting invoice:", error);
      setError("Error deleting invoice");
    }
  };

  const handleInvoiceCreated = (newInvoice: Invoice) => {
    setData((prevData) =>
      prevData ? [...prevData, newInvoice] : [newInvoice]
    );
    setShowForm(false); // Ocultar el formulario después de crear la factura
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="flex-1 bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white p-4">
      <div className="bg-white p-6 rounded shadow-md text-black w-full max-w-6xl mx-auto mt-6">
        <h2 className="text-xl mb-4 text-center font-semibold">Facturas</h2>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-between mb-4">
          <div>
            <button
              onClick={handleTransmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              disabled={selectedInvoices.length === 0}
            >
              Transmitir a AFIP
            </button>
            <button
              onClick={handleGeneratePdf}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 ml-2"
              disabled={selectedInvoices.length === 0}
            >
              Generar PDF
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 ml-2"
            >
              Crear Factura
            </button>
          </div>
          <div className="relative">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              onClick={() => setShowActions(!showActions)}
              disabled={selectedInvoices.length === 0}
            >
              Acciones
            </button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-10">
                <button
                  onClick={() => handleView(selectedInvoices[0])}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Ver
                </button>
                <button
                  onClick={() => handleEdit(selectedInvoices[0])}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(selectedInvoices[0])}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Borrar
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedInvoices(
                        e.target.checked
                          ? data?.map((invoice) => invoice.id) || []
                          : []
                      )
                    }
                    checked={!!data && selectedInvoices.length === data.length}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Comprobante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Punto de Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe Neto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe IVA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data &&
                data.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.customerId ?? "Desconocido"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.products
                        .map((prod) => prod.product.name)
                        .join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.cbteTipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.ptoVta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.concepto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.docTipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.docNro}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${invoice.impNeto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${invoice.impIVA}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${invoice.impTotal}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md relative">
            <CrearFactura
              onInvoiceCreated={handleInvoiceCreated}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VerFacturas;
