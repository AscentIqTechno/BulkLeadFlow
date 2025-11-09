import { useState } from "react";
import { Button } from "@/components/ui/button";

const LoginModal = ({ open, onClose }) => {
  if (!open) return null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
                 bg-[#0B0F19]/80 backdrop-blur-lg animate-fadeIn"
    >
      <div
        className="relative bg-gradient-to-b from-[#161A29]/95 to-[#0B0F19]/95 
                   border border-[#6C63FF]/40 shadow-[0_0_25px_#6C63FF33] 
                   rounded-2xl p-8 w-full max-w-md text-white"
      >
        {/* Close button - top right */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white 
                     transition-colors text-xl font-light"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to <span className="text-[#6C63FF]">ReachIQ</span>
        </h2>

        {/* Input Fields */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-md bg-[#101426]/90 text-white 
                     placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-[#6C63FF]/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 p-3 rounded-md bg-[#101426]/90 text-white 
                     placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-[#6C63FF]/50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit Button */}
        <Button className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-semibold py-3">
          Login
        </Button>

        {/* Signup Link */}
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
  );
};

export default LoginModal;
