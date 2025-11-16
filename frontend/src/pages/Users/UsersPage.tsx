import React, { useState } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import {
  useFetchUsersQuery,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/api/authApi";
import { toast } from "react-hot-toast";

const UsersPage = () => {
  const { data, isLoading, refetch } = useFetchUsersQuery();
  const [registerUser] = useRegisterUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
  });

  // -------------------
  // MODAL HANDLERS
  // -------------------
  const openAddModal = () => {
    setEditId(null);
    setForm({ name: "", email: "", role: "User", password: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (u) => {
    setEditId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      role: u.role,
      password: "",
    });
    setIsModalOpen(true);
  };

  // -------------------
  // SUBMIT HANDLER
  // -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!editId && !form.password.trim())
      return toast.error("Password is required");

    try {
      if (editId) {
        await updateUser({
          id: editId,
          data: {
            username: form.name,
            email: form.email,
            roles: [form.role.toLowerCase()]   // FIX!
          },
        }).unwrap();

        toast.success("User updated successfully");
      } else {
        await registerUser({
          username: form.name,
          email: form.email,
          role: form.role,
          password: form.password,
        }).unwrap();

        toast.success("User added successfully");
      }

      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Error");
    }
  };

  // -------------------
  // DELETE HANDLER
  // -------------------
  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted");
      refetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (isLoading) return <p className="text-white p-6">Loading...</p>;

  const users = (data || []).map((u) => ({
    id: u._id,
    name: u.username,
    email: u.email,
    role: u.roles?.[0] || "User",
  }));

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold"></h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-800/40">
                <td className="px-6 py-3">{u.name}</td>
                <td className="px-6 py-3">{u.email}</td>
                <td className="px-6 py-3">{u.role}</td>
                <td className="px-6 py-3 flex justify-center gap-4">
                  <button
                    className="text-green-400"
                    onClick={() => openEditModal(u)}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    className="text-red-400"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-full max-w-md relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl mb-4 font-semibold">
                {editId ? "Edit User" : "Add User"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                />

                {!editId && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                  />
                )}

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                >
                  <option>User</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded text-white w-full"
                >
                  {editId ? "Update User" : "Add User"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;
