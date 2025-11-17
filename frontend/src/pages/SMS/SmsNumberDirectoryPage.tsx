import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetMyNumbersQuery,
  useGetAllNumbersQuery,
  useAddNumberMutation,
  useUpdateNumberMutation,
  useDeleteNumberMutation,
  useBulkImportNumbersMutation,
} from "@/redux/api/numberDirectoryApi";
import { Trash2, Edit, Upload, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";

const SmsNumberDirectoryPage: React.FC = () => {
  const roles = useSelector((state: any) => state.auth?.user.roles || []);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  // Queries based on role
  const { data, isLoading, refetch } = isAdmin
    ? useGetAllNumbersQuery()
    : useGetMyNumbersQuery();

  // Mutations
  const [addNumber] = useAddNumberMutation();
  const [updateNumber] = useUpdateNumberMutation();
  const [deleteNumber] = useDeleteNumberMutation();
  const [bulkImportNumbers] = useBulkImportNumbersMutation();

  // Add / Update Contact Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", number: "" });
  const [errors, setErrors] = useState<{ name?: string; number?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err: any = {};
    if (!form.name.trim()) err.name = "Contact name is required";
    if (!form.number.trim()) err.number = "Contact number is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validate()) return;

    try {
      if (editingId) {
        await updateNumber({ id: editingId, name: form.name, number: form.number }).unwrap();
        toast.success("Contact updated successfully!");
      } else {
        await addNumber({ name: form.name, number: form.number }).unwrap();
        toast.success("Contact added successfully!");
      }
      setForm({ name: "", number: "" });
      setEditingId(null);
      setShowAddModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  const handleEdit = (item: any) => {
    setForm({ name: item.name, number: item.number });
    setEditingId(item._id);
    setShowAddModal(true);
  };

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);

  // File Dropzone
  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];

    try {
      await bulkImportNumbers(file).unwrap();
      toast.success("Bulk upload successful!");
      setShowUploadModal(false);
      refetch();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteNumber(id).unwrap();
      toast.success("Deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (isLoading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 mt-2">

      {/* PAGE HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">My Contact Number Directory</h2>

        <div className="flex gap-3">
          {/* Add Contact */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Add Contact
          </button>

          {/* Upload File */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Upload size={18} /> Upload CSV/Excel
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="bg-gray-800 text-gray-400 uppercase text-xs">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Number</th>
              <th className="py-3 px-4 text-left">User ID</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.length === 0 && (
              <tr>
                <td className="py-4 px-4 text-center text-gray-500" colSpan={5}>
                  No numbers found.
                </td>
              </tr>
            )}

            {data?.map((item: any) => (
              <tr
                key={item._id}
                className="border-t border-gray-700 hover:bg-gray-800/60"
              >
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.number}</td>
                <td className="py-2 px-4">{item.userId}</td>
                <td className="py-2 px-4">
                  {new Date(item.createdAt).toLocaleString()}
                </td>

                <td className="py-2 px-4 flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 rounded hover:bg-blue-800/40"
                  >
                    <Edit size={18} className="text-green-400" />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1 rounded hover:bg-red-800/40"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ADD / EDIT CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 border border-gray-700">
            <h3 className="text-white text-lg mb-4">
              {editingId ? "Edit Contact" : "Add New Contact"}
            </h3>

            <div className="space-y-4">

              <div>
                <label className="text-gray-300">Contact Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 bg-gray-100 text-black px-3 py-2 rounded-lg"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label className="text-gray-300">Contact Number</label>
                <input
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  className="w-full mt-1 bg-gray-100 text-black px-3 py-2 rounded-lg"
                  placeholder="+91 9876543210"
                />
                {errors.number && <p className="text-red-400 text-sm">{errors.number}</p>}
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => { setShowAddModal(false); setEditingId(null); }}
                className="px-4 py-2 bg-gray-600 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddOrUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 border border-gray-700">
            <h3 className="text-white text-lg mb-4">Upload CSV/Excel</h3>

            <div
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded-xl cursor-pointer ${
                isDragActive ? "border-blue-400 bg-blue-900/20"
                              : "border-gray-500 bg-gray-700/40"
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-center text-gray-300">
                Drag & drop file here<br />or click to upload
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SmsNumberDirectoryPage;
