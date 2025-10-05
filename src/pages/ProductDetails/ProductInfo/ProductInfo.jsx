import React from "react";
import { WishlistButton } from "../../../components/Buttons/WishlistButton";
import SizeSelector from "../SizeSelector/SizeSelector";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import { useCart } from "../../../hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import BuyNowButton from "../../../components/Buttons/BuyNowButton";

const ProductInfo = ({
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  onAddToCart,
  cartLoading,
  isWishlisted,
  onWishlistToggle,
  wishlistLoading,
}) => {
  const { cartItems = [] } = useCart();
  const isInCart = cartItems.some((item) => item.product?.id === product.id);

  const [adding, setAdding] = React.useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    await onAddToCart();
    setTimeout(() => setAdding(false), 1000); // adjust as needed
  };

  // ✅ Helpers for discount calculation
  const getTotalDiscountPercent = (product) => {
    return product.active_discounts && product.active_discounts.length > 0
      ? product.active_discounts.reduce(
          (sum, d) => sum + parseFloat(d.percentage),
          0
        )
      : 0;
  };

  const getDiscountedPrice = (basePrice, product) => {
    const totalDiscount = getTotalDiscountPercent(product);
    if (totalDiscount > 0) {
      return basePrice - (basePrice * totalDiscount) / 100;
    }
    return basePrice;
  };

  // ✅ Use selectedSize for price display
  const basePrice = selectedSize ? parseFloat(selectedSize.price) : 0;
  const discountedPrice = selectedSize
    ? getDiscountedPrice(basePrice, product)
    : 0;
  const totalDiscount = getTotalDiscountPercent(product);

  return (
    <div className="space-y-6 relative">
      <div className="absolute -top-7 right-0">
        <WishlistButton
          productId={product.id}
          isWishlisted={isWishlisted}
          onWishlistToggle={onWishlistToggle}
          disabled={wishlistLoading}
          size="large"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-[#7C2D12] mb-2 max-w-375:text-2xl ">
          {product.name}
        </h1>

        <div className="text-[#9A3412] mb-4">{product.category_name}</div>

        {product.average_rating !== null && (
          <div className="flex items-center mb-4">
            <div className="flex text-[#F97316]">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.average_rating)
                      ? "text-[#F97316]"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-2">
              ({product.reviews_count || 0} reviews)
            </span>
          </div>
        )}
      </div>

      {/* ✅ Price Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {selectedSize ? (
            totalDiscount > 0 ? (
              <>
                <span className="text-3xl font-bold text-[#7C2D12] max-w-375:text-2xl">
                  ₹{discountedPrice.toFixed(2)}
                </span>
                <span className="text-xl text-gray-400 line-through max-w-375:text-lg">
                  ₹{basePrice.toFixed(2)}
                </span>
                <span className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white text-sm font-medium px-2 py-1 rounded-full">
                  {totalDiscount}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-[#7C2D12]">
                ₹{basePrice.toFixed(2)}
              </span>
            )
          ) : (
            <span className="text-3xl font-bold text-[#7C2D12]">₹0.00</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#7C2D12] mb-2">
          Description
        </h3>
        <p className="text-gray-600 leading-relaxed max-w-375:text-[15px] text-justify">{product.description}</p>
      </div>

      {product.sizes && product.sizes.length > 0 && (
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
        />
      )}

      <QuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        maxQuantity={product.stock_count}
      />

      <div className="flex gap-4 pt-4">
        {isInCart ? (
          <div className="flex-1 flex items-center justify-center py-3 px-5 max-w-375:px-3 rounded-lg font-semibold bg-green-100 text-green-700 shadow-md gap-2">
            Already in Cart
          </div>
        ) : (
          <button
            className={`relative flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-3 px-6 max-w-375:px-3 rounded-lg font-semibold hover:from-[#DC2626] hover:to-[#F97316] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
              cartLoading || adding ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={handleAddToCart}
            disabled={cartLoading || adding || product.stock_count === 0}
            style={{ minHeight: 48 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!adding && !cartLoading ? (
                <motion.div
                  key="normal"
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </motion.div>
              ) : (
                <motion.div
                  key="animating"
                  className="flex items-center justify-center absolute inset-0"
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <svg
                    className="w-6 h-6 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}
        <BuyNowButton
          product={product}
          selectedSize={selectedSize}
          quantity={quantity}
          disabled={product.stock_count === 0}
        />
      </div>

      <div className="border-t border-[#FECACA] pt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">SKU:</span>
          <span className="font-medium">{product.id}</span>
        </div>

        {product.category_name && (
          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{product.category_name}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">Stock:</span>
          <span
            className={`font-medium ${
              product.stock_count > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock_count > 0
              ? `${product.stock_count} available`
              : "Out of stock"}
          </span>
        </div>

        {product.flavour && (
          <div className="flex justify-between">
            <span className="text-gray-600">Flavor:</span>
            <span className="font-medium capitalize">{product.flavour}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
