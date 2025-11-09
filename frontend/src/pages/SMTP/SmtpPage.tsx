
import React from "react";
import SmtpForm from "./SmtpForm";
import SmtpList from "./ SmtpList";

const SmtpPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-blue-500">SMTP Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmtpForm />
        <SmtpList />
      </div>
    </div>
  );
};

export default SmtpPage;
