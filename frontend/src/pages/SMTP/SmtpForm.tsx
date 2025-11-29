// SmtpForm.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  useAddSmtpMutation,
  useTestSmtpConnectionMutation,
  useUpdateSmtpMutation,
} from "@/redux/api/smtpApi";
import { Server, Lock, User, Mail, Hash, Shield } from "lucide-react";

// Validation Schema
const schema = yup.object().shape({
  host: yup.string().required("Host is required"),
  port: yup.number().typeError("Port must be a number").required("Port is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  fromEmail: yup.string().email("Invalid email").required("From email is required"),
  secure: yup.boolean(),
});

const SmtpForm = ({ editData, onSuccess }) => {
  const [addSmtp] = useAddSmtpMutation();
  const [updateSmtp] = useUpdateSmtpMutation();
  const [testSmtpConnection, { isLoading: testing }] = useTestSmtpConnectionMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      host: "",
      port: 587,
      username: "",
      password: "",
      fromEmail: "",
      secure: true,
    },
  });

  // When "editData" changes, fill the form
  useEffect(() => {
    if (editData) {
      setValue("host", editData.host);
      setValue("port", editData.port);
      setValue("username", editData.username);
      setValue("password", editData.password);
      setValue("fromEmail", editData.fromEmail);
      setValue("secure", editData.secure);
    } else {
      reset();
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (formData) => {
    try {
      if (editData) {
        console.log(formData, "formData")
        // ---- UPDATE ----
        await updateSmtp({ id: editData._id, data: formData }).unwrap();

        toast.success("SMTP configuration updated successfully");
      } else {
        // ---- CREATE ----
        await addSmtp(formData).unwrap();
        toast.success("SMTP configuration saved successfully!");
      }

      reset();
      onSuccess?.(); // refresh list
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const secure = watch("secure");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Host & Port Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Host */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-yellow-500" />
              SMTP Host
            </div>
          </label>
          <input
            {...register("host")}
            placeholder="smtp.gmail.com"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          {errors.host && <p className="text-red-400 text-sm mt-1">{errors.host.message}</p>}
        </div>

        {/* Port */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-blue-500" />
              Port
            </div>
          </label>
          <input
            type="number"
            {...register("port")}
            placeholder="465 or 587"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          {errors.port && <p className="text-red-400 text-sm mt-1">{errors.port.message}</p>}
          <p className="text-gray-400 text-xs mt-1">
            {secure ? "465 (SSL) recommended" : "587 (TLS) recommended"}
          </p>
        </div>
      </div>

      {/* Username & From Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} className="text-green-500" />
              Username
            </div>
          </label>
          <input
            {...register("username")}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
        </div>

        {/* From Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-purple-500" />
              From Email
            </div>
          </label>
          <input
            type="email"
            {...register("fromEmail")}
            placeholder="noreply@yourdomain.com"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          {errors.fromEmail && <p className="text-red-400 text-sm mt-1">{errors.fromEmail.message}</p>}
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-red-500" />
            Password / App Password
          </div>
        </label>
        <input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
        <p className="text-gray-400 text-xs mt-1">
          Use App Password for Gmail and other secured accounts
        </p>
      </div>

      {/* Secure Checkbox */}
      <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
        <div className="flex items-center gap-2 flex-1">
          <Shield size={16} className="text-yellow-500" />
          <span className="text-gray-300 font-medium">Secure Connection</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            {...register("secure")}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
        </label>
      </div>

      {/* Common Providers Quick Tips */}
      <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
        <h4 className="text-white font-medium mb-3 text-sm">Common SMTP Settings:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="text-gray-400">
            <span className="text-white font-medium">Gmail:</span> smtp.gmail.com:465 (SSL)
          </div>
          <div className="text-gray-400">
            <span className="text-white font-medium">Outlook:</span> smtp-mail.outlook.com:587 (TLS)
          </div>
          <div className="text-gray-400">
            <span className="text-white font-medium">Yahoo:</span> smtp.mail.yahoo.com:465 (SSL)
          </div>
          <div className="text-gray-400">
            <span className="text-white font-medium">iCloud:</span> smtp.mail.me.com:587 (TLS)
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={async () => {
            const data = watch();
            try {
              const res = await testSmtpConnection(data).unwrap();
              toast.success(res.message || "SMTP Works!");
            } catch (err) {
              toast.error(err?.data?.message || "Test failed");
            }
          }}
          className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
        >
          {testing ? "Testing..." : "Test"}
        </button>
      

        {editData && (
          <button
            type="button"
            onClick={() => {
              reset();
              onSuccess?.();
            }}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancel Edit
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              {editData ? "Updating..." : "Saving..."}
            </>
          ) : (
            editData ? "Update Configuration" : "Save Configuration"
          )}
        </button>
      </div>
    </form>
  );
};

export default SmtpForm;