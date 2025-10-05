// ProductNutrition.jsx
import React from "react";

const ProductNutrition = ({ nutritionalFacts }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#FED7AA] shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-[#7C2D12] mb-4 pb-2 border-b border-[#FECACA]">
        Nutritional Facts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nutritionalFacts.map((fact) => (
          <div
            key={fact.id}
            className="flex justify-between items-center p-3 bg-[#FFEDE9] rounded-lg"
          >
            <span className="text-[#7C2D12] font-medium">{fact.component}</span>
            <span className="text-[#DC2626] font-bold">
              {fact.value} {fact.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductNutrition;