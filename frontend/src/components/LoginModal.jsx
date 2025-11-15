import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLoginUserMutation } from "@/redux/api/authApi";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ open, onClose }) => {
  if (!open) return null;

  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // ---------------------------
  // VALIDATION HANDLER
  // ---------------------------
  const validate = () => {
    let newErrors = {};

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

  // ---------------------------
  // SUBMIT HANDLER
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors!");
      return;
    }

    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      }).unwrap();

      // Save token & user in localStorage
      localStorage.setItem("reachiq_user", JSON.stringify(res));

      toast.success("Login successful!");

      // Close modal immediately
      onClose();

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/ReachIQ/dashboard");
      }, 500);

      // Optional cleanup
      setForm({ email: "", password: "" });
      setErrors({});
      
    } catch (err) {
      toast.error(err?.data?.message || "Invalid email or password!");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-lg">
        <div className="relative bg-gradient-to-b from-[#161A29]/95 to-[#0B0F19]/95 border border-[#6C63FF]/40 shadow-[0_0_30px_#6C63FF33] rounded-2xl p-8 w-full max-w-md text-white">

          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            onClick={onClose}
          >
            ✕
          </button>

          <h2 className="text-3xl font-semibold mb-6 text-center">
            Login to <span className="text-[#6C63FF] font-bold">ReachIQ</span>
          </h2>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="mb-5">
              <input
                type="email"
                placeholder="Email"
                className={`w-full p-3 rounded-lg bg-[#191D2F] text-gray-300 placeholder-gray-500 
                focus:outline-none focus:ring-2 ${
                  errors.email ? "ring-red-500" : "focus:ring-[#6C63FF]"
                }`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={validate}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                className={`w-full p-3 rounded-lg bg-[#191D2F] text-gray-300 placeholder-gray-500 
                focus:outline-none focus:ring-2 ${
                  errors.password ? "ring-red-500" : "focus:ring-[#6C63FF]"
                }`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onBlur={validate}
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-lg font-semibold py-3 rounded-lg transition"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-sm mt-4 text-center text-gray-400">
            Don’t have an account?{" "}
            <span
              className="text-[#9C8CFF] cursor-pointer hover:underline"
              onClick={onClose}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default LoginModal;
