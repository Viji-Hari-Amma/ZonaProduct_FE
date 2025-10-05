// SizeSelector.jsx
import React from "react";

const SizeSelector = ({ sizes, selectedSize, onSelectSize }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-[#7C2D12]">Size Options:</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <div
            key={size.id}
            className={`px-4 py-2 border rounded-lg cursor-pointer transition-all duration-300 ${
              selectedSize?.id === size.id
                ? "bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white border-[#DC2626]"
                : "border-[#FDBA74] hover:border-[#F97316] hover:bg-[#FFEDE9]"
            }`}
            onClick={() => onSelectSize(size)}
          >
            {size.label} {size.unit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;