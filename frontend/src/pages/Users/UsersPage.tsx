import React, { useState } from "react";
import { Edit, Trash2, Eye, Plus, X } from "lucide-react";

const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: "Ashutosh Singh", email: "ashutosh@reachiq.com", role: "Admin" },
    { id: 2, name: "Aditi Sharma", email: "aditi@reachiq.com", role: "Manager" },
    { id: 3, name: "Rahul Verma", email: "rahul@reachiq.com", role: "User" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return alert("Please fill all fields.");

    setUsers([
      ...users,
      { id: Date.now(), ...newUser },
    ]);

    setNewUser({ name: "", email: "", role: "User" });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>

        {/* Add New User button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1f4fd6] text-white px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Add User</span>
        </button>
      </div>

      {/* Card */}
      <div className="rounded-2xl shadow-md border border-gray-800 bg-gray-900 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#1f4fd6]">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-lg font-semibold">User Directory</h2>
            <span className="text-sm text-white/90 bg-white/10 px-2 py-0.5 rounded">
              {users.length}
            </span>
          </div>
          <div className="text-sm text-white/90">Manage roles & permissions</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Role</th>
                <th className="px-6 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800 text-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-800/50 transition-colors duration-150"
                >
                  <td className="px-6 py-3 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-300">{user.email}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-1 text-xs rounded bg-white/5 text-white/90">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex items-center justify-center gap-4">
                    <button
                      className="p-2 rounded hover:bg-white/5 transition text-[#2563eb]"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-2 rounded hover:bg-white/5 transition text-green-400"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 rounded hover:bg-white/5 transition text-red-400"
                      title="Delete"
                      onClick={() =>
                        setUsers(users.filter((u) => u.id !== user.id))
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-900/80 text-gray-400 text-xs">
          Tip: Table is horizontally scrollable on small screens.
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Box */}
          <div className="fixed z-50 inset-0 flex items-center justify-center">
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-white mb-4">
                Add New User
              </h2>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-[#2563eb]"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-[#2563eb]"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-[#2563eb]"
                  >
                    <option>User</option>
                    <option>Manager</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#2563eb] hover:bg-[#1f4fd6] text-white font-medium"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;
