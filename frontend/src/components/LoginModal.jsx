import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLoginUserMutation } from "@/redux/api/authApi";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";

const LoginModal = ({ open, onClose }) => {
  if (!open) return null;

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      }).unwrap();

      // Save token and user in Redux
      dispatch(
        setCredentials({
          user: res,
          token: res.accessToken,
        })
      );

      // (Optional) Save to localStorage
      localStorage.setItem("leadreachxpro_user", JSON.stringify(res));

      toast.success("Login successful!");

      navigate("/dashboard");

    } catch (err) {
      toast.error(err?.data?.message || "Invalid login");
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

          <h2 className="text-3xl font-semibold mb-6 text-center">
            Login to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300 font-bold">
              LeadReachXpro
            </span>
          </h2>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="mb-5">
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

            {/* PASSWORD */}
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg font-semibold py-3 rounded-lg transition"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-sm mt-4 text-center text-gray-400">
            Don't have an account?{" "}
            <span
              className="text-yellow-500 cursor-pointer hover:underline font-medium"
              onClick={onClose}
            >
              Sign up
            </span>
          </p>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              Access your bulk email & SMS campaigns. Manage SMTP configurations and Android gateways.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;