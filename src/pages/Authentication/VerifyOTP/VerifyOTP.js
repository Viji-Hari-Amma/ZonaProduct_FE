import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../../components/Buttons/SubmitButton";
import AuthLayout from "../../../layout/AuthLayout";
import {
  verifyOtp,
  resendOtp,
} from "../../../services/AuthService/AuthService";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasteData)) return; // only digits allowed

    const digits = pasteData.split("").slice(0, 6); // max 6 digits
    const newOtp = [...otpValues];

    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtpValues(newOtp);

    // focus last filled input
    if (digits.length > 0 && inputsRef.current[digits.length - 1]) {
      inputsRef.current[digits.length - 1].focus();
    }
  };

  // Start timer on load
  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      setIsResendDisabled(true);
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const onSubmit = async () => {
    const otp = otpValues.join("");

    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    const payload = {
      email,
      otp,
    };

    try {
      setLoading(true);
      await verifyOtp(payload);
      toast.success("OTP verified successfully!");
      navigate("/Login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
      localStorage.removeItem("email");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(email);
      toast.success("OTP resent successfully.");
      setTimer(60);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      description={`We’ve sent a 6-digit verification code to ${email}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otpValues.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <div className="text-right w-[85%] mx-auto text-sm text-red-900">
          {isResendDisabled ? (
            <span>
              Resend OTP in <span className="font-semibold">{timer}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-[#8B4513] hover:text-[#A0522D] hover:underline font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center">
          <SubmitButton
            text="Verify OTP"
            isLoading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtp;
