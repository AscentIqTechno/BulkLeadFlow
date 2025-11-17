import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useGetSmsConfigQuery } from "@/redux/api/smsApi";
import { useGetAllNumbersQuery, useGetMyNumbersQuery } from "@/redux/api/numberDirectoryApi";

interface NumberOption {
  value: string;
  label: string;
}

const SmsSendPage: React.FC = () => {
  const roles = useSelector((state: any) => state.auth?.user.roles || []);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  const [smsTitle, setSmsTitle] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [gatewayId, setGatewayId] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const { data: configs = [] } = useGetSmsConfigQuery();
  const { data: numbersData = [], isLoading: loadingNumbers } = isAdmin
    ? useGetAllNumbersQuery()
    : useGetMyNumbersQuery();

  // Handle checkbox toggle
  const handleNumberToggle = (number: string) => {
    setSelectedNumbers((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  const sendSMS = async () => {
    if (!smsTitle.trim()) return alert("Enter SMS Title");
    if (!gatewayId) return alert("Select Gateway");
    if (selectedNumbers.length === 0 || message.trim() === "") return alert("Select numbers & enter message");

    setSending(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:4000/api/sms/send-bulk", {
        title: smsTitle,
        numbers: selectedNumbers,
        message,
        gatewayId,
      });

      if (response.data.success) {
        setResult(`SMS sent to ${response.data.sent}/${selectedNumbers.length}`);
        setSelectedNumbers([]);
        setMessage("");
        setSmsTitle("");
        setGatewayId("");
      } else {
        setResult("Failed to send SMS.");
      }
    } catch (err) {
      setResult("Failed to send SMS. Server error.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT FORM */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-md border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Create New SMS</h3>

          {/* SMS Title */}
          <label className="text-gray-300">SMS Title</label>
          <input
            type="text"
            placeholder="Enter SMS title"
            value={smsTitle}
            onChange={(e) => setSmsTitle(e.target.value)}
            className="w-full mt-1 mb-4 p-3 rounded-lg bg-[#0F1A1E] text-white border border-gray-700"
          />

          {/* Gateway Select */}
          <label className="text-gray-300">Select Gateway</label>
          <select
            value={gatewayId}
            onChange={(e) => setGatewayId(e.target.value)}
            className="w-full mt-1 mb-4 p-3 rounded-lg bg-[#0F1A1E] text-white border border-gray-700"
          >
            <option value="">Select Gateway</option>
            {configs.map((cfg: any) => (
              <option key={cfg._id} value={cfg._id}>
                {cfg.username} ({cfg.ip})
              </option>
            ))}
          </select>

          {/* Numbers Checkbox Multi-Select */}
          <label className="text-gray-300">Select Numbers</label>
          <div className="max-h-48 overflow-y-auto border border-gray-700 rounded-lg p-2 mb-4 bg-[#0F1A1E]">
            {loadingNumbers ? (
              <p className="text-gray-400">Loading numbers...</p>
            ) : numbersData.length === 0 ? (
              <p className="text-gray-400">No numbers available.</p>
            ) : (
              numbersData.map((n: any) => (
                <label key={n._id} className="flex items-center gap-2 text-white mb-1">
                  <input
                    type="checkbox"
                    checked={selectedNumbers.includes(n.number)}
                    onChange={() => handleNumberToggle(n.number)}
                    className="accent-blue-600"
                  />
                  {n.name ? `${n.name} (${n.number})` : n.number}
                </label>
              ))
            )}
          </div>

          {/* Message */}
          <label className="text-gray-300">Message</label>
          <textarea
            placeholder="Enter your SMS message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full mt-1 mb-4 p-3 rounded-lg bg-[#0F1A1E] text-white border border-gray-700"
          />

          {/* Submit Button */}
          <button
            onClick={sendSMS}
            disabled={sending}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg mt-2"
          >
            {sending ? "Sending..." : "Save & Send"}
          </button>

          {result && (
            <p className={`mt-4 ${result.includes("Failed") ? "text-red-400" : "text-green-400"}`}>
              {result}
            </p>
          )}
        </div>

        {/* RIGHT – Numbers Table */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-md border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Available Numbers</h3>

          <div className="overflow-y-auto max-h-[500px]">
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Number</th>
                  <th className="py-2 px-2">User ID</th>
                  <th className="py-2 px-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {numbersData?.length === 0 && (
                  <tr>
                    <td className="py-4 px-2 text-center text-gray-500" colSpan={4}>
                      No numbers found.
                    </td>
                  </tr>
                )}

                {numbersData?.map((item: any) => (
                  <tr key={item._id} className="border-b border-gray-700 hover:bg-gray-800/60">
                    <td className="py-2 px-2">{item.name}</td>
                    <td className="py-2 px-2">{item.number}</td>
                    <td className="py-2 px-2">{item.userId}</td>
                    <td className="py-2 px-2">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmsSendPage;
