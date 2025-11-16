import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const SmtpList = ({ data = [], onEdit, onDelete }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 mt-2">
      <h2 className="text-lg font-semibold text-white mb-4">Configured SMTP Accounts</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="bg-gray-800 text-gray-400 uppercase text-xs">
              <th className="py-3 px-4 text-left">Host</th>
              <th className="py-3 px-4 text-left">Port</th>
              <th className="py-3 px-4 text-left">From</th>
              <th className="py-3 px-4 text-left">Secure</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  className="py-4 px-4 text-center text-gray-500"
                  colSpan={5}
                >
                  No SMTP configurations found.
                </td>
              </tr>
            )}

            {data.map((smtp) => (
              <tr
                key={smtp._id}
                className="border-t border-gray-700 hover:bg-gray-800/60"
              >
                <td className="py-2 px-4">{smtp.host}</td>
                <td className="py-2 px-4">{smtp.port}</td>
                <td className="py-2 px-4">{smtp.fromEmail}</td>
                <td className="py-2 px-4">{smtp.secure ? "Yes" : "No"}</td>

                <td className="py-2 px-4 flex items-center gap-3">
                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => onEdit(smtp)}
                    className="p-1 rounded hover:bg-blue-800/40"
                  >
                    <Pencil size={18} className="text-blue-400" />
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => onDelete(smtp._id)}
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
    </div>
  );
};

export default SmtpList;
