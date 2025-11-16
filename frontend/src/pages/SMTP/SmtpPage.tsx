// SmtpPage.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";

import {
  useGetMySmtpsQuery,
  useDeleteSmtpMutation,
  useUpdateSmtpMutation,
} from "../../redux/api/smtpApi";
import SmtpForm from "./SmtpForm";
import SmtpList from "./ SmtpList";

const SmtpPage = () => {
  const { data, isLoading, refetch } = useGetMySmtpsQuery();
  const [deleteSmtp] = useDeleteSmtpMutation();

  const [editData, setEditData] = useState(null);

  // DELETE SMTP
  const handleDelete = async (id) => {
    try {
      await deleteSmtp(id).unwrap();
      toast.success("SMTP deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // EDIT SMTP
  const handleEdit = (smtpObj) => {
    setEditData(smtpObj);
  };

  if (isLoading) return <div className="text-white">Loading SMTPs...</div>;

  // Normalize data
  const smtpData = Array.isArray(data) ? data : data?.smtps || [];

  return (
    <div className="p-6">
      {/* LEFT — RIGHT LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN — SMTP FORM */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <SmtpForm
            editData={editData}
            onSuccess={() => {
              refetch();
              setEditData(null);
            }}
          />
        </div>

        {/* RIGHT COLUMN — SMTP LIST */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <SmtpList 
            data={smtpData} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </div>
    </div>
  );
};

export default SmtpPage;
