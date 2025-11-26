import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useRegisterUserMutation, useVerifySignupOtpMutation, useResendSignupOtpMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface SignupState {
  name: string;
  email: string;
  password: string;
  phone: string;
  otp: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  otp?: string;
}

const SignupModal = ({ open, onClose, onSwitchToLogin }: SignupModalProps) => {
  // single state to persist all form details + OTP
  const [signupData, setSignupData] = useState<SignupState>({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showOtpView, setShowOtpView] = useState(false);

  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [verifySignupOtp, { isLoading: isVerifying }] = useVerifySignupOtpMutation();
  const [resendSignupOtp, { isLoading: isResending }] = useResendSignupOtpMutation();

  if (!open) return null;

  const validateSignup = (): boolean => {
    const newErrors: FormErrors = {};
    if (!signupData.name.trim()) newErrors.name = "Full name is required.";
    if (!signupData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(signupData.email)) newErrors.email = "Enter a valid email.";
    if (!signupData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[0-9]{10}$/.test(signupData.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!signupData.password.trim()) newErrors.password = "Password is required.";
    else if (signupData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateSignup()) return;

    try {
      await registerUser({
        username: signupData.name,
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone,
      }).unwrap();

      toast.success("Signup OTP sent successfully!");
      setShowOtpView(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send OTP!");
    }
  };

  const handleVerifyOtp = async () => {
    if (!signupData.otp.trim()) {
      setErrors({ otp: "Enter OTP" });
      return;
    }

    try {
      await verifySignupOtp({
        email: signupData.email,
        otp: signupData.otp,
        username: signupData.name,
        password: signupData.password,
        phone: signupData.phone,
      }).unwrap();

      toast.success("Email verified successfully!");
      setSignupData({ name: "", email: "", password: "", phone: "", otp: "" });
      setShowOtpView(false);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP!");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendSignupOtp(signupData.email).unwrap();
      toast.success("OTP resent successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP!");
    }
  };

  const handleSwitchToLogin = () => {
    onClose();
    setTimeout(onSwitchToLogin, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-lg">
      <div className="relative bg-gradient-to-b from-gray-800/95 to-gray-900/95 border border-yellow-500/40 shadow-[0_0_30px_#f59e0b33] rounded-2xl p-8 w-full max-w-md text-white">
        
        {/* Close */}
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white transition" onClick={onClose}>
          ✕
        </button>

        {!showOtpView ? (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-center">
              Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300 font-bold">LeadReachXpro</span>
            </h2>

            <form onSubmit={handleSignupSubmit}>
              <div className="mb-4">
                <input type="text" placeholder="Full Name"
                  className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 ${errors.name ? "ring-red-500" : "focus:ring-yellow-500"}`}
                  value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <input type="email" placeholder="Email"
                  className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 ${errors.email ? "ring-red-500" : "focus:ring-yellow-500"}`}
                  value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <input type="text" placeholder="Phone Number"
                  className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 ${errors.phone ? "ring-red-500" : "focus:ring-yellow-500"}`}
                  value={signupData.phone} onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })} />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="mb-6">
                <input type="password" placeholder="Password"
                  className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 ${errors.password ? "ring-red-500" : "focus:ring-yellow-500"}`}
                  value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <Button type="submit" disabled={isRegistering} className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg font-semibold py-3 rounded-lg transition">
                {isRegistering ? "Sending OTP..." : "Create Account"}
              </Button>
            </form>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button className="absolute top-3 left-3 text-gray-400 hover:text-white font-medium" onClick={() => setShowOtpView(false)}>
              ← Back
            </button>

            <h2 className="text-2xl font-semibold text-center mb-4">Verify Your Email</h2>
            <p className="text-gray-400 text-center mb-4">Enter the OTP sent to your email.</p>

            <input type="text" value={signupData.email} readOnly
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed" />

            <input type="text" placeholder="Enter OTP"
              className={`w-full p-3 mb-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 focus:outline-none focus:ring-2 ${errors.otp ? "ring-red-500" : "focus:ring-yellow-500"}`}
              value={signupData.otp} onChange={(e) => setSignupData({ ...signupData, otp: e.target.value })} />
            {errors.otp && <p className="text-red-400 text-sm mb-2">{errors.otp}</p>}

            <div className="flex gap-2 mb-4">
              <Button onClick={handleVerifyOtp} disabled={isVerifying} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 rounded-lg">
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button onClick={handleResendOtp} disabled={isResending} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg">
                {isResending ? "Resending..." : "Resend OTP"}
              </Button>
            </div>
          </>
        )}

        {!showOtpView && (
          <p className="text-sm mt-4 text-center text-gray-400">
            Already have an account? <span className="text-yellow-500 cursor-pointer hover:underline font-medium" onClick={handleSwitchToLogin}>Login</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupModal;
