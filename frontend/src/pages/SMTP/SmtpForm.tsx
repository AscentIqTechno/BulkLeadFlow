import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import {
  useAddSmtpMutation,
  useUpdateSmtpMutation,
} from "@/redux/api/smtpApi";

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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      host: "",
      port: 0,
      username: "",
      password: "",
      fromEmail: "",
      secure: false,
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
  }, [editData]);

  const onSubmit = async (formData) => {
    try {
      if (editData) {
        // ---- UPDATE ----
        await updateSmtp({ id: editData._id, body: formData }).unwrap();
        toast.success("SMTP updated successfully");
      } else {
        // ---- CREATE ----
        await addSmtp(formData).unwrap();
        toast.success("SMTP configuration saved!");
      }

      reset();
      onSuccess?.(); // refresh list
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">
        {editData ? "Edit SMTP Configuration" : "Add SMTP Configuration"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Host */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Host</label>
          <input
            {...register("host")}
            placeholder="smtp.gmail.com"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          {errors.host && <p className="text-red-400 text-xs">{errors.host.message}</p>}
        </div>

        {/* Port */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Port</label>
          <input
            type="number"
            {...register("port")}
            placeholder="465 or 587"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          {errors.port && <p className="text-red-400 text-xs">{errors.port.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Username</label>
          <input
            {...register("username")}
            placeholder="your@email.com"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          {errors.username && <p className="text-red-400 text-xs">{errors.username.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
        </div>

        {/* From Email */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">From Email</label>
          <input
            type="email"
            {...register("fromEmail")}
            placeholder="noreply@yourdomain.com"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          {errors.fromEmail && <p className="text-red-400 text-xs">{errors.fromEmail.message}</p>}
        </div>

        {/* Secure Checkbox */}
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("secure")} className="accent-blue-500" />
          <span className="text-gray-300 text-sm">Use Secure Connection (SSL/TLS)</span>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full mt-3">
          {editData ? "Update SMTP" : "Save SMTP"}
        </Button>
      </form>
    </div>
  );
};

export default SmtpForm;
