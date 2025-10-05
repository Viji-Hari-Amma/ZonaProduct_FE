import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineMail } from "react-icons/md";
import { BiLockOpen } from "react-icons/bi";
import FormInput from "../../../components/Auth/FormInput";
import SubmitButton from "../../../components/Buttons/SubmitButton";
import GoogleLoginComponent from "../../../components/Buttons/GoogleLoginComponent";
import { loginUser } from "../../../services/AuthService/AuthService";
import AuthLayout from "../../../layout/AuthLayout";
import useAuth from "../../../hooks/useAuth";
import { useCart } from "../../../hooks/useCart";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const message = location.state?.message || "";
  const { login, pendingCartItems, clearPendingCartItems } = useAuth();
  const { quickAddToCart, addToCartWithQty } = useCart();

  useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  const processPendingCartItems = async (items) => {
    if (items.length > 0) {
      try {
        for (const productId of items) {
          await quickAddToCart(productId);
        }
        toast.success(`${items.length} item(s) added to cart successfully!`);
      } catch (error) {
        console.error("Error adding pending items to cart:", error);
        toast.error("Some items couldn't be added to cart");
      } finally {
        clearPendingCartItems();
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await loginUser(data);

      login({
        access: response.data.access,
        refresh: response.data.refresh,
        userId: response.data.user_id,
        isSuperuser: response.data.is_superuser,
        is_staff: response.data.is_staff,
        profilePic: response.data.profile_pic || "",
      });

      localStorage.setItem("userId", response.data.user_id);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("is_superuser", response.data.is_superuser);

      toast.success("Login successful!");

      // Process pending cart items
      await processPendingCartItems(pendingCartItems);

      // Check for pending cart item from quick view
      const pendingCartItem = sessionStorage.getItem("pendingCartItem");
      if (pendingCartItem) {
        const { productId, quantity, sizeId } = JSON.parse(pendingCartItem);
        try {
          await addToCartWithQty(productId, quantity, sizeId);
          toast.success("Product added to cart!");
          sessionStorage.removeItem("pendingCartItem");
        } catch (error) {
          toast.error("Failed to add product to cart");
        }
      }

      // Check for buy now data
      const buyNowData = sessionStorage.getItem("buyNowData");

      if (buyNowData) {
        const parsedData = JSON.parse(buyNowData);
        sessionStorage.removeItem("buyNowData");
        navigate("/checkout", { state: parsedData, replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to Your Account"
      description="Welcome back! Please enter your credentials to continue."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="relative">
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
                }
              }}
            />
            <BiLockOpen
              className="absolute top-[41px] left-2 border-r-2 p-1"
              size={33}
            />
          </div>
        </div>

        <div className="flex justify-end mb-2">
          <Link
            to="/Forgot-Password"
            className="text-[#8B4513] hover:text-[#A0522D] underline font-bold"
          >
            Forgot Password
          </Link>
        </div>

        <div className="flex justify-evenly items-center gap-4">
          <SubmitButton
            padding="p-2"
            text="Sign in"
            isLoading={loading}
            disabled={loading}
            width="50%"
          />
          <GoogleLoginComponent from={from} />
        </div>

        <div className="flex justify-center items-center mt-4 gap-3 text-[#556B2F] font-bold">
          Don't have an account?
          <Link
            to="/register"
            className="text-[#8B4513] hover:text-[#A0522D] underline font-bold"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
