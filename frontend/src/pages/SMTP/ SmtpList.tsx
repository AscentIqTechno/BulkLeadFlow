// SmtpList.jsx
import React from "react";
import { Pencil, Trash2, Server, Shield, Mail, CheckCircle, MoreVertical } from "lucide-react";

const SmtpList = ({ data = [], onEdit, onDelete }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <Server className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No SMTP configurations</p>
        <p className="text-gray-500 text-sm mt-2">
          Get started by adding your first SMTP account
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((smtp) => (
        <div
          key={smtp._id}
          className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 hover:border-gray-500 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-yellow-500/20 rounded-lg mt-1">
                <Server size={16} className="text-yellow-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm truncate">
                    {smtp.host}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    smtp.secure 
                      ? "bg-green-500/20 text-green-500 border border-green-500/30" 
                      : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                  }`}>
                    {smtp.secure ? (
                      <>
                        <Shield size={10} />
                        Secure
                      </>
                    ) : (
                      "Insecure"
                    )}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail size={12} />
                    <span className="truncate">{smtp.fromEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Port: {smtp.port}</span>
                    <span>•</span>
                    <span>User: {smtp.username}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <CheckCircle size={12} />
                    <span>Active</span>
                  </div>
                  <div className="text-gray-500 text-xs">•</div>
                  <div className="text-gray-400 text-xs">
                    Last used: Today
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Always Visible and Clear */}
            <div className="flex flex-col items-center gap-2 ml-4">
              {/* Edit Button */}
              <button
                onClick={() => onEdit(smtp)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 group/edit"
                title="Edit SMTP Configuration"
              >
                <Pencil size={14} />
                <span className="text-xs font-medium hidden sm:inline-block">Edit</span>
              </button>

              {/* Delete Button */}
              <button
                onClick={() => onDelete(smtp._id)}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500/50 group/delete"
                title="Delete SMTP Configuration"
              >
                <Trash2 size={14} />
                <span className="text-xs font-medium hidden sm:inline-block">Delete</span>
              </button>
            </div>

            {/* Mobile Actions Dropdown (Alternative for small screens) */}
            <div className="sm:hidden ml-2">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors">
                  <MoreVertical size={16} />
                </button>
                {/* Dropdown menu would go here */}
              </div>
            </div>
          </div>

          {/* Quick Actions Bar - Alternative Layout */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-600 sm:hidden">
            <span className="text-xs text-gray-400">Quick Actions:</span>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(smtp)}
                className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
              >
                <Pencil size={12} />
                Edit
              </button>
              <button
                onClick={() => onDelete(smtp._id)}
                className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

     
    </div>
  );
};

export default SmtpList;