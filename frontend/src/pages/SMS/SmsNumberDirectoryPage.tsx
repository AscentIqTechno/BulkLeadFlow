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
import { Trash2, Edit, Upload, Plus, Download, FileText, User, Calendar, Phone, Search, Filter, Lock, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";

const SmsNumberDirectoryPage: React.FC = () => {
  const roles = useSelector((state: any) => state.auth?.user.roles || []);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Queries
  const { data, isLoading, refetch } = isAdmin
    ? useGetAllNumbersQuery(null)
    : useGetMyNumbersQuery(null);

  // Mutations
  const [addNumber] = useAddNumberMutation();
  const [updateNumber] = useUpdateNumberMutation();
  const [deleteNumber] = useDeleteNumberMutation();
  const [bulkImportNumbers] = useBulkImportNumbersMutation();

  // Add/Edit Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", number: "", isConfidential: false });
  const [errors, setErrors] = useState<{ name?: string; number?: string }>({});

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filter numbers based on search and date range
  const filteredNumbers = data?.filter((item: any) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const itemDate = new Date(item.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    let matchesDate = true;
    if (start && end) {
      matchesDate = itemDate >= start && itemDate <= end;
    } else if (start) {
      matchesDate = itemDate >= start;
    } else if (end) {
      matchesDate = itemDate <= end;
    }
    
    return matchesSearch && matchesDate;
  }) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
    if (type !== 'checkbox') {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const err: any = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.number.trim()) err.number = "Phone number is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validate()) return;

    try {
      if (editingId) {
        await updateNumber({ 
          id: editingId, 
          name: form.name, 
          number: form.number,
          isConfidential: form.isConfidential 
        }).unwrap();
        toast.success("Contact updated successfully!");
      } else {
        await addNumber({ 
          name: form.name, 
          number: form.number,
          isConfidential: form.isConfidential 
        }).unwrap();
        toast.success("Contact added successfully!");
      }
      setForm({ name: "", number: "", isConfidential: false });
      setEditingId(null);
      setShowAddModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  // Edit handler
  const handleEdit = (item: any) => {
    setForm({ 
      name: item.name, 
      number: item.number, 
      isConfidential: item.isConfidential || false 
    });
    setEditingId(item._id);
    setShowAddModal(true);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];

    try {
      await bulkImportNumbers(file).unwrap();
      toast.success("Contact upload successful!");
      setShowUploadModal(false);
      refetch();
    } catch (err: any) {
    const msg =
      err?.data?.message ||
      err?.error ||
      "Upload failed. Please check your CSV file.";
    toast.error(msg);
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
    if (!confirm("Are you sure you want to delete this contact?")) return;
    
    try {
      await deleteNumber(id).unwrap();
      toast.success("Deleted successfully");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Download sample CSV template with confidential field
  const downloadSampleTemplate = () => {
    const csvContent = "name,number,isConfidential\nJohn Doe,+1234567890,true\nJane Smith,+0987654321,false\nMike Johnson,+1122334455,true";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sms_directory_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Sample template downloaded!");
  };

  // Clear all filters
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  // Check if any filter is active
  const hasActiveFilters = searchTerm || startDate || endDate;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading SMS directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2"></h1>
          <p className="text-gray-400">
            Manage your phone contacts for bulk SMS campaigns
          </p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button
            onClick={downloadSampleTemplate}
            className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download size={18} />
            Download Sample
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload size={18} />
            Import
          </button>
          <button
            onClick={() => { setShowAddModal(true); setEditingId(null); setForm({ name: "", number: "", isConfidential: false }); }}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Phone className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Numbers</p>
              <p className="text-2xl font-bold text-white">{data?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <User className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Unique Contacts</p>
              <p className="text-2xl font-bold text-white">{data?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ready for Campaign</p>
              <p className="text-2xl font-bold text-white">{data?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Updated</p>
              <p className="text-lg font-bold text-white">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search contacts by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-gray-300 transition-colors"
            >
              <Filter size={16} />
              Filter
            </button>
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 border border-red-600 rounded-lg text-white transition-colors"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Date Range Filters - Collapsible */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
            
            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-md">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} className="hover:text-yellow-300">
                      <X size={14} />
                    </button>
                  </span>
                )}
                {startDate && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-md">
                    From: {new Date(startDate).toLocaleDateString()}
                    <button onClick={() => setStartDate("")} className="hover:text-blue-300">
                      <X size={14} />
                    </button>
                  </span>
                )}
                {endDate && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-md">
                    To: {new Date(endDate).toLocaleDateString()}
                    <button onClick={() => setEndDate("")} className="hover:text-blue-300">
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Number Directory Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phone Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Confidential</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredNumbers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Phone className="h-12 w-12 text-gray-500 mb-4" />
                      <p className="text-gray-400 text-lg">No contacts found</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {hasActiveFilters ? "Try adjusting your filters" : "Get started by adding your first contact"}
                      </p>
                      {hasActiveFilters && (
                        <button 
                          onClick={clearFilters}
                          className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNumbers.map((item: any) => (
                  <tr key={item._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-yellow-500" />
                        </div>
                        <span className="font-medium text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{item.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.isConfidential ? (
                          <>
                            <Lock className="h-4 w-4 text-yellow-500" />
                            <span className="text-yellow-500 text-sm">Yes</span>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">No</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {item.userId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Edit Contact"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete Contact"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredNumbers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-700 bg-gray-700/30">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <div>
                Showing {filteredNumbers.length} of {data?.length} contacts
                {hasActiveFilters && " (filtered)"}
              </div>
              <div className="flex gap-4 mt-2 md:mt-0">
                <button className="hover:text-yellow-500 transition-colors">Previous</button>
                <button className="hover:text-yellow-500 transition-colors">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowAddModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md relative shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit Contact" : "Add New Contact"}
                </h2>
                
              </div>

              {/* Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdate(); }} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter contact name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    name="number"
                    value={form.number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                  {errors.number && <p className="text-red-400 text-sm mt-1">{errors.number}</p>}
                </div>

                {/* Confidential Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <input
                    type="checkbox"
                    name="isConfidential"
                    checked={form.isConfidential}
                    onChange={handleChange}
                    className="w-4 h-4 text-yellow-500 bg-gray-600 border-gray-500 rounded focus:ring-yellow-500 focus:ring-2"
                    id="confidential-checkbox"
                  />
                  <label htmlFor="confidential-checkbox" className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <Lock className="h-4 w-4 text-yellow-500" />
                    Is this confidential?
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setEditingId(null); }}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
                  >
                    {editingId ? "Update Contact" : "Add Contact"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowUploadModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md relative shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Bulk Upload Contacts</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
                >
                </button>
              </div>

              {/* Upload Area */}
              <div className="p-6">
                <div
                  {...getRootProps()}
                  className={`p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? "border-yellow-500 bg-yellow-500/10" 
                      : "border-gray-600 bg-gray-700/40 hover:border-gray-500"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg font-medium mb-2">
                      {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Supports CSV, XLS, XLSX files<br />
                      Maximum file size: 10MB
                    </p>
                    <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-lg transition-colors">
                      Browse Files
                    </button>
                  </div>
                </div>

                {/* File Requirements */}
                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <h3 className="text-white font-medium mb-3">File Requirements:</h3>
                  <ul className="text-gray-400 text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      CSV format with columns: <code className="bg-gray-600 px-1 rounded">name, number, isConfidential</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      First row should be header row
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      <code>isConfidential</code> values: <code className="bg-gray-600 px-1 rounded">true</code> or <code className="bg-gray-600 px-1 rounded">false</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      Maximum 10,000 rows per file
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={downloadSampleTemplate}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download Template
                  </button>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SmsNumberDirectoryPage;