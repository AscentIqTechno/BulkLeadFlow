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
import { Send, Trash2, Users, MessageSquare, Shield, HelpCircle, Check, X } from "lucide-react";

const SmsSendPage = () => {
  const roles = useSelector((state: any) => state.auth?.user.roles || []);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  const [smsTitle, setSmsTitle] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [gatewayId, setGatewayId] = useState("");
  const [showGuide, setShowGuide] = useState(false);

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

  const { data: campaignsRaw, isLoading: loadingCampaigns } = useGetSmsCampaignsQuery(null);
  
  // Normalize campaigns safely
  const campaigns = campaignsRaw?.records || [];
  
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

  // Select all numbers
  const handleSelectAll = () => {
    if (selectedNumbers.length === numbersData.length) {
      setSelectedNumbers([]);
    } else {
      setSelectedNumbers(numbersData.map((n: any) => n.number));
    }
  };

  // SEND SMS + SAVE CAMPAIGN
  const handleSend = async () => {
    let newErrors = {
      smsTitle: "",
      gatewayId: "",
      numbers: "",
      message: "",
    };

    if (!smsTitle.trim()) newErrors.smsTitle = "Campaign title is required";
    if (!gatewayId) newErrors.gatewayId = "Please select a gateway";
    if (selectedNumbers.length === 0) newErrors.numbers = "Select at least one number";
    if (!message.trim()) newErrors.message = "Message content is required";

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
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteCampaign(id).unwrap();
      toast.success("Campaign deleted successfully");
    } catch {
      toast.error("Failed to delete campaign");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: { color: "bg-green-500/20 border-green-500/50 text-green-400", icon: Check },
      failed: { color: "bg-red-500/20 border-red-500/50 text-red-400", icon: X },
      scheduled: { color: "bg-blue-500/20 border-blue-500/50 text-blue-400", icon: Check },
      pending: { color: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400", icon: Check }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${config.color}`}>
        <IconComponent size={12} />
        {status}
      </span>
    );
  };

  if (loadingCampaigns) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm">
            Send bulk SMS messages and manage your campaigns
          </p>
        </div>
        
        {/* Guide Toggle Button */}
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          <HelpCircle size={18} />
          {showGuide ? "Hide Guide" : "Show SMS Guide"}
        </button>
      </div>

      {/* SMS Guide Panel */}
      {showGuide && (
        <div className="bg-blue-900/40 border border-blue-600/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-300">SMS Campaign Guide</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Practices */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Best Practices:</h4>
              <ol className="text-gray-200 text-sm space-y-3 list-decimal list-inside">
                <li className="pb-2">
                  <span className="font-medium text-white">Keep Messages Concise</span>
                  <p className="text-blue-100 ml-6 mt-1">SMS works best with short, focused messages</p>
                </li>
                <li className="pb-2">
                  <span className="font-medium text-white">Test Before Sending</span>
                  <p className="text-blue-100 ml-6 mt-1">Always send a test message to verify your setup</p>
                </li>
                <li className="pb-2">
                  <span className="font-medium text-white">Check Character Count</span>
                  <p className="text-blue-100 ml-6 mt-1">Standard SMS: 160 characters, Unicode: 70 characters</p>
                </li>
                <li className="pb-2">
                  <span className="font-medium text-white">Respect Timing</span>
                  <p className="text-blue-100 ml-6 mt-1">Avoid sending messages during late night hours</p>
                </li>
              </ol>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-800/30 rounded-lg p-4 border border-blue-600/30">
              <h4 className="text-white font-medium mb-3">Quick Tips:</h4>
              <dl className="text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Gateway:</dt>
                  <dd className="text-white">Ensure your SMS gateway is connected and active</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Numbers:</dt>
                  <dd className="text-white">Verify numbers include country codes (e.g., +1, +91)</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Content:</dt>
                  <dd className="text-white">Include clear call-to-action and sender identification</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Compliance:</dt>
                  <dd className="text-white">Follow local SMS regulations and anti-spam laws</dd>
                </div>
              </dl>

              <div className="mt-4 p-3 bg-blue-900/40 rounded border border-blue-500/30">
                <p className="text-blue-100 text-xs">
                  <strong>💡 Pro Tip:</strong> Use meaningful campaign titles to easily track performance later
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Column - SMS Form & Tips */}
        <div className="flex flex-col space-y-6 min-h-[500px]">
          {/* SMS Form Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col flex-1">
            {/* Form Header */}
            <div className="border-b border-gray-700 p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Send className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create SMS Campaign</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Send bulk SMS messages to your contacts
                  </p>
                </div>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {/* Campaign Title */}
              <div>
                <label className="text-gray-300 text-sm font-medium">Campaign Title</label>
                <input
                  className={`w-full mt-1 bg-gray-700 border text-white px-3 py-2 rounded-lg ${
                    errors.smsTitle ? "border-red-500" : "border-gray-600"
                  } focus:border-yellow-500 focus:outline-none transition-colors`}
                  placeholder="Enter campaign title"
                  value={smsTitle}
                  onChange={(e) => setSmsTitle(e.target.value)}
                />
                {errors.smsTitle && <p className="text-red-500 text-sm mt-1">{errors.smsTitle}</p>}
              </div>

              {/* Gateway Selection */}
              <div>
                <label className="text-gray-300 text-sm font-medium">Select Gateway</label>
                <select
                  value={gatewayId}
                  onChange={(e) => setGatewayId(e.target.value)}
                  className={`w-full mt-1 bg-gray-700 border text-white px-3 py-2 rounded-lg ${
                    errors.gatewayId ? "border-red-500" : "border-gray-600"
                  } focus:border-yellow-500 focus:outline-none transition-colors`}
                >
                  <option value="">Select Gateway</option>
                  {configs.map((cfg: any) => (
                    <option key={cfg._id} value={cfg._id}>
                      {cfg.username} ({cfg.ip}:{cfg.port})
                    </option>
                  ))}
                </select>
                {errors.gatewayId && <p className="text-red-500 text-sm mt-1">{errors.gatewayId}</p>}
              </div>

              {/* Numbers Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 text-sm font-medium">
                    Select Numbers ({selectedNumbers.length} selected)
                  </label>
                  {numbersData.length > 0 && (
                    <button
                      onClick={handleSelectAll}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      {selectedNumbers.length === numbersData.length ? "Deselect All" : "Select All"}
                    </button>
                  )}
                </div>
                
                <div className={`max-h-48 bg-gray-700 border rounded-lg overflow-y-auto ${
                  errors.numbers ? "border-red-500" : "border-gray-600"
                }`}>
                  {loadingNumbers ? (
                    <div className="p-4 text-center text-gray-400">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mx-auto mb-2"></div>
                      Loading contacts...
                    </div>
                  ) : numbersData.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No contacts available. Add contacts first.
                    </div>
                  ) : (
                    <div className="p-3 space-y-2">
                      {numbersData.map((n: any) => (
                        <label
                          key={n._id}
                          className="flex items-center gap-3 p-2 rounded hover:bg-gray-600/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedNumbers.includes(n.number)}
                            onChange={() => handleNumberToggle(n.number)}
                            className="rounded border-gray-500 bg-gray-600 text-yellow-500 focus:ring-yellow-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium truncate">
                              {n.name || "Unnamed Contact"}({n.number})
                            </div>
                           
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.numbers && <p className="text-red-500 text-sm mt-1">{errors.numbers}</p>}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 text-sm font-medium">Message</label>
                  <span className="text-xs text-gray-400">
                    {message.length} characters
                  </span>
                </div>
                <textarea
                  className={`w-full bg-gray-700 border text-white px-3 py-2 rounded-lg ${
                    errors.message ? "border-red-500" : "border-gray-600"
                  } focus:border-yellow-500 focus:outline-none transition-colors`}
                  rows={4}
                  placeholder="Write your SMS message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Send Button */}
              <button
                className="w-full bg-yellow-500 hover:bg-yellow-600 py-3 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={sending}
                onClick={handleSend}
              >
                <Send size={18} />
                {sending ? "Sending..." : "Save & Send SMS"}
              </button>
            </div>
          </div>

          {/* Best Practices Card */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 flex-shrink-0">
            <h3 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
              <Shield size={18} className="text-yellow-500" />
              SMS Best Practices
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Keep messages under 160 characters to avoid multiple messages</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Include your company name for identification</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Test with a single number before bulk sending</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Avoid using ALL CAPS and excessive punctuation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Campaigns List */}
        <div className="flex flex-col min-h-[500px]">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col flex-1">
            {/* List Header */}
            <div className="border-b border-gray-700 p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">SMS Campaigns</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} in history
                    </p>
                  </div>
                </div>
                {campaigns.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400">
                        Sent: {campaigns.filter((c: any) => c.status === 'sent').length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* List Content - Scrollable */}
            <div className="p-6 flex-1 overflow-y-auto">
              {campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.map((item: any) => {
                    const gateway = configs.find((g: any) => g._id === item.gatewayId);
                    return (
                      <div 
                        key={item._id} 
                        className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-semibold">{item.smsTitle}</h3>
                              {getStatusBadge(item.status)}
                            </div>
                            <div className="text-sm text-gray-300 space-y-1">
                              <div className="flex items-center gap-4">
                                <span>Contacts: {item.totalContacts}</span>
                                <span>Gateway: {gateway ? gateway.username : 'N/A'}</span>
                              </div>
                              <div className="text-gray-400 text-xs">
                                Created: {new Date(item.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Campaign"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <Send className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">No Campaigns</h3>
                    <p className="text-gray-400 text-sm">
                      Create your first SMS campaign to get started
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsSendPage;