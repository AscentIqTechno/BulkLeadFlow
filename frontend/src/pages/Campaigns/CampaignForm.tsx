import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const CampaignForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    sender: "",
    recipients: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Campaign Created:", formData);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Create New Campaign</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Campaign Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Summer Sale Campaign"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Exciting offers inside!"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sender Email</label>
            <input
              type="email"
              name="sender"
              value={formData.sender}
              onChange={handleChange}
              placeholder="noreply@brand.com"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Recipients</label>
          <input
            type="text"
            name="recipients"
            value={formData.recipients}
            onChange={handleChange}
            placeholder="comma,separated,emails@domain.com"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          <p className="text-xs text-gray-500 mt-1">You can add multiple emails separated by commas</p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Message</label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your email message here..."
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </div>

        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full mt-3">
          Send Campaign
        </Button>
      </form>
    </div>
  );
};

export default CampaignForm;
