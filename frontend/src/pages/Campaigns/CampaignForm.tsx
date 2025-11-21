// CampaignForm.jsx
import React, { useState } from "react";
import { useCreateCampaignMutation } from "@/redux/api/campaignApi";
import { toast } from "react-hot-toast";
import { Send, Mail, Users, Paperclip, Shield, Check, X } from "lucide-react";

interface SmtpData {
  _id: string;
  username: string;
  fromEmail: string;
  host: string;
  port: number;
  secure: boolean;
}

interface EmailItem {
  _id: string;
  name: string;
  email: string;
}

interface CampaignFormProps {
  data: SmtpData[];
  emailDirectory: EmailItem[];
}

interface FormDataState {
  name: string;
  subject: string;
  smtpId: string;
  message: string;
  recipients: string[];
}

interface FormErrors {
  name?: string;
  subject?: string;
  smtpId?: string;
  recipients?: string;
  message?: string;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ data, emailDirectory }) => {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    subject: "",
    smtpId: "",
    message: "",
    recipients: [],
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [progress, setProgress] = useState<{
    total: number;
    sent: number;
    failed: number;
  } | null>(null);

  const [createCampaign, { isLoading: sending }] = useCreateCampaignMutation();

  // Input Change Handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Toggle Email Selection
  const toggleRecipient = (email: string) => {
    let updated = [...formData.recipients];

    if (updated.includes(email)) {
      updated = updated.filter((r) => r !== email);
    } else {
      updated.push(email);
    }

    setFormData({ ...formData, recipients: updated });
    setErrors({ ...errors, recipients: "" });
  };

  // Select All Recipients
  const handleSelectAll = () => {
    if (formData.recipients.length === emailDirectory?.length) {
      setFormData({ ...formData, recipients: [] });
    } else {
      setFormData({ 
        ...formData, 
        recipients: emailDirectory?.map((e: EmailItem) => e.email) || [] 
      });
    }
    setErrors({ ...errors, recipients: "" });
  };

  // Validation
  const validateFields = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Campaign Name is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.smtpId) newErrors.smtpId = "Sender Email is required";
    if (formData.recipients.length === 0) newErrors.recipients = "Select at least one recipient";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("subject", formData.subject);
    payload.append("smtpId", formData.smtpId);
    payload.append("message", formData.message);

    formData.recipients.forEach((email) => payload.append("recipients[]", email));
    attachments.forEach((file) => payload.append("attachments", file));

    setProgress({ total: formData.recipients.length, sent: 0, failed: 0 });

    try {
      const response: any = await createCampaign(payload).unwrap();

      setProgress({
        total: response.totalRecipients,
        sent: response.sentCount,
        failed: response.totalRecipients - response.sentCount,
      });

      setTimeout(() => {
        setFormData({
          name: "",
          subject: "",
          smtpId: "",
          message: "",
          recipients: [],
        });
        setAttachments([]);
        setErrors({});
        setProgress(null);
        toast.success("Campaign sent successfully!");
      }, 2000);
    } catch (err: any) {
      setProgress(null);
      toast.error(err?.data?.message || "Failed to send campaign");
    }
  };

  return (
    <div className="flex flex-col space-y-6 min-h-[500px]">
      {/* Campaign Form Card */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col flex-1">
        {/* Form Header */}
        <div className="border-b border-gray-700 p-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Send className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Email Campaign</h2>
              <p className="text-gray-400 text-sm mt-1">
                Send bulk emails to your contacts
              </p>
            </div>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campaign Name */}
            <div>
              <label className="text-gray-300 text-sm font-medium">Campaign Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter campaign name"
                className={`w-full mt-1 bg-gray-700 border text-white px-3 py-2 rounded-lg ${
                  errors.name ? "border-red-500" : "border-gray-600"
                } focus:border-yellow-500 focus:outline-none transition-colors`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Subject + Sender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subject */}
              <div>
                <label className="text-gray-300 text-sm font-medium">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Email subject line"
                  className={`w-full mt-1 bg-gray-700 border text-white px-3 py-2 rounded-lg ${
                    errors.subject ? "border-red-500" : "border-gray-600"
                  } focus:border-yellow-500 focus:outline-none transition-colors`}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              {/* Sender */}
              <div>
                <label className="text-gray-300 text-sm font-medium">Sender Email</label>
                <select
                  name="smtpId"
                  value={formData.smtpId}
                  onChange={handleChange}
                  className={`w-full mt-1 bg-gray-700 border text-white px-3 py-2 rounded-lg ${
                    errors.smtpId ? "border-red-500" : "border-gray-600"
                  } focus:border-yellow-500 focus:outline-none transition-colors`}
                >
                  <option value="">Select sender</option>
                  {data?.map((smtp) => (
                    <option key={smtp._id} value={smtp._id}>
                      {smtp.fromEmail} ({smtp.username})
                    </option>
                  ))}
                </select>
                {errors.smtpId && <p className="text-red-500 text-sm mt-1">{errors.smtpId}</p>}
              </div>
            </div>

            {/* Recipients Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm font-medium">
                  Select Recipients ({formData.recipients.length} selected)
                </label>
                {emailDirectory?.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {formData.recipients.length === emailDirectory.length ? "Deselect All" : "Select All"}
                  </button>
                )}
              </div>

              <div className={`max-h-48 bg-gray-700 border rounded-lg overflow-y-auto ${
                errors.recipients ? "border-red-500" : "border-gray-600"
              }`}>
                {emailDirectory?.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No emails found in directory
                  </div>
                ) : (
                  <div className="p-3 space-y-2">
                    {emailDirectory?.map((e: EmailItem) => (
                      <label
                        key={e._id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-600/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.recipients.includes(e.email)}
                          onChange={() => toggleRecipient(e.email)}
                          className="rounded border-gray-500 bg-gray-600 text-yellow-500 focus:ring-yellow-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">
                            {e.name || "Unnamed Contact"}({e.email})
                          </div>
                          
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {errors.recipients && <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>}
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm font-medium">Message</label>
                <span className="text-xs text-gray-400">
                  {formData.message.length} characters
                </span>
              </div>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your email message here..."
                className={`w-full bg-gray-700 border text-white px-3 py-2 rounded-lg ${
                  errors.message ? "border-red-500" : "border-gray-600"
                } focus:border-yellow-500 focus:outline-none transition-colors`}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            {/* Attachments */}
            <div>
              <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <Paperclip size={16} />
                Attachments
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) setAttachments(Array.from(e.target.files));
                }}
                className="w-full mt-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
              />
              {attachments.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {attachments.length} file(s) selected
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-yellow-500 hover:bg-yellow-600 py-3 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {sending ? "Sending..." : "Send Campaign"}
            </button>
          </form>
        </div>
      </div>

      {/* Progress Overlay */}
      {progress && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-80">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Sending Campaign...</h3>
              <p className="text-gray-300 text-sm">
                Total: {progress.total} | Sent: {progress.sent} | Failed: {progress.failed}
              </p>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{
                  width: `${(progress.sent / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Best Practices Card */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 flex-shrink-0">
        <h3 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
          <Shield size={18} className="text-yellow-500" />
          Email Campaign Best Practices
        </h3>
        <ul className="text-gray-300 text-sm space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Keep subject lines under 60 characters for better open rates</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Personalize emails with recipient names when possible</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Test your emails across different clients and devices</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Monitor bounce rates and clean your email list regularly</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CampaignForm;