import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../../../layout/AuthLayout";
import FormInput from "../../../components/Auth/FormInput";
import SubmitButton from "../../../components/Buttons/SubmitButton";
import { changePassword } from "../../../services/AuthService/AuthService";
import { BiLockOpen } from "react-icons/bi";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/Login");
      return;
    }

    if (data.old_password === data.new_password) {
      setError("new_password", {
        type: "manual",
        message: "New password must be different from current password",
      });
      return;
    }

    if (data.new_password !== data.confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(
        {
          old_password: data.old_password,
          new_password: data.new_password,
        },
        token
      );

      if (response.status === 200) {
        toast.success(response.message || "Password changed successfully");
        navigate("/profile");
      } else {
        toast.error(response.error || "Password change failed");
      }
    } catch (error) {
      console.error("Change password error:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Password change failed. Please try again.";
      toast.error(errorMessage);

      if (error.response?.data?.old_password) {
        setError("old_password", {
          type: "server",
          message: error.response.data.old_password,
        });
      }

      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/Login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Change Password"
      description="Secure your account by updating your password regularly"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <FormInput
            label="Current Password"
            name="old_password"
            type="password"
            placeholder="Enter your current password"
            register={register}
            errors={errors}
            required
            validation={{
              required: "Current password is required",
            }}
          />
          <BiLockOpen
            className="absolute top-[41px] left-2 border-r-2 p-1"
            size={33}
          />
        </div>

        <div className="relative">
          <FormInput
            label="New Password"
            name="new_password"
            type="password"
            placeholder="Enter your new password"
            register={register}
            errors={errors}
            required
            validation={{
              required: "New password is required",
              validate: (value) => {
                if (value === watch("old_password")) {
                  return "New password must be different from current password";
                }
                
                const hasMinLength = value.length >= 8;
                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumber = /\d/.test(value);
                const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

                if (!hasMinLength) return "At least 8 characters required";
                if (!hasUpperCase) return "At least one uppercase letter required";
                if (!hasLowerCase) return "At least one lowercase letter required";
                if (!hasNumber) return "At least one number required";
                if (!hasSpecialChar) return "At least one special character required";

                return true;
              },
            }}
          />
          <BiLockOpen
            className="absolute top-[41px] left-2 border-r-2 p-1"
            size={33}
          />
        </div>

        <div className="relative">
          <FormInput
            label="Confirm New Password"
            name="confirm_password"
            type="password"
            placeholder="Confirm your new password"
            register={register}
            errors={errors}
            required
            validation={{
              required: "Please confirm your new password",
              validate: (value) =>
                value === watch("new_password") || "Passwords do not match",
            }}
          />
          <BiLockOpen
            className="absolute top-[41px] left-2 border-r-2 p-1"
            size={33}
          />
        </div>

        <div className="flex justify-center items-center mt-6">
          <SubmitButton
            text="Update Password"
            disabled={loading || Object.keys(errors).length > 0}
            isLoading={loading}
          />
        </div>
      </form>
    </AuthLayout>
  );
};

export default ChangePassword;
