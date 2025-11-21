import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { 
  useForgotPasswordMutation, 
  useVerifyOtpMutation, 
  useResetPasswordMutation,
  useResendOtpMutation 
} from "@/redux/api/authApi";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface FormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ForgotPasswordModal = ({ open, onClose, onSwitchToLogin }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<number>(1); // 1: Email, 2: OTP, 3: New Password
  const [form, setForm] = useState<FormData>({ 
    email: "", 
    otp: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // RTK Query mutations
  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();

  const isLoading = isSendingOtp || isVerifyingOtp || isResettingPassword || isResendingOtp;

  if (!open) return null;

  const validateEmail = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email || form.email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.otp || form.otp.trim() === "") {
      newErrors.otp = "OTP is required.";
    } else if (form.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.newPassword || form.newPassword.trim() === "") {
      newErrors.newPassword = "New password is required.";
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters.";
    }

    if (!form.confirmPassword || form.confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOTP = async (): Promise<void> => {
    if (!validateEmail()) return;

    try {
      const result = await forgotPassword(form.email).unwrap();
      
      if (result.success) {
        toast.success(result.message || "OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async (): Promise<void> => {
    if (!validateOTP()) return;

    try {
      const result = await verifyOtp({ 
        email: form.email, 
        otp: form.otp 
      }).unwrap();
      
      if (result.success) {
        toast.success(result.message || "OTP verified successfully!");
        setStep(3);
      } else {
        toast.error(result.message || "Failed to verify OTP");
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(error?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    if (!validatePassword()) return;

    try {
      const result = await resetPassword({
        email: form.email,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      }).unwrap();
      
      if (result.success) {
        toast.success(result.message || "Password reset successfully!");
        setTimeout(() => {
          onClose();
          onSwitchToLogin();
        }, 1500);
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  const handleResendOTP = async (): Promise<void> => {
    try {
      const result = await resendOtp(form.email).unwrap();
      
      if (result.success) {
        toast.success(result.message || "New OTP sent successfully!");
      } else {
        toast.error(result.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(error?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleSwitchToLogin = (): void => {
    onClose();
    setTimeout(onSwitchToLogin, 300);
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '');
    setForm({ ...form, otp: value });
  };

  const resetForm = (): void => {
    setForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setStep(1);
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-lg">
      <div className="relative bg-gradient-to-b from-gray-800/95 to-gray-900/95 border border-yellow-500/40 shadow-[0_0_30px_#f59e0b33] rounded-2xl p-8 w-full max-w-md text-white">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          onClick={handleClose}
        >
          ✕
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center">
          Reset Password
        </h2>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div>
            <p className="text-gray-400 mb-6 text-center">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
            
            <div className="mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 
                focus:outline-none focus:ring-2 ${
                  errors.email ? "ring-red-500" : "focus:ring-yellow-500"
                } border border-gray-700`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={validateEmail}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <Button
              onClick={handleRequestOTP}
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg font-semibold py-3 rounded-lg transition"
            >
              {isSendingOtp ? "Sending OTP..." : "Send OTP"}
            </Button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div>
            <p className="text-gray-400 mb-6 text-center">
              Enter the 6-digit OTP sent to {form.email}
            </p>
            
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter OTP"
                maxLength={6}
                className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 
                focus:outline-none focus:ring-2 ${
                  errors.otp ? "ring-red-500" : "focus:ring-yellow-500"
                } border border-gray-700 text-center text-xl tracking-widest`}
                value={form.otp}
                onChange={handleOtpChange}
                onBlur={validateOTP}
              />
              {errors.otp && <p className="text-red-400 text-sm mt-1">{errors.otp}</p>}
            </div>

            <div className="mb-4 text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResendingOtp}
                className="text-yellow-500 hover:text-yellow-400 text-sm font-medium disabled:opacity-50"
              >
                {isResendingOtp ? "Resending OTP..." : "Didn't receive OTP? Resend"}
              </button>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div>
            <p className="text-gray-400 mb-6 text-center">
              Create your new password
            </p>
            
            <div className="mb-4">
              <input
                type="password"
                placeholder="New Password"
                className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 
                focus:outline-none focus:ring-2 ${
                  errors.newPassword ? "ring-red-500" : "focus:ring-yellow-500"
                } border border-gray-700`}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                onBlur={validatePassword}
              />
              {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>}
            </div>

            <div className="mb-6">
              <input
                type="password"
                placeholder="Confirm New Password"
                className={`w-full p-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 
                focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? "ring-red-500" : "focus:ring-yellow-500"
                } border border-gray-700`}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                onBlur={validatePassword}
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                disabled={isLoading}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
              >
                {isResettingPassword ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </div>
        )}

        {/* Back to Login */}
        <p className="text-sm mt-6 text-center text-gray-400">
          Remember your password?{" "}
          <span
            className="text-yellow-500 cursor-pointer hover:underline font-medium"
            onClick={handleSwitchToLogin}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;