import React, { useState } from "react";
import CrearFactura from "./CrearFactura";
import VerFacturas from "./VerFacturas";
import { Invoice } from "@prisma/client";

const Facturacion = () => {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleInvoiceCreated = (newInvoice: Invoice) => {
    setInvoices((prevData) =>
      prevData ? [...prevData, newInvoice] : [newInvoice]
    );
    setShowForm(false); // Ocultar el formulario después de crear la factura
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Facturación</h1>
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 mb-6 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Crear Factura
      </button>
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
      <VerFacturas />
    </div>
  );
};

export default Facturacion;
