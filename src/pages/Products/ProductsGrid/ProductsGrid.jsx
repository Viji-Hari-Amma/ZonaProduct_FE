// components/Products/ProductsGrid.jsx
import React, { useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductQuickView from "../../../components/Buttons/ProductQuickView/ProductQuickView";

const ProductsGrid = ({
  products,
  onAddToCart,
  cartItems,
  isAddingToCart,
  addingProductId,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  if (products.length === 0) {
    return null; // Handled in parent component
  }

  const handleQuickViewClick = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            isInCart={cartItems.some((item) => item.product?.id === product.id)}
            isAddingToCart={isAddingToCart && addingProductId === product.id}
            onQuickViewClick={handleQuickViewClick}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={handleCloseQuickView}
        />
      )}
    </>
  );
};

export default ProductsGrid;
