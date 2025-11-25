import React, { useState } from "react";
import { 
  useCreatePlanMutation,
  useUpdatePlanMutation
} from "@/redux/api/planApi";
import { X } from "lucide-react";

const PlanFormModal = ({ initialData, onClose, onSuccess }) => {
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();

  const isEdit = Boolean(initialData);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    currency: initialData?.currency || "INR",
    interval: initialData?.interval || "month",
    description: initialData?.description || "",
    features: initialData?.features?.join("\n") || "",
    emailsPerMonth: initialData?.emailsPerMonth ?? 0,
    smsPerMonth: initialData?.smsPerMonth ?? 0,
    smtpConfigs: initialData?.smtpConfigs ?? 0,
    androidGateways: initialData?.androidGateways ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      features: form.features
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        await updatePlan({ id: initialData._id, ...payload }).unwrap();
      } else {
        await createPlan(payload).unwrap();
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save plan");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md relative shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Plan" : "Create Plan"}
          </h2>
          <button onClick={onClose}>
            <X className="text-white hover:text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-black space-y-4">
          
          <input
            name="name"
            placeholder="Plan Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="price"
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="interval"
            value={form.interval}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded h-20"
          />

          <textarea
            name="features"
            placeholder="Enter one feature per line"
            value={form.features}
            onChange={handleChange}
            className="w-full border p-2 rounded h-28"
          />

          {/* Limits */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="emailsPerMonth"
              type="number"
              placeholder="Emails / Month"
              value={form.emailsPerMonth}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="smsPerMonth"
              type="number"
              placeholder="SMS / Month"
              value={form.smsPerMonth}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="smtpConfigs"
              type="number"
              placeholder="SMTP Configs"
              value={form.smtpConfigs}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="androidGateways"
              type="number"
              placeholder="Android Gateways"
              value={form.androidGateways}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            className="px-4 py-2 border rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            onClick={handleSubmit}
          >
            {isEdit ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanFormModal;
