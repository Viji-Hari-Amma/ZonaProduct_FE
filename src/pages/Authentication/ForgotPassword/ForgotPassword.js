import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import FormInput from "../../../components/Auth/FormInput";
import SubmitButton from "../../../components/Buttons/SubmitButton";
import AuthLayout from "../../../layout/AuthLayout";
import { forgotPassword } from "../../../services/AuthService/AuthService";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await forgotPassword(formData.email);

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      toast.success("Please Check Your Email for Reset Link");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email and we'll send you a link to reset your password"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            register={register}
            errors={errors}
            required
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
        <div className="w-full flex items-center justify-center">
          <SubmitButton
            text="Reset Password"
            isLoading={loading}
            disabled={loading}
          />
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/Login"
            className="text-[#8B4513] hover:text-[#A0522D] underline font-medium text-sm"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
