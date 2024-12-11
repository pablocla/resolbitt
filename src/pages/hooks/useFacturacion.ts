import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface Invoice {
  id: number;
  amount: number;
  productId: number;
  customerId: number;
  user: {
    id: number;
    username: string;
  } | null;
  product: {
    id: number;
    name: string;
  } | null;
  customer: {
    id: number;
    name: string;
    cuit: string;
  } | null;
}

interface Product {
  id: number;
  name: string;
}

interface Customer {
  id: number;
  name: string;
}

interface ErrorState {
  message: string;
}

export const useFacturacion = () => {
  const [data, setData] = useState<Invoice[] | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesResponse, productsResponse, customersResponse] =
          await Promise.all([
            axios.get("/api/facturacion"),
            axios.get("/api/products"),
            axios.get("/api/customers"),
          ]);
        setData(invoicesResponse.data);
        setProducts(productsResponse.data);
        setCustomers(customersResponse.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        setError({ message: axiosError.message });
      }
    };

    fetchData();
  }, []);

  const createInvoice = async (
    amount: number,
    productId: number,
    customerId: number
  ) => {
    try {
      const response = await axios.post("/api/facturacion", {
        amount,
        productId,
        customerId,
      });
      setData((prevData) =>
        prevData ? [...prevData, response.data] : [response.data]
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      setError({ message: axiosError.message });
      throw axiosError;
    }
  };

  const transmitAfip = async (invoiceId: number) => {
    try {
      await axios.post("/api/afip", { invoiceId });
      alert("Factura transmitida a AFIP con éxito");
    } catch (error) {
      alert("Error al transmitir la factura a AFIP");
    }
  };

  return {
    data,
    error,
    products,
    customers,
    createInvoice,
    transmitAfip,
  };
};
