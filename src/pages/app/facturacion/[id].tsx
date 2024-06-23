import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { Invoice, Product, Customer } from "@prisma/client";

interface InvoiceWithDetails extends Invoice {
  products: {
    product: Product;
    quantity: number;
  }[];
  customer: Customer | null;
}

const FacturaDetalle: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState<InvoiceWithDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchInvoice = async () => {
        try {
          const response = await axios.get(`/api/facturacion/${id}`);
          setInvoice(response.data);
        } catch (error) {
          console.error("Error fetching invoice details:", error);
          setError("Error fetching invoice details");
        }
      };

      fetchInvoice();
    }
  }, [id]);

  const handlePrint = async () => {
    if (invoice) {
      try {
        const response = await axios.post(
          "/api/facturacion?action=generate-pdf",
          {
            invoiceId: invoice.id,
          }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${invoice.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error generating invoice PDF:", error);
        setError("Error generating invoice PDF");
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900">
        <Image
          src="/logo.png" // Asegúrate de que la ruta del logo sea correcta
          alt="ResolbIT"
          width={150}
          height={150}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white p-4">
      <div className="bg-white p-6 rounded shadow-md text-black w-full max-w-6xl mx-auto mt-6">
        <h2 className="text-xl mb-4 text-center font-semibold">
          Detalles de la Factura
        </h2>
        <div className="mb-4">
          <h3 className="text-lg font-bold">Encabezado</h3>
          <p>
            <strong>ID:</strong> {invoice.id}
          </p>
          <p>
            <strong>Cliente:</strong> {invoice.customer?.name ?? "Desconocido"}
          </p>
          <p>
            <strong>Monto:</strong> ${invoice.amount}
          </p>
          <p>
            <strong>Tipo de Comprobante:</strong> {invoice.cbteTipo}
          </p>
          <p>
            <strong>Punto de Venta:</strong> {invoice.ptoVta}
          </p>
          <p>
            <strong>Concepto:</strong> {invoice.concepto}
          </p>
          <p>
            <strong>Tipo de Documento:</strong> {invoice.docTipo}
          </p>
          <p>
            <strong>Número de Documento:</strong> {invoice.docNro}
          </p>
          <p>
            <strong>Importe Neto:</strong> ${invoice.impNeto}
          </p>
          <p>
            <strong>Importe IVA:</strong> ${invoice.impIVA}
          </p>
          <p>
            <strong>Importe Total:</strong> ${invoice.impTotal}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold">Ítems de Factura</h3>
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.products.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${item.product.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={handlePrint}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Imprimir PDF
        </button>
      </div>
    </div>
  );
};

export default FacturaDetalle;
