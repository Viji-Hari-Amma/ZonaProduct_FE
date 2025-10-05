import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  const navigate = useNavigate();
  if (!ctx)
    return {
      wishlistItems: [],
      isInWishlist: () => false,
      toggleWishlist: () => {},
      refreshWishlist: () => {},
      isLoading: false,
      isInitialized: false,
    };

  const safeToggle = async (productId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.info("Please login to manage your wishlist");
      navigate("/login");
      return;
    }
    const result = await ctx.toggleWishlist(productId);
    if (!result?.ok && result?.reason !== "unauthenticated") {
      const msg =
        result?.error?.response?.data?.message ||
        result?.error?.response?.data?.detail ||
        "Failed to update wishlist";
      toast.error(msg);
    }
  };

  return {
    wishlistItems: ctx.wishlistItems,
    isInWishlist: ctx.isInWishlist,
    toggleWishlist: safeToggle,
    refreshWishlist: ctx.refreshWishlist,
    isLoading: ctx.isLoading,
    isInitialized: ctx.isInitialized,
  };
};
