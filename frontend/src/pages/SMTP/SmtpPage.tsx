// SmtpPage.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { 
  useGetMySmtpsQuery, 
  useDeleteSmtpMutation 
} from "../../redux/api/smtpApi";
import SmtpForm from "./SmtpForm";
import SmtpList from "./ SmtpList";
import { Server, Shield, Mail, HelpCircle, ExternalLink } from "lucide-react";

const SmtpPage = () => {
  const { data, isLoading, refetch } = useGetMySmtpsQuery(null);
  const [deleteSmtp] = useDeleteSmtpMutation();

  const [editData, setEditData] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  // DELETE SMTP
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this SMTP configuration?")) return;
    
    try {
      await deleteSmtp(id).unwrap();
      toast.success("SMTP configuration deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // EDIT SMTP
  const handleEdit = (smtpObj) => {
    setEditData(smtpObj);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading SMTP configurations...</p>
        </div>
      </div>
    );
  }

  // Normalize data
  const smtpData = Array.isArray(data) ? data : data?.smtps || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header - Simplified */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm">
            Configure your personal email accounts for sending campaigns
          </p>
        </div>
        
        {/* Guide Toggle Button */}
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          <HelpCircle size={18} />
          {showGuide ? "Hide Guide" : "Show Gmail Setup Guide"}
        </button>
      </div>

      {/* Gmail SMTP Setup Guide - Enhanced Visibility */}
      {showGuide && (
        <div className="bg-blue-900/40 border border-blue-600/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Gmail SMTP Setup Guide</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step by Step Instructions */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Step-by-Step Instructions:</h4>
              <ol className="text-gray-200 text-sm space-y-3 list-decimal list-inside">
                <li className="pb-3">
                  <span className="font-medium text-white">Enable 2-Factor Authentication</span>
                  <p className="text-blue-100 ml-6 mt-1">Go to your Google Account security settings and enable 2FA</p>
                </li>
                <li className="pb-3">
                  <span className="font-medium text-white">Generate App Password</span>
                  <p className="text-blue-100 ml-6 mt-1">
                    Visit{" "}
                    <a 
                      href="https://myaccount.google.com/apppasswords" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 underline flex items-center gap-1 inline-flex"
                    >
                      Google App Passwords <ExternalLink size={14} />
                    </a>
                  </p>
                </li>
                <li className="pb-3">
                  <span className="font-medium text-white">Create New App Password</span>
                  <p className="text-blue-100 ml-6 mt-1">Select "Mail" as app and generate password</p>
                </li>
                <li className="pb-2">
                  <span className="font-medium text-white">Use in SMTP Form</span>
                  <p className="text-blue-100 ml-6 mt-1">
                    Use the generated 16-character password in the password field below
                  </p>
                </li>
              </ol>
            </div>

            {/* SMTP Settings Reference */}
            <div className="bg-blue-800/30 rounded-lg p-4 border border-blue-600/30">
              <h4 className="text-white font-medium mb-3">Gmail SMTP Settings:</h4>
              <dl className="text-sm space-y-3">
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Host:</dt>
                  <dd className="text-white font-mono">smtp.gmail.com</dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Port:</dt>
                  <dd className="text-white font-mono">587 (TLS) or 465 (SSL)</dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Username:</dt>
                  <dd className="text-white">Your full Gmail address</dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Password:</dt>
                  <dd className="text-white">Generated App Password</dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Security:</dt>
                  <dd className="text-white">TLS/SSL Required</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Proper Height Management */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Column - SMTP Form & Tips */}
        <div className="flex flex-col space-y-6 min-h-[500px]">
          {/* SMTP Form Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col flex-1">
            {/* Form Header */}
            <div className="border-b border-gray-700 p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Mail className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editData ? "Edit SMTP Configuration" : "Add New SMTP"}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {editData ? "Update your SMTP settings" : "Configure your email account for sending"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Form Content - Scrollable */}
            <div className="p-6 flex-1 overflow-y-auto">
              <SmtpForm
                editData={editData}
                onSuccess={() => {
                  refetch();
                  setEditData(null);
                }}
               
              />
            </div>
          </div>

          {/* Best Practices Card */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 flex-shrink-0">
            <h3 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
              <Shield size={18} className="text-yellow-500" />
              SMTP Best Practices
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Always use App Passwords for Gmail instead of your main password</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Port 587 for TLS, Port 465 for SSL connections</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Test your configuration before using in campaigns</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Monitor your sending limits to avoid being flagged as spam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - SMTP List */}
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
                    <h2 className="text-xl font-bold text-white">Your SMTP Accounts</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {smtpData.length} configured account{smtpData.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {smtpData.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400">Active: {smtpData.filter(s => s.isActive).length}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-600 mx-2"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-gray-400">Inactive: {smtpData.filter(s => !s.isActive).length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* List Content - Scrollable */}
            <div className="p-6 flex-1 overflow-y-auto">
              <SmtpList 
                data={smtpData} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                
              />
            </div>

            {/* Empty State */}
            {smtpData.length === 0 && (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">No SMTP Accounts</h3>
                  <p className="text-gray-400 text-sm">
                    Get started by adding your first SMTP configuration
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmtpPage;