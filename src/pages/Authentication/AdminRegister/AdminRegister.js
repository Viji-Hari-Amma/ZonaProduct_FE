import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormInput from "../../../components/Auth/FormInput";
import SubmitButton from "../../../components/Buttons/SubmitButton";
import AuthLayout from "../../../layout/AuthLayout";
import { MdOutlineMail } from "react-icons/md";
import { BiLockOpen } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { registerAdmin } from "../../../services/AuthService/AuthService";

const AdminRegister = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");

  const onSubmit = async (data) => {
    if (!mobile || mobile.length < 10) {
      toast.error("Please enter a valid mobile number with country code");
      return;
    }

    if (data.password !== data.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...data,
        mobile: `+${mobile}`,
      };

      await registerAdmin(payload);
      toast.success("Admin registered successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Admin registration failed.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Admin Registration"
      description="Create an admin account"
    >
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="relative">
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter admin email"
            required
            register={register}
            errors={errors}
            validation={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
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
              placeholder="Admin"
              required
              register={register}
              errors={errors}
              validation={{
                maxLength: {
                  value: 15,
                  message: "First name must not exceed 15 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s]*$/,
                  message: "First name should contain only letters",
                },
              }}
            />
            <FaRegUser
              className="absolute top-[42px] left-2 border-r-2 p-1"
              size={30}
            />
          </div>
          <div className="w-[48%] relative">
            <FormInput
              label="Last Name"
              name="last_name"
              type="text"
              placeholder="User"
              required
              register={register}
              errors={errors}
              validation={{
                maxLength: {
                  value: 15,
                  message: "Last name must not exceed 15 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s]*$/,
                  message: "Last name should contain only letters",
                },
              }}
            />
            <FaRegUser
              className="absolute top-[42px] left-2 border-r-2 p-1"
              size={30}
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-md font-medium text-[#5A4633] mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            country={"in"}
            value={mobile}
            onChange={setMobile}
            inputStyle={{ width: "100%", height: "45px" }}
            specialLabel=""
            inputProps={{
              name: "mobile",
              required: true,
            }}
          />
          {mobile && mobile.length < 10 && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a valid mobile number
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            required
            register={register}
            errors={errors}
            validation={{
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              },
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
            placeholder="Confirm password"
            required
            register={register}
            errors={errors}
            watch={watch}
          />
          <BiLockOpen
            className="absolute top-[41px] left-2 border-r-2 p-1"
            size={33}
          />
        </div>

        {/* Submit */}
        <div className="w-full flex items-center justify-center">
          <SubmitButton
            text="Register Admin"
            isLoading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </AuthLayout>
  );
};

export default AdminRegister;
