import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import {
  useSendBulkSmsMutation,
  useGetSmsCampaignsQuery,
  useDeleteSmsCampaignMutation,
} from "@/redux/api/sms_compaign.api";

import { useGetSmsConfigQuery } from "@/redux/api/smsApi";
import {
  useGetAllNumbersQuery,
  useGetMyNumbersQuery,
} from "@/redux/api/numberDirectoryApi";

const SmsSendPage = () => {
  const roles = useSelector((state: any) => state.auth?.user.roles || []);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  const [smsTitle, setSmsTitle] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [gatewayId, setGatewayId] = useState("");

  // Inline field errors
  const [errors, setErrors] = useState({
    smsTitle: "",
    gatewayId: "",
    numbers: "",
    message: "",
  });

  // RTK Queries
  const { data: configs = [] } = useGetSmsConfigQuery(null);
  const { data: numbersData = [], isLoading: loadingNumbers } = isAdmin
    ? useGetAllNumbersQuery()
    : useGetMyNumbersQuery();

  const { data: campaignsRaw } = useGetSmsCampaignsQuery(null);
  console.log(campaignsRaw,"campaignsRaw")

  // Normalize campaigns safely
  const campaigns = campaignsRaw?.records
    
  const [sendBulkSms, { isLoading: sending }] = useSendBulkSmsMutation();
  const [deleteCampaign] = useDeleteSmsCampaignMutation();

  // Checkbox toggle
  const handleNumberToggle = (number: string) => {
    setSelectedNumbers((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  // SEND SMS + SAVE CAMPAIGN
  const handleSend = async () => {
    let newErrors = {
      smsTitle: "",
      gatewayId: "",
      numbers: "",
      message: "",
    };

    if (!smsTitle.trim()) newErrors.smsTitle = "Title is required";
    if (!gatewayId) newErrors.gatewayId = "Select a gateway";
    if (selectedNumbers.length === 0) newErrors.numbers = "Select at least one number";
    if (!message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e !== "")) return;

    try {
      await sendBulkSms({
        title: smsTitle,
        gatewayId,
        numbers: selectedNumbers,
        message,
      }).unwrap();

      toast.success("SMS Sent & Campaign Saved!");

      setSmsTitle("");
      setGatewayId("");
      setMessage("");
      setSelectedNumbers([]);
      setErrors({ smsTitle: "", gatewayId: "", numbers: "", message: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send SMS");
    }
  };

  // DELETE CAMPAIGN
  const handleDelete = async (id: string) => {
    try {
      await deleteCampaign(id).unwrap();
      toast.success("Campaign deleted");
    } catch {
      toast.error("Failed to delete campaign");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* LEFT FORM */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">
          Create SMS Campaign
        </h3>

        {/* Title */}
        <label className="text-gray-300">Campaign Title</label>
        <input
          className="w-full bg-[#0F1A1E] border border-gray-700 text-white p-3 rounded-lg mb-1"
          placeholder="Enter title"
          value={smsTitle}
          onChange={(e) => setSmsTitle(e.target.value)}
        />
        {errors.smsTitle && <p className="text-red-400 text-sm mb-2">{errors.smsTitle}</p>}

        {/* Gateway */}
        <label className="text-gray-300">Select Gateway</label>
        <select
          value={gatewayId}
          onChange={(e) => setGatewayId(e.target.value)}
          className="w-full bg-[#0F1A1E] border border-gray-700 text-white p-3 rounded-lg mb-1"
        >
          <option value="">Select Gateway</option>
          {configs.map((cfg: any) => (
            <option key={cfg._id} value={cfg._id}>
              {cfg.username} ({cfg.ip})
            </option>
          ))}
        </select>
        {errors.gatewayId && <p className="text-red-400 text-sm mb-2">{errors.gatewayId}</p>}

        {/* Numbers List */}
        <label className="text-gray-300">Select Numbers</label>
        <div className="max-h-48 bg-[#0F1A1E] border border-gray-700 rounded-lg p-2 overflow-y-auto mb-1">
          {loadingNumbers ? (
            <p className="text-gray-400">Loading...</p>
          ) : numbersData.length === 0 ? (
            <p className="text-gray-400">No numbers</p>
          ) : (
            numbersData.map((n: any) => (
              <label
                key={n._id}
                className="flex items-center gap-2 text-gray-200 mb-1"
              >
                <input
                  type="checkbox"
                  checked={selectedNumbers.includes(n.number)}
                  onChange={() => handleNumberToggle(n.number)}
                />
                {n.name ? `${n.name} (${n.number})` : n.number}
              </label>
            ))
          )}
        </div>
        {errors.numbers && <p className="text-red-400 text-sm mb-2">{errors.numbers}</p>}

        {/* Message */}
        <label className="text-gray-300">Message</label>
        <textarea
          className="w-full bg-[#0F1A1E] border border-gray-700 text-white p-3 rounded-lg mb-1"
          rows={4}
          placeholder="Write message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {errors.message && <p className="text-red-400 text-sm mb-2">{errors.message}</p>}

        {/* Send Button */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white"
          disabled={sending}
          onClick={handleSend}
        >
          {sending ? "Sending..." : "Save & Send SMS"}
        </button>
      </div>

     {/* RIGHT – CAMPAIGNS LIST */}
<div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
  <h3 className="text-xl font-semibold text-white mb-4">SMS Campaigns</h3>

  <div className="max-h-[500px] overflow-y-auto">
    <table className="w-full text-left text-gray-300">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="py-2 px-2">Title</th>
          <th className="py-2 px-2">Total</th>
          <th className="py-2 px-2">Gateway</th>
          <th className="py-2 px-2">Status</th>
          <th className="py-2 px-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {campaigns?.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-500">
              No campaigns found
            </td>
          </tr>
        ) : (
          campaigns?.map((item: any) => {
            const gateway = configs.find((g: any) => g._id === item.gatewayId);
            return (
              <tr
                key={item._id}
                className="border-b border-gray-800 hover:bg-gray-800/40"
              >
                {/* Title */}
                <td className="py-2 px-2">{item.smsTitle}</td>

                {/* Total Contacts */}
                <td className="py-2 px-2">{item.totalContacts}</td>

                {/* Gateway Name */}
                <td className="py-2 px-2">{gateway ? `${gateway.username} (${gateway.ip})` : item.gatewayId}</td>

                {/* Status */}
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      item.status === "sent"
                        ? "bg-green-600 text-white"
                        : item.status === "failed"
                        ? "bg-red-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-2 px-2">
                  <button
                    className="text-red-400 hover:text-red-500"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default SmsSendPage;
