import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useVerifySignupOtpMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  email: string;
  onClose: () => void;
}

const SignupOtpModal = ({ open, email, onClose }: Props) => {
  const [otp, setOtp] = useState("");
  const [verifySignupOtp, { isLoading }] = useVerifySignupOtpMutation();

  if (!open) return null;

  const handleVerify = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      await verifySignupOtp({ email, otp }).unwrap();
      toast.success("Email verified successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-lg">
      <div className="relative bg-gradient-to-b from-gray-800/95 to-gray-900/95 
        border border-yellow-500/40 shadow-[0_0_30px_#f59e0b33] rounded-2xl p-8 
        w-full max-w-md text-white">

        <h2 className="text-2xl font-semibold text-center mb-4">
          Verify Your Email
        </h2>

        <p className="text-gray-400 text-center mb-4">
          Enter the OTP sent to your email.
        </p>

        {/* Email (read-only) */}
        <input
          type="text"
          value={email}
          readOnly
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-gray-400 
          border border-gray-700 cursor-not-allowed"
        />

        {/* OTP */}
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-gray-300 
          border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 
          font-semibold py-3 rounded-lg"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>

        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

      </div>
    </div>
  );
};

export default SignupOtpModal;
