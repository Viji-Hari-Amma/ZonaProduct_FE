import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../../../components/Auth/FormInput";
import SubmitButton from "../../../components/Buttons/SubmitButton";
import AuthLayout from "../../../layout/AuthLayout";
import { useState } from "react";
import { resetPassword } from "../../../services/AuthService/AuthService";
import { BiLockOpen } from "react-icons/bi";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);

  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid or missing reset token. Please try again.");
      return;
    }

    const payload = {
      token,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    };

    setLoading(true);
    try {
      await resetPassword(payload);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      description="Create a new password for your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div className="relative">
          <FormInput
            label="New Password"
            name="new_password"
            type="password"
            placeholder="Enter new password"
            register={register}
            watch={watch}
            errors={errors}
            required
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
          />

          <BiLockOpen
            className="absolute top-[41px] left-2 border-r-2 p-1"
            size={33}
          />
        </div>

        <div className="relative">
          <FormInput
            label="Confirm Password"
            name="confirm_password"
            type="password"
            placeholder="Confirm new password"
            register={register}
            watch={watch}
            errors={errors}
            required
            compareWith="new_password"
          />
          <BiLockOpen
            className="absolute top-[41px] left-2 border-r-2 p-1"
            size={33}
          />
        </div>
        <div className="flex items-center justify-center">
          <SubmitButton
            text="Reset Password"
            isLoading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
