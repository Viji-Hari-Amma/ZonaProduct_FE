import React from "react";
import { ProductCard } from "./ProductCard/ProductCard";

export const TrendingProducts = () => {
  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center flex-col">
      {/* Header Section */}
      <div className="h-[25vh] w-full flex flex-col items-center justify-center">
        <h1 className="text-[25px] md:text-4xl font-extrabold mt-2 tracking-wide italic font-delius text-[#7C2D12] p-4">
          Fresh on the Shelf
        </h1>
        <p className="text-[#9A3412] font-josefin text-xl p-2 mt-2 text-center max-w-375:text-[17px] max-w-375:mt-0">
          Our kitchen never stops! Take a bite of our freshly launched products
          before they're gone.
        </p>
      </div>

      {/* Product Section */}
      <div className="flex items-center justify-center gap-10 w-full flex-wrap p-6 max-w-375:p-0">
        <ProductCard />
      </div>
    </div>
  );
};
