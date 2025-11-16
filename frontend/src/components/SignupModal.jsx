import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRegisterUserMutation } from "@/redux/api/authApi"; // 👈 Your RTK Query API
import toast, { Toaster } from "react-hot-toast";

const SignupModal = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required!");
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-lg">
        <div className="relative bg-gradient-to-b from-[#161A29]/95 to-[#0B0F19]/95 border border-[#6C63FF]/40 shadow-[0_0_30px_#6C63FF33] rounded-2xl p-8 w-full max-w-md text-white">
          {/* ✕ Close button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            onClick={onClose}
          >
            ✕
          </button>

          {/* 🧠 Title */}
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Join <span className="text-[#6C63FF] font-bold">ReachIQ</span>
          </h2>

          {/* 📝 Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-4 p-3 rounded-lg bg-[#191D2F] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-3 rounded-lg bg-[#191D2F] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 p-3 rounded-lg bg-[#191D2F] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {/* 🚀 Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-lg font-semibold py-3 rounded-lg transition"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          {/* 👇 Footer Text */}
          <p className="text-sm mt-4 text-center text-gray-400">
            Already part of ReachIQ?{" "}
            <span
              className="text-[#9C8CFF] cursor-pointer hover:underline"
              onClick={onClose}
            >
              Login
            </span>
          </p>
        </div>
      </div>

    </>
  );
};

export default SignupModal;
