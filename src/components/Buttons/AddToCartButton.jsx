// components/Buttons/AddToCartButton.jsx
import React from 'react';
import { useProtectedAddToCart } from '../../hooks/useProtectedAddToCart';

const AddToCartButton = ({ 
  productId, 
  onAddToCart, 
  isInCart, 
  isLoading,
  disabled,
  className = "",
  children 
}) => {
  const { protectedAddToCart } = useProtectedAddToCart();

  const handleClick = (e) => {
    e.stopPropagation();
    protectedAddToCart(onAddToCart, productId);
  };

  if (isInCart) {
    return (
      <div className="flex-1 py-3 px-5 rounded-lg font-semibold flex items-center justify-center bg-green-100 text-green-700 shadow-md">
        Already in Cart
      </div>
    );
  }

  return (
    <button
      className={`flex-1 py-3 px-5 rounded-lg font-semibold flex items-center justify-center overflow-hidden transition-all duration-300 shadow-md ${
        isLoading
          ? "bg-gradient-to-r from-orange-500 to-red-600 cursor-wait"
          : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-red-600 hover:to-orange-500 hover:scale-105 shadow-red-300 hover:shadow-red-400"
      } text-white relative ${className}`}
      onClick={handleClick}
      disabled={isLoading || disabled}
    >
      {!isLoading ? (
        children
      ) : (
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </button>
  );
};

export default AddToCartButton;