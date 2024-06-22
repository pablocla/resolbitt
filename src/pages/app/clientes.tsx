import React, { useState, useEffect } from "react";
import axios from "axios";

interface Cliente {
  id: number;
  name: string;
  email: string;
  phone: string;
  cuit: string;
}

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cuit, setCuit] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get("/api/customers");
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        // Editar cliente
        await axios.put(`/api/customers`, {
          id: editId,
          name: nombre,
          email: email,
          phone: telefono,
          cuit: cuit,
        });
      } else {
        // Crear cliente
        await axios.post("/api/customers", {
          name: nombre,
          email: email,
          phone: telefono,
          cuit: cuit,
        });
      }
      fetchClientes();
      setNombre("");
      setEmail("");
      setTelefono("");
      setCuit("");
      setEditId(null);
    } catch (error) {
      console.error("Error saving cliente:", error);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setNombre(cliente.name);
    setEmail(cliente.email);
    setTelefono(cliente.phone);
    setCuit(cliente.cuit);
    setEditId(cliente.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete("/api/customers", { data: { id } });
      fetchClientes();
    } catch (error) {
      console.error("Error deleting cliente:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md text-black mb-8"
      >
        <h2 className="text-2xl mb-4">
          {editId ? "Editar Cliente" : "Agregar Cliente"}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">CUIT</label>
          <input
            type="text"
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {editId ? "Actualizar Cliente" : "Agregar Cliente"}
        </button>
      </form>
      <div className="bg-white p-6 rounded shadow-md text-black">
        <h2 className="text-2xl mb-4">Lista de Clientes</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Teléfono</th>
              <th className="text-left p-2">CUIT</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="p-2">{cliente.name}</td>
                <td className="p-2">{cliente.email}</td>
                <td className="p-2">{cliente.phone}</td>
                <td className="p-2">{cliente.cuit}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="bg-yellow-500 text-white rounded px-4 py-2 mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
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
  );
};

export default Clientes;
