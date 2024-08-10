import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  blocked: boolean;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    username: "",
    email: "",
    role: "USER",
    blocked: false,
  });
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      setError("Error fetching users");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingUser) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post("/api/users", newUser);
      setUsers([...users, response.data]);
      resetForm();
    } catch (error) {
      setError("Error creating user");
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      const response = await axios.put(`/api/users/${editingUser.id}`, newUser);
      setUsers(
        users.map((user) => (user.id === editingUser.id ? response.data : user))
      );
      resetForm();
    } catch (error) {
      setError("Error updating user");
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingUser) return;
    try {
      await axios.put(`/api/users/${editingUser.id}/change-password`, {
        newPassword,
      });
      setNewPassword("");
      setError("Password updated successfully");
    } catch (error) {
      setError("Error updating password");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      email: user.email,
      role: user.role,
      blocked: user.blocked,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      setError("Error deleting user");
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setNewUser({
      username: "",
      email: "",
      role: "USER",
      blocked: false,
    });
    setNewPassword("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block">
            Username:
            <input
              type="text"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              required
              className="block w-full border p-2"
            />
          </label>
        </div>
        <div className="mb-2">
          <label className="block">
            Email:
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
              className="block w-full border p-2"
            />
          </label>
        </div>
        <div className="mb-2">
          <label className="block">
            Role:
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value as "USER" | "ADMIN",
                })
              }
              required
              className="block w-full border p-2"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
        </div>
        <div className="mb-2">
          <label className="block">
            Blocked:
            <input
              type="checkbox"
              checked={newUser.blocked}
              onChange={(e) =>
                setNewUser({ ...newUser, blocked: e.target.checked })
              }
              className="ml-2"
            />
          </label>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingUser ? "Update User" : "Create User"}
        </button>
      </form>
      {editingUser && (
        <form onSubmit={handleChangePassword} className="mb-4">
          <h2 className="text-xl mb-2">
            Change Password for {editingUser.username}
          </h2>
          <div className="mb-2">
            <label className="block">
              New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="block w-full border p-2"
              />
            </label>
          </div>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Change Password
          </button>
        </form>
      )}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Blocked</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                {user.blocked ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
