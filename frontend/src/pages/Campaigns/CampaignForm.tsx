// export default CampaignForm;
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

interface CampaignFormProps {
  data: SmtpData[];
}

interface FormDataState {
  name: string;
  subject: string;
  smtpId: string;
  recipients: string;
  message: string;
}

interface FormErrors {
  name?: string;
  subject?: string;
  smtpId?: string;
  recipients?: string;
  message?: string;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ data }) => {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    subject: "",
    smtpId: "",
    recipients: "",
    message: "",
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [progress, setProgress] = useState<{ total: number; sent: number; failed: number } | null>(null);

  const [createCampaign] = useCreateCampaignMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const validateFields = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Campaign Name is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.smtpId) newErrors.smtpId = "Sender Email is required";
    if (!formData.recipients.trim()) newErrors.recipients = "At least one recipient is required";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    const recipientList = formData.recipients
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r);

    if (recipientList.length === 0) {
      setErrors({ recipients: "At least one recipient is required" });
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("subject", formData.subject);
    payload.append("smtpId", formData.smtpId);
    payload.append("message", formData.message);

    // Append each recipient
    recipientList.forEach((r) => payload.append("recipients[]", r));

    // Attachments (optional)
    attachments.forEach((file) => payload.append("attachments", file));

    // Show progress modal
    setProgress({ total: recipientList.length, sent: 0, failed: 0 });

    try {
      const response: any = await createCampaign(payload).unwrap();

      // Update progress from backend
      setProgress({
        total: response.totalRecipients,
        sent: response.sentCount,
        failed: response.totalRecipients - response.sentCount,
      });

      // Reset form after a short delay
      setTimeout(() => {
        setFormData({ name: "", subject: "", smtpId: "", recipients: "", message: "" });
        setAttachments([]);
        setErrors({});
        setProgress(null);
      }, 3000);
    } catch (err: any) {
      console.error(err?.data?.message || err);
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

        {/* Subject & Sender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Recipients */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Recipients</label>
          <input
            type="text"
            name="recipients"
            value={formData.recipients}
            onChange={handleChange}
            placeholder="comma,separated,emails@domain.com"
            className={`w-full p-2 rounded bg-gray-800 border ${
              errors.recipients ? "border-red-500" : "border-gray-700"
            } text-white`}
          />
          {errors.recipients && <p className="text-red-500 text-xs mt-1">{errors.recipients}</p>}
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
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          {attachments.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{attachments.length} file(s) selected</p>
          )}
        </div>

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
                style={{ width: `${(progress.sent / progress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignForm;
