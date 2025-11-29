import React, { useState, ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import {
  useAddSmsConfigMutation,
  useGetSmsConfigQuery,
  useUpdateSmsConfigMutation,
  useDeleteSmsConfigMutation,
  useTestSmsConnectionMutation,
} from "@/redux/api/smsApi";
import { Edit, Trash2, Server, Shield, Phone, HelpCircle, ExternalLink } from "lucide-react";

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
}

interface ErrorState {
  username?: string;
  contactNumber?: string;
  ip?: string;
  port?: string;
}

const SmsGatewayConfigPage: React.FC = () => {
  const { data: configs = [], refetch, isLoading } = useGetSmsConfigQuery(null);
  const [addConfig] = useAddSmsConfigMutation();
  const [updateConfig] = useUpdateSmsConfigMutation();
  const [deleteConfig] = useDeleteSmsConfigMutation();
  const [testSmsConfig] =useTestSmsConnectionMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

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
    if (!validate()) return;
    try {
      if (editingId) {
        await updateConfig({
          id: editingId,
          username: form.username,
          contactNumber: form.contactNumber,
          ip: form.ip,
          port: form.port
        }).unwrap();
        toast.success("Gateway configuration updated!");
      } else {
        await addConfig({
          username: form.username,
          contactNumber: form.contactNumber,
          ip: form.ip,
          port: form.port
        }).unwrap();
        toast.success("Gateway configuration saved!");
      }
      setForm({ username: "", contactNumber: "", ip: "", port: "8080" });
      setEditingId(null);
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
      port: item.port?.toString() || "8080",
    });
    setEditingId(item._id);
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this SMS gateway configuration?")) return;
    try {
      await deleteConfig(id).unwrap();
      toast.success("Configuration deleted");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleTest = async () => {
    if (!validate()) return;

    try {
      const payload = {
        username: form.username,
        contactNumber: form.contactNumber,
        ip: form.ip,
        port: form.port
      };

      const res = await testSmsConfig(payload).unwrap();

      toast.success(res?.message || "Test SMS sent successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Test SMS failed!");
    }
  };


  const handleCancel = () => {
    setForm({ username: "", contactNumber: "", ip: "", port: "8080" });
    setEditingId(null);
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading SMS gateway configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm">
            Configure your SMS gateway for sending campaigns
          </p>
        </div>

        {/* Guide Toggle Button */}
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          <HelpCircle size={18} />
          {showGuide ? "Hide Guide" : "Show Setup Guide"}
        </button>
      </div>

      {/* SMS Gateway Setup Guide - Enhanced Visibility */}
      {showGuide && (
        <div className="bg-blue-900/40 border border-blue-600/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Simple SMS Gateway Setup Guide</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step by Step Instructions */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Step-by-Step Instructions:</h4>
              <ol className="text-gray-200 text-sm space-y-3 list-decimal list-inside">
                <li className="pb-3">
                  <span className="font-medium text-white">Install the App</span>
                  <p className="text-blue-100 ml-6 mt-1">
                    Download and install the app from{" "}
                    <a
                      href="https://play.google.com/store/apps/details?id=com.pabrikaplikasi.simplesmsgateway"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 underline flex items-center gap-1 inline-flex"
                    >
                      Play Store <ExternalLink size={14} />
                    </a>
                  </p>
                  <ul className="text-blue-100 ml-10 mt-2 space-y-1 list-disc">
                    <li>Tap Install and wait for the installation to complete</li>
                    <li>Grant SMS and phone permissions when prompted</li>
                  </ul>
                </li>
                <li className="pb-3">
                  <span className="font-medium text-white">Start the SMS Gateway Server</span>
                  <p className="text-blue-100 ml-6 mt-1">
                    Open the Simple SMS Gateway app on your Android phone
                  </p>
                  <ul className="text-blue-100 ml-10 mt-2 space-y-1 list-disc">
                    <li>Tap <strong>Start Server</strong></li>
                    <li>The app will show:
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>IP address of the phone (example: 192.168.101.121)</li>
                        <li>Port (default: 8080)</li>
                      </ul>
                    </li>
                    <li>Make sure your PC/server is on the same Wi-Fi network as the phone</li>
                  </ul>
                </li>
                <li className="pb-2">
                  <span className="font-medium text-white">Important Note</span>
                  <p className="text-blue-100 ml-6 mt-1">
                    The server must remain running to accept SMS requests
                  </p>
                </li>
              </ol>
            </div>

            {/* App Settings Reference */}
            <div className="bg-blue-800/30 rounded-lg p-4 border border-blue-600/30">
              <h4 className="text-white font-medium mb-3">App Information:</h4>
              <dl className="text-sm space-y-3">
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">App Name:</dt>
                  <dd className="text-white">Simple SMS Gateway</dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Developer:</dt>
                  <dd className="text-white">Pabrik Aplikasi</dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Default Port:</dt>
                  <dd className="text-white font-mono">8080</dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Network:</dt>
                  <dd className="text-white">Same Wi-Fi Required</dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Permissions:</dt>
                  <dd className="text-white">SMS & Phone</dd>
                </div>
              </dl>

              <div className="mt-4 p-3 bg-blue-900/40 rounded border border-blue-500/30">
                <h5 className="text-white font-medium text-sm mb-2">📱 Quick Setup Tips:</h5>
                <ul className="text-blue-100 text-xs space-y-1">
                  <li>• Keep your phone charged and connected to power</li>
                  <li>• Use static IP for reliable connections</li>
                  <li>• Test with a single SMS before bulk sending</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Column - SMS Form & Tips */}
        <div className="flex flex-col space-y-6 min-h-[500px]">
          {/* SMS Form Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col flex-1">
            {/* Form Header */}
            <div className="border-b border-gray-700 p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Phone className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? "Edit SMS Gateway" : "Add SMS Gateway"}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {editingId ? "Update your SMS gateway settings" : "Configure your SMS gateway for sending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-4">
                {["username", "contactNumber", "ip", "port"].map((field) => (
                  <div key={field}>
                    <label className="text-gray-300 text-sm font-medium">
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
                      className={`w-full mt-1 bg-gray-700 border text-white px-3 py-2 rounded-lg ${(errors as any)[field]
                          ? "border-red-500"
                          : "border-gray-600"
                        } focus:border-yellow-500 focus:outline-none transition-colors`}
                    />
                    {(errors as any)[field] && (
                      <p className="text-red-500 text-sm mt-1">{(errors as any)[field]}</p>
                    )}
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">

                  {/* Test Button */}
                  <button
                    onClick={handleTest}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex-1"
                  >
                    Test
                  </button>

                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white rounded-lg transition-colors flex-1"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex-1"
                  >
                    {editingId ? "Update" : "Save"}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Best Practices Card */}
          <div className="bg-yellow-500/10 border border-yellow-200/20 rounded-xl p-6 flex-shrink-0">
            <h3 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
              <Shield size={18} className="text-yellow-500" />
              SMS Gateway Best Practices
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Ensure your phone is connected to the same network as your server</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Use static IP addresses for reliable connections</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Keep your phone charged and connected to power</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Test your configuration before using in campaigns</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - SMS Gateway List */}
        <div className="flex flex-col min-h-[500px]">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col flex-1">
            {/* List Header */}
            <div className="border-b border-gray-700 p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                    <Server className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your SMS Gateways</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {configs.length} configured gateway{configs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {configs.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400">Total: {configs.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* List Content - Scrollable */}
            <div className="p-6 flex-1 overflow-y-auto">
              {configs.length > 0 ? (
                <div className="space-y-4">
                  {configs.map((config) => (
                    <div
                      key={config._id}
                      className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold">{config.username}</h3>
                            <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                              {config.contactNumber}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300">
                            <div className="flex items-center gap-4">
                              <span>IP: {config.ip}</span>
                              <span>Port: {config.port}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(config)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(config._id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <Phone className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">No SMS Gateways</h3>
                    <p className="text-gray-400 text-sm">
                      Get started by adding your first SMS gateway configuration
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsGatewayConfigPage;