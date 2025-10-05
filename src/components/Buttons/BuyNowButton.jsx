import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBolt } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const BuyNowButton = ({
  product,
  selectedSize,
  quantity,
  disabled = false,
  loading = false,
  w,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBuyNow = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error("Please select a size before buying");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select quantity");
      return;
    }

    // Prepare buy now data
    const buyNowData = {
      product_id: product.id,
      size_id: selectedSize ? selectedSize.id : null,
      quantity: quantity,
    };

    // Store in sessionStorage for persistence during redirects
    const buyNowState = {
      buyNow: true,
      product: product,
      selectedSize: selectedSize,
      quantity: quantity,
      buyNowData: buyNowData
    };
    
    sessionStorage.setItem('buyNowData', JSON.stringify(buyNowState));

    // If user is not authenticated, redirect to login with return url
    if (!isAuthenticated) {
      navigate("/login", { 
        state: { 
          from: "/checkout",
          message: "Please login to complete your purchase"
        } 
      });
      return;
    }

    // If authenticated, go directly to checkout
    navigate("/checkout", {
      state: buyNowState
    });
  };

  const isDisabled = disabled || loading || !selectedSize || quantity < 1 || product.stock_count === 0;

  return (
    <motion.button
      className={`${w} flex items-center justify-center gap-2 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#DC2626] hover:to-[#F97316] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300`}
      onClick={handleBuyNow}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        <>
          <FaBolt /> Buy Now
        </>
      )}
    </motion.button>
  );
};

export default BuyNowButton;