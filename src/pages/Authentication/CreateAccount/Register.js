import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import FormInput from "../../../components/Auth/FormInput";
import SubmitButton from "../../../components/Buttons/SubmitButton";
import AuthLayout from "../../../layout/AuthLayout";
import { MdOutlineMail } from "react-icons/md";
import { BiLockOpen } from "react-icons/bi";
import { registerUser } from "../../../services/AuthService/AuthService";
import { LuUserRound } from "react-icons/lu";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const OnSubmit = async (data) => {
    if (!executeRecaptcha) {
      toast.error("Captcha service unavailable");
      return;
    }

    if (!data.agree_to_terms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    if (!mobile || mobile.length < 10) {
      toast.error("Please enter a valid mobile number with country code");
      return;
    }

    try {
      setLoading(true);
      const token = await executeRecaptcha("register_submit");

      const payload = {
        ...data,
        mobile: `+${mobile}`,
        captcha: token,
        agree_to_terms: true,
      };

      await registerUser(payload);
      localStorage.setItem("email", data.email);

      setTimeout(() => {
        toast.success("Registration successful! Please verify your email.");
        navigate("/Verify-OTP");
      }, 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Get started with your free account"
    >
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(OnSubmit)}>
        {/* Email Field */}
        <div className="relative">
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required={true}
            register={register}
            errors={errors}
            validation={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address"
              }
            }}
          />
          <MdOutlineMail
            className="absolute top-[42px] left-2 border-r-2 p-1"
            size={32}
          />
        </div>

        {/* Name Fields */}
        <div className="flex items-center justify-between">
          <div className="w-[48%] relative">
            <FormInput
              label="First Name"
              name="first_name"
              type="text"
              placeholder="John"
              required={true}
              register={register}
              errors={errors}
              validation={{
                maxLength: {
                  value: 15,
                  message: "First name must not exceed 15 characters"
                },
                pattern: {
                  value: /^[A-Za-z\s]*$/,
                  message: "First name should contain only letters"
                }
              }}
            />
            <LuUserRound
              className="absolute top-[42px] left-2 border-r-2 p-1"
              size={30}
            />
          </div>
          <div className="w-[48%] relative">
            <FormInput
              label="Last Name"
              name="last_name"
              type="text"
              placeholder="Doe"
              required={true}
              register={register}
              errors={errors}
              validation={{
                maxLength: {
                  value: 15,
                  message: "Last name must not exceed 15 characters"
                },
                pattern: {
                  value: /^[A-Za-z\s]*$/,
                  message: "Last name should contain only letters"
                }
              }}
            />
            <LuUserRound
              className="absolute top-[42px] left-2 border-r-2 p-1"
              size={30}
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-md font-medium text-[#5A4633] mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            country={"in"}
            value={mobile}
            onChange={setMobile}
            inputStyle={{
              width: "100%",
              height: "45px",
            }}
            specialLabel=""
            inputProps={{
              name: "mobile",
              required: true,
            }}
          />
          {mobile && mobile.length < 10 && (
            <p className="mt-1 text-sm text-red-500">Please enter a valid mobile number</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required={true}
            register={register}
            errors={errors}
            validation={{
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
              }
            }}
            watch={watch}
          />
          <BiLockOpen
            className="absolute top-[41px] left-2 border-r-2 p-1"
            size={33}
          />
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <FormInput
            label="Confirm Password"
            name="confirm_password"
            type="password"
            placeholder="Confirm your password"
            required={true}
            register={register}
            errors={errors}
            watch={watch}
          />
          <BiLockOpen
            className="absolute top-[41px] left-2 border-r-2 p-1"
            size={33}
          />
        </div>

        {/* Agree to Terms */}
        <div className="flex items-start mt-2">
          <div className="flex items-center h-5">
            <input
              id="agree_to_terms"
              type="checkbox"
              className="w-4 h-4 text-[#8B4513] border-[#C9B39A] rounded-sm focus:ring-2 focus:ring-[#D2691E] focus:ring-offset-1 focus:border-[#D2691E]"
              {...register("agree_to_terms", {
                required: "You must agree to the terms",
              })}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="agree_to_terms"
              className="font-medium text-[#556B2F]"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-[#8B4513] hover:text-[#A0522D] underline"
              >
                Terms and Conditions
              </Link>
            </label>
            {errors.agree_to_terms && (
              <p className="mt-1 text-xs text-[#A94442]">
                {errors.agree_to_terms.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex items-center justify-center">
          <SubmitButton
            text="Create Account"
            isLoading={loading}
            disabled={loading}
          />
        </div>
      </form>
      <p className="mt-4 text-center font-bold text-[#556B2F]">
        Already have an account?{" "}
        <Link
          to="/Login"
          className="text-[#8B4513] hover:text-[#A0522D] underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

const Register = () => (
  <GoogleReCaptchaProvider
    reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
    scriptProps={{
      async: true,
      defer: true,
      appendTo: "head",
      nonce: undefined,
    }}
  >
    <RegisterForm />
  </GoogleReCaptchaProvider>
);

export default Register;
