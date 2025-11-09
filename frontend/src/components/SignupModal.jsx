import { useState } from "react";
import { Button } from "@/components/ui/button";

const SignupModal = ({ open, onClose }) => {
  if (!open) return null;

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
 <div
  className="fixed inset-0 z-50 flex items-center justify-center 
             bg-[#0B0F19]/80 backdrop-blur-lg animate-fadeIn"
>
  <div
    className="relative bg-gradient-to-b from-[#161A29]/95 to-[#0B0F19]/95 
               border border-[#6C63FF]/40 shadow-[0_0_30px_#6C63FF33] 
               rounded-2xl p-8 w-full max-w-md text-white transition-transform 
               duration-300 animate-scaleIn"
  >
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

        {/* 📝 Input fields */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-3 rounded-lg bg-[#191D2F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg bg-[#191D2F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-lg bg-[#191D2F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* 🚀 Button */}
        <Button className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-lg font-semibold py-3 rounded-lg transition">
          Create Account
        </Button>

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

      {/* ✨ Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SignupModal;
