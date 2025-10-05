// src/components/Auth/FormInput.jsx
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  required = false,
  watch,
  setPasswordsMatch,
  compareWith = "password",
  validation = {},
  maxLength,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const isConfirmPassword = name === "confirm_password";
  const isEmailField = type === "email";
  const isNameField = name === "first_name" || name === "last_name";

  useEffect(() => {
    if (isConfirmPassword && watch && setPasswordsMatch) {
      const subscription = watch((value) => {
        const currentValue = value[name];
        const compareValue = value[compareWith];
        if (currentValue && compareValue) {
          const matches = currentValue === compareValue;
          setPasswordsMatch(matches);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, name, compareWith, setPasswordsMatch, isConfirmPassword]);

  const getBorderColor = () => {
    return errors[name] ? "border-red-500" : "border-gray-300";
  };

  // Get max length based on field type
  const getMaxLength = () => {
    if (maxLength) return maxLength;
    if (isNameField) return 15;
    if (isEmailField) return 30;
    return undefined;
  };

  return (
    <div className="mb-4 relative">
      <label htmlFor={name} className="block text-md font-medium text-[#5A4633] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        type={isPasswordField ? (showPassword ? "text" : "password") : type}
        name={name}
        placeholder={placeholder}
        maxLength={getMaxLength()}
        className={`w-full px-12 py-3 pr-10 border-[#C9B39A] border-2 text-black rounded-lg ${getBorderColor()} focus:outline-none focus:ring-2 focus:ring-[#C3875D] transition`}
        {...register(name, { 
          required: required && `${label} is required`,
          ...(isNameField && {
            maxLength: {
              value: 15,
              message: `${label} must not exceed 15 characters`
            },
            pattern: {
              value: /^[A-Za-z\s]*$/,
              message: `${label} should contain only letters and spaces`
            }
          }),
          ...(isEmailField && {
            maxLength: {
              value: 30,
              message: "Email must not exceed 30 characters"
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address"
            }
          }),
          ...(isPasswordField && name !== "confirm_password" && {
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters"
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
              message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            }
          }),
          ...(isConfirmPassword && {
            validate: (value) => 
              value === watch?.(compareWith) || "Passwords do not match"
          }),
          ...validation
        })}
        {...props}
      />

      {isPasswordField && (
        <div
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-[3rem] right-3 cursor-pointer text-[#ab632f]"
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </div>
      )}

      {errors[name] && (
        <p className="mt-1 text-sm font-medium text-[#A94442]">{errors[name].message}</p>
      )}
    </div>
  );
};

export default FormInput;