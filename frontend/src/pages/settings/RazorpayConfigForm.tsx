import React, { useState } from "react";
import {
  useCreateRazorpayConfigMutation,
  useUpdateRazorpayConfigMutation,
  useDeleteRazorpayConfigMutation,
  useGetAllRazorpayConfigsQuery,
} from "@/redux/api/razorpayApi";
import { toast } from "react-hot-toast";
import { Edit2, Trash2, Plus, Eye, EyeOff } from "lucide-react";

const RazorpayConfigManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showKeySecret, setShowKeySecret] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    label: "",
    keyId: "",
    keySecret: "",
    isActive: true,
  });

  // API Hooks
  const { data, isLoading, refetch } = useGetAllRazorpayConfigsQuery(null);
  const [createConfig] = useCreateRazorpayConfigMutation();
  const [updateConfig] = useUpdateRazorpayConfigMutation();
  const [deleteConfig] = useDeleteRazorpayConfigMutation();

  // Open Modal for ADD
  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      label: "",
      keyId: "",
      keySecret: "",
      isActive: true,
    });
    setShowKeySecret(false);
    setIsModalOpen(true);
  };

  // Open Modal for EDIT
  const openEditModal = (record: any) => {
    setEditingItem(record);
    setFormData({
      label: record.label,
      keyId: record.keyId,
      keySecret: "", // Don't show existing secret for security
      isActive: record.isActive,
    });
    setShowKeySecret(false);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.label.trim() || !formData.keyId.trim()) {
      toast.error("Label and Key ID are required");
      return;
    }

    try {
      if (editingItem) {
        await updateConfig({ 
          id: editingItem._id, 
          ...formData,
          // Only include keySecret if it's provided
          ...(formData.keySecret ? { keySecret: formData.keySecret } : {})
        }).unwrap();
        toast.success("Razorpay config updated successfully");
      } else {
        if (!formData.keySecret) {
          toast.error("Key Secret is required for new configuration");
          return;
        }
        await createConfig(formData).unwrap();
        toast.success("Razorpay config created successfully");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    try {
      await deleteConfig(id).unwrap();
      toast.success("Configuration deleted successfully");
      setDeleteConfirm(null);
      refetch();
    } catch (err: any) {
      toast.error("Delete failed");
    }
  };

  const configs = data?.data || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Razorpay Accounts</h2>
          <p className="text-gray-600">Manage your Razorpay payment gateway configurations</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Razorpay Account
        </button>
      </div>

      {/* Configurations Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : configs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Wallet className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Razorpay configurations</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first Razorpay account</p>
            <button
              onClick={openAddModal}
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Add Razorpay Account
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {configs?.map((config: any) => (
                  <tr key={config._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{config.label}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-mono">{config.keyId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          config.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {config.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(config)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(config._id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md relative shadow-2xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                {editingItem ? "Edit Razorpay Account" : "Add Razorpay Account"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-black">
                  <label className="block text-sm font-medium text-white mb-1">
                    Label / Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => handleInputChange('label', e.target.value)}
                    placeholder="Primary Razorpay Account"
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono"
                />
                </div>

                <div className="text-black">
                  <label className="block text-sm font-medium text-white mb-1">
                    Razorpay Key ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.keyId}
                    onChange={(e) => handleInputChange('keyId', e.target.value)}
                    placeholder="rzp_test_ABC123"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Razorpay Key Secret {!editingItem && '*'}
                  </label>
                  <div className="relative text-black">
                    <input
                      type={showKeySecret ? "text" : "password"}
                      value={formData.keySecret}
                      onChange={(e) => handleInputChange('keySecret', e.target.value)}
                      placeholder="*********"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeySecret(!showKeySecret)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeySecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-white mt-1">
                    {editingItem 
                      ? "Leave blank if you don't want to change the secret"
                      : "Required for new configuration"
                    }
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-black focus:ring-yellow-500 mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-white ">
                    Set as active configuration
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-white hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                  >
                    {editingItem ? "Update Account" : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Configuration</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this Razorpay configuration? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wallet icon component since it's used in the empty state
const Wallet = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export default RazorpayConfigManager;