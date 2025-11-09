import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const SmtpForm = () => {
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    user: "",
    password: "",
    fromEmail: "",
    secure: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SMTP Config Saved:", formData);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Add SMTP Configuration</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Host</label>
            <input
              type="text"
              name="host"
              value={formData.host}
              onChange={handleChange}
              placeholder="smtp.gmail.com"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Port</label>
            <input
              type="number"
              name="port"
              value={formData.port}
              onChange={handleChange}
              placeholder="465 or 587"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">From Email</label>
            <input
              type="email"
              name="fromEmail"
              value={formData.fromEmail}
              onChange={handleChange}
              placeholder="noreply@yourdomain.com"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="secure"
            checked={formData.secure}
            onChange={handleChange}
            className="accent-blue-500"
          />
          <span className="text-gray-300 text-sm">Use Secure Connection (SSL/TLS)</span>
        </div>

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 w-full mt-3"
        >
          Save SMTP Settings
        </Button>
      </form>
    </div>
  );
};

export default SmtpForm;
