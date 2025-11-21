import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import toast, { Toaster } from "react-hot-toast";

const SignupModal = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  if (!open) return null;

  // ---------------------------
  // VALIDATION HANDLER
  // ---------------------------
  const validate = () => {
    let newErrors = {};

    if (!form.name || form.name.trim() === "") {
      newErrors.name = "Full name is required.";
    }

    if (!form.email || form.email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!form.password || form.password.trim() === "") {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const res = await registerUser({
        username: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();

      toast.success("Account created successfully!");
      setForm({ name: "", email: "", password: "" });
      setTimeout(onClose, 1500);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to register user!");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-lg">
        <div className="relative bg-gradient-to-b from-gray-800/95 to-gray-900/95 border border-yellow-500/40 shadow-[0_0_30px_#f59e0b33] rounded-2xl p-8 w-full max-w-md text-white">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Join{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300 font-bold">
              LeadReachXpro
            </span>
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Full Name"
                className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 
                focus:outline-none focus:ring-2 ${
                  errors.name ? "ring-red-500" : "focus:ring-yellow-500"
                } border border-gray-700`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onBlur={validate}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 
                focus:outline-none focus:ring-2 ${
                  errors.email ? "ring-red-500" : "focus:ring-yellow-500"
                } border border-gray-700`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={validate}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 
                focus:outline-none focus:ring-2 ${
                  errors.password ? "ring-red-500" : "focus:ring-yellow-500"
                } border border-gray-700`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onBlur={validate}
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg font-semibold py-3 rounded-lg transition"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-sm mt-4 text-center text-gray-400">
            Already have an account?{" "}
            <span
              className="text-yellow-500 cursor-pointer hover:underline font-medium"
              onClick={onClose}
            >
              Login
            </span>
          </p>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              Start sending bulk emails with your personal SMTP and SMS with Android gateway. 
              Free plan includes 500 emails & 100 SMS/month.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupModal;