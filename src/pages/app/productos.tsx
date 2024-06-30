import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar"; // Asegúrate de importar el Sidebar correctamente

interface Product {
  id: number;
  name: string;
  price: number;
  stocks: Stock[];
}

interface Stock {
  id: number;
  quantity: number;
}

interface ErrorState {
  message: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<ErrorState | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1); // Inicializar quantity en 1
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          handleAxiosError(error, "Error fetching products");
        } else {
          setError({ message: "An unknown error occurred" });
        }
      }
    };

    fetchData();
  }, []); // Asegúrate de que el arreglo de dependencias esté vacío

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingProduct) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    if (isValidInput()) {
      try {
        const response = await axios.post("/api/products", {
          name,
          price,
          userId: 1, // Assuming userId is 1 for demonstration purposes
          quantity, // Agregar cantidad a la solicitud
        });
        setProducts([...products, response.data]);
        resetForm();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          handleAxiosError(error, "Error adding product");
        } else {
          setError({ message: "An unknown error occurred" });
        }
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingProduct || !isValidInput()) return;
    try {
      const response = await axios.put(`/api/products`, {
        id: editingProduct.id,
        name,
        price,
        quantity, // Agregar cantidad a la solicitud de actualización
      });
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? response.data : product
        )
      );
      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error, "Error updating product");
      } else {
        setError({ message: "An unknown error occurred" });
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    const totalQuantity = product.stocks.reduce(
      (total, stock) => total + stock.quantity,
      0
    );
    setQuantity(totalQuantity); // Establecer cantidad en el formulario de edición
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/products`, { data: { id } });
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error, "Error deleting product");
      } else {
        setError({ message: "An unknown error occurred" });
      }
    }
  };

  const handleAxiosError = (error: AxiosError, defaultMessage: string) => {
    console.error(defaultMessage, error);
    const errorMessage =
      (error.response?.data as { error?: string })?.error || defaultMessage;
    setError({ message: errorMessage });
  };

  const isValidInput = () => {
    if (name.trim() === "" || price <= 0 || quantity <= 0) {
      setError({
        message: "Invalid input: All fields must be filled with valid values",
      });
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setName("");
    setPrice(0);
    setQuantity(1); // Reiniciar cantidad a 1
    setEditingProduct(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white p-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 pr-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
            <form
              onSubmit={handleSubmit}
              className="mb-4 bg-white p-6 rounded shadow-md text-black"
            >
              {error && (
                <div className="text-red-600 mb-4">{error.message}</div>
              )}
              <div className="flex flex-col space-y-4">
                <label className="block">
                  <span className="text-gray-700">Nombre del Producto</span>
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="px-4 py-2 border border-gray-300 rounded w-full"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Precio</span>
                  <input
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    required
                    className="px-4 py-2 border border-gray-300 rounded w-full"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Cantidad</span>
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    required
                    className="px-4 py-2 border border-gray-300 rounded w-full"
                    min={1} // Asegurarse de que el valor mínimo sea 1
                  />
                </label>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  {editingProduct ? "Actualizar Producto" : "Agregar Producto"}
                </button>
              </div>
            </form>
          </div>
          <div className="md:w-1/2 pl-4">
            <table className="min-w-full bg-white text-black">
              <thead>
                <tr>
                  <th className="py-2">Nombre</th>
                  <th className="py-2">Precio</th>
                  <th className="py-2">Cantidad en Stock</th>
                  <th className="py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="bg-gray-100">
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.price}</td>
                    <td className="border px-4 py-2">
                      {(product.stocks ?? []).reduce(
                        (total, stock) => total + stock.quantity,
                        0
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
