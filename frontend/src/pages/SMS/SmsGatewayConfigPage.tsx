import React, { useState, ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import {
  useAddSmsConfigMutation,
  useGetSmsConfigQuery,
  useUpdateSmsConfigMutation,
  useDeleteSmsConfigMutation,
} from "@/redux/api/smsApi";
import { Edit, Trash2 } from "lucide-react";

interface SmsConfig {
  _id: string;
  username: string;
  contactNumber: string;
  ip: string;
  port: string;
}

interface FormState {
  username: string;
  contactNumber: string;
  ip: string;
  port: string;
  testNumber?: string;
}

interface ErrorState {
  username?: string;
  contactNumber?: string;
  ip?: string;
  port?: string;
  testNumber?: string;
}

const SmsGatewayConfigPage: React.FC = () => {
  const { data: configs = [], refetch } = useGetSmsConfigQuery();
  const [addConfig] = useAddSmsConfigMutation();
  const [updateConfig] = useUpdateSmsConfigMutation();
  const [deleteConfig] = useDeleteSmsConfigMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    username: "",
    contactNumber: "",
    ip: "",
    port: "8080",
  });

  const [errors, setErrors] = useState<ErrorState>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err: ErrorState = {};
    if (!form.username?.trim()) err.username = "User Name is required";
    if (!form.contactNumber?.trim()) err.contactNumber = "Contact Number is required";
    if (!form.ip?.trim()) err.ip = "Phone IP is required";
    if (!form.port?.trim() || isNaN(Number(form.port))) err.port = "Valid Port is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    console.log("ffff")
    if (!validate()) return;
    try {
      if (editingId) {
        // Only send the fields your backend expects (exclude testNumber)
        await updateConfig({ id: editingId, username: form.username, contactNumber: form.contactNumber, ip: form.ip, port: form.port }).unwrap();
        toast.success("Gateway configuration updated!");
      } else {
        await addConfig({ username: form.username, contactNumber: form.contactNumber, ip: form.ip, port: form.port }).unwrap();
        toast.success("Gateway configuration saved!");
      }
      setForm({ username: "", contactNumber: "", ip: "", port: "8080" });
      setEditingId(null);
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save configuration");
    }
  };

const handleEdit = (item: SmsConfig) => {
  setForm({
    username: item.username,
    contactNumber: item.contactNumber,
    ip: item.ip,
    port: item.port?.toString() || "8080", // convert number to string
  });
  setEditingId(item._id);
  setErrors({});
  setShowModal(true);
};


  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteConfig(id).unwrap();
      toast.success("Configuration deleted");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className=" min-h-screen text-white flex gap-6">
      {/* TABLE */}
      <div className="flex-1 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-md overflow-x-auto">
        <div className="flex justify-between mb-4">
          <h4 className="font-semibold">Saved SMS Gateways</h4>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setForm({ username: "", contactNumber: "", ip: "", port: "8080" });
              setErrors({});
            }}
          >
            Add Gateway
          </button>
        </div>

        {configs.length > 0 ? (
          <table className="min-w-full text-left text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-2">User Name</th>
                <th className="px-4 py-2">Contact Number</th>
                <th className="px-4 py-2">IP</th>
                <th className="px-4 py-2">Port</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((c) => (
                <tr key={c._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2">{c.username}</td>
                  <td className="px-4 py-2">{c.contactNumber}</td>
                  <td className="px-4 py-2">{c.ip}</td>
                  <td className="px-4 py-2">{c.port}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Edit
                      className="cursor-pointer text-blue-400 hover:text-blue-200"
                      onClick={() => handleEdit(c)}
                      size={18}
                    />
                    <Trash2
                      className="cursor-pointer text-red-400 hover:text-red-200"
                      onClick={() => handleDelete(c._id)}
                      size={18}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No SMS Gateway configured</p>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 border border-gray-700">
            <h3 className="text-white text-lg mb-4">{editingId ? "Edit SMS Gateway" : "Add SMS Gateway"}</h3>
            <div className="space-y-4">
              {["username", "contactNumber", "ip", "port"].map((field) => (
                <div key={field}>
                  <label className="text-gray-300">
                    {field === "username"
                      ? "User Name"
                      : field === "contactNumber"
                        ? "Contact Number"
                        : field === "ip"
                          ? "Phone IP"
                          : "Port"}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    placeholder={
                      field === "username"
                        ? "John Doe"
                        : field === "contactNumber"
                          ? "+919876543210"
                          : field === "ip"
                            ? "192.168.101.121"
                            : "8080"
                    }
                    className={`w-full mt-1 bg-gray-100 text-black px-3 py-2 rounded-lg border ${(errors as any)[field] ? "border-red-500" : "border-gray-700"
                      }`}
                  />
                  {(errors as any)[field] && (
                    <p className="text-red-500 text-sm mt-1">{(errors as any)[field]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between gap-3 mt-5">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setForm({ username: "", contactNumber: "", ip: "", port: "8080" });
                  setErrors({});
                }}
                className="px-4 py-2 bg-gray-600 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmsGatewayConfigPage;
