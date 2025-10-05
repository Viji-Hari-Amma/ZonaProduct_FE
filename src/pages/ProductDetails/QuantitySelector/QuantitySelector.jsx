// QuantitySelector.jsx
import React from "react";

const QuantitySelector = ({ quantity, onQuantityChange, maxQuantity }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-[#7C2D12]">Quantity:</h3>
      <div className="flex items-center border border-[#FDBA74] rounded-lg overflow-hidden w-fit">
        <button
          className="px-3 py-2 bg-[#FFEDE9] text-[#7C2D12] hover:bg-[#FED7AA] transition-colors"
          onClick={handleDecrease}
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          className="w-12 text-center border-x border-[#FDBA74] py-2"
          value={quantity}
          min="1"
          max={maxQuantity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 1 && value <= maxQuantity) {
              onQuantityChange(value);
            }
          }}
        />
        <button
          className="px-3 py-2 bg-[#FFEDE9] text-[#7C2D12] hover:bg-[#FED7AA] transition-colors"
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
        >
          +
        </button>
      </div>
      <p className="text-sm text-gray-500">Max: {maxQuantity} available</p>
    </div>
  );
};

export default QuantitySelector;