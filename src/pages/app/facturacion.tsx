// src/pages/app/facturacion.tsx
import React, { useState } from "react";
import VerFacturas from "./VerFacturas";
import { Invoice } from "../../types"; // Asegúrate de usar la interfaz correcta
import Sidebar from "@/components/sidebar";

const Facturacion = () => {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  const handleInvoiceCreated = (newInvoice: Invoice) => {
    setInvoices((prevData) =>
      prevData ? [...prevData, newInvoice] : [newInvoice]
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white flex flex-col items-center p-8">
        <VerFacturas onInvoiceCreated={handleInvoiceCreated} />
      </div>
    </div>
  );
};

export default Facturacion;
