import React, { useState, ChangeEvent } from "react";
import axios from "axios";
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
  testNumber: string;
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingTest, setLoadingTest] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>({
    username: "",
    contactNumber: "",
    ip: "",
    port: "",
    testNumber: "",
  });

  const [errors, setErrors] = useState<ErrorState>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = (isTest: boolean = false) => {
    let err: ErrorState = {};

    if (!form.username.trim()) err.username = "User Name is required";
    if (!form.contactNumber.trim()) err.contactNumber = "Contact Number is required";
    if (!form.ip.trim()) err.ip = "Phone IP is required";
    if (!form.port.trim() || isNaN(Number(form.port))) err.port = "Valid Port is required";

    if (isTest && !form.testNumber.trim()) err.testNumber = "Test Number is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleTest = async () => {
    if (!validate(true)) return;

    setLoadingTest(true);
    try {
      const encodedIP = encodeURIComponent(form.ip);
      const encodedPort = encodeURIComponent(form.port);
      const url = `http://${encodedIP}:${encodedPort}/send-sms`;

      await axios.post(url, {
        phone: form.testNumber,
        message: "Test SMS from Gateway",
      });

      toast.success("Test SMS sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send test SMS. Check IP/Port and phone connectivity.");
    } finally {
      setLoadingTest(false);
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingId) {
        await updateConfig({ id: editingId, ...form }).unwrap();
        toast.success("Gateway configuration updated!");
      } else {
        await addConfig(form).unwrap();
        toast.success("Gateway configuration saved!");
      }

      setForm({ username: "", contactNumber: "", ip: "", port: "8080", testNumber: "" });
      setEditingId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save configuration");
    }
  };

  const handleEdit = (item: SmsConfig) => {
    setEditingId(item._id);
    setForm({
      username: item.username,
      contactNumber: item.contactNumber,
      ip: item.ip,
      port: item.port,
      testNumber: "",
    });
    toast("Editing mode enabled", { icon: "✏️" });
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
    <div className="p-6 min-h-screen text-white flex gap-6">
      {/* LEFT FORM */}
      <div className="flex-1 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Edit SMS Gateway" : "Add SMS Gateway"}
        </h3>

        <div className="space-y-4">
          {/* USERNAME */}
          <div className="text-gray-700">
            <label className="text-gray-300">User Name</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full mt-1 bg-gray-100 border ${
                errors.username ? "border-red-500" : "border-gray-700"
              } px-3 py-2 rounded-lg`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* CONTACT NUMBER */}
          <div className="text-gray-700">
            <label className="text-gray-300">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="+919876543210"
              className={`w-full mt-1 bg-gray-100 border ${
                errors.contactNumber ? "border-red-500" : "border-gray-700"
              } px-3 py-2 rounded-lg`}
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
            )}
          </div>

          {/* IP */}
          <div className="text-gray-700">
            <label className="text-gray-300">Phone IP</label>
            <input
              type="text"
              name="ip"
              value={form.ip}
              onChange={handleChange}
              placeholder="192.168.101.121"
              className={`w-full mt-1 bg-gray-100 border ${
                errors.ip ? "border-red-500" : "border-gray-700"
              } px-3 py-2 rounded-lg`}
            />
            {errors.ip && <p className="text-red-500 text-sm mt-1">{errors.ip}</p>}
          </div>

          {/* PORT */}
          <div className="text-gray-700">
            <label className="text-gray-300">Port</label>
            <input
              type="text"
              name="port"
              value={form.port}
              onChange={handleChange}
              placeholder="8080"
              className={`w-full mt-1 bg-gray-100 border ${
                errors.port ? "border-red-500" : "border-gray-700"
              } px-3 py-2 rounded-lg`}
            />
            {errors.port && <p className="text-red-500 text-sm mt-1">{errors.port}</p>}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
            >
              Save Configuration
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT TABLE */}
      <div className="flex-1 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-md overflow-x-auto">
        <h4 className="font-semibold mb-4">Saved SMS Gateways</h4>

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
              {configs.map((c: SmsConfig) => (
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
    </div>
  );
};

export default SmsGatewayConfigPage;
