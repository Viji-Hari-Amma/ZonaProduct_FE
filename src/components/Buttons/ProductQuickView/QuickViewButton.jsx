// src/components/Buttons/QuickViewButton/QuickViewButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const QuickViewButton = ({ 
  productId, 
  onQuickViewClick, 
  showTooltip, 
  setShowTooltip,
  disabled = false
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (!disabled && onQuickViewClick && typeof onQuickViewClick === 'function') {
      onQuickViewClick();
    }
  };

  return (
    <div className="relative">
      <motion.button
        className={`w-12 h-12 ml-2 bg-[#FFEDE9] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onMouseEnter={() => !disabled && setShowTooltip && setShowTooltip(productId)}
        onMouseLeave={() => !disabled && setShowTooltip && setShowTooltip(null)}
        onClick={handleClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <svg
          className="w-5 h-5 text-[#DC2626] hover:text-[#F97316] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </motion.button>
      
      {showTooltip === productId && !disabled && (
        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-[#DC2626] text-white text-xs py-1 px-2 rounded whitespace-nowrap shadow-md z-10">
          Quick View
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-[#DC2626]"></div>
        </div>
      )}
    </div>
  );
};

// Add default props
QuickViewButton.defaultProps = {
  onQuickViewClick: null,
  setShowTooltip: null,
};
