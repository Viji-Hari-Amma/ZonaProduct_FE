// ProductIngredients.jsx
import React from "react";

const ProductIngredients = ({ ingredients }) => {
  return (
    <div className="bg-white rounded-xl p-6 max-w-375:p-3 border border-[#FED7AA] shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-[#7C2D12] mb-4 pb-2 border-b border-[#FECACA]">
        Ingredients
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="bg-[#FFEDE9] p-3 max-w-375:p-2 max-w-375:flex max-w-375:items-center max-w-375:justify-center rounded-lg text-center text-[#7C2D12]"
          >
            {ingredient.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductIngredients;