import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateCampaignMutation } from "@/redux/api/campaignApi";

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

  const [createCampaign] = useCreateCampaignMutation();

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
      }, 2000);
    } catch {
      setProgress(null);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 relative">
      <h2 className="text-lg font-semibold text-white mb-4">Create New Campaign</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campaign Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Campaign Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 rounded bg-gray-800 border ${
              errors.name ? "border-red-500" : "border-gray-700"
            } text-white`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Subject + Sender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subject */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-gray-800 border ${
                errors.subject ? "border-red-500" : "border-gray-700"
              } text-white`}
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>

          {/* Sender */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sender Email</label>
            <select
              name="smtpId"
              value={formData.smtpId}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-gray-800 border ${
                errors.smtpId ? "border-red-500" : "border-gray-700"
              } text-white`}
            >
              <option value="">Select sender</option>
              {data?.map((smtp) => (
                <option key={smtp._id} value={smtp._id}>
                  {smtp.fromEmail} ({smtp.username})
                </option>
              ))}
            </select>
            {errors.smtpId && <p className="text-red-500 text-xs mt-1">{errors.smtpId}</p>}
          </div>
        </div>

        {/* EMAIL MULTI SELECT CHECKBOX UI */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Select Emails</label>

          <div className="max-h-48 overflow-y-auto border border-gray-700 rounded-lg p-2 bg-[#0F1A1E]">
            {emailDirectory?.length === 0 ? (
              <p className="text-gray-400">No emails found.</p>
            ) : (
              emailDirectory?.map((e) => (
                <label key={e._id} className="flex items-center gap-2 text-white mb-1">
                  <input
                    type="checkbox"
                    checked={formData.recipients.includes(e.email)}
                    onChange={() => toggleRecipient(e.email)}
                    className="accent-blue-600"
                  />
                 {e?.email}
                </label>
              ))
            )}
          </div>

          {errors.recipients && (
            <p className="text-red-500 text-xs mt-1">{errors.recipients}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Message</label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`w-full p-2 rounded bg-gray-800 border ${
              errors.message ? "border-red-500" : "border-gray-700"
            } text-white`}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Attachments</label>
          <input
            type="file"
            multiple
            onChange={(e) => {
              if (e.target.files) setAttachments(Array.from(e.target.files));
            }}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          {attachments.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{attachments.length} file(s) selected</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full mt-3">
          {progress ? "Sending..." : "Send Campaign"}
        </Button>
      </form>

      {/* Progress Modal */}
      {progress && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl text-white w-80 text-center">
            <p className="mb-2 font-semibold">Sending Campaign...</p>
            <p className="mb-2">
              Total: {progress.total} | Sent: {progress.sent} | Failed: {progress.failed}
            </p>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${(progress.sent / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignForm;
