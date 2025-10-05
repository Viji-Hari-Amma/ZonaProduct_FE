import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpikeBadge from "../../../components/Modals/SpikeBadge";
import { WishlistButton } from "../../../components/Buttons/WishlistButton";
import { useWishlist } from "../../../hooks/useWishlist";
import AddToCartButton from "../../../components/Buttons/AddToCartButton";
import { QuickViewButton } from "../../../components/Buttons/ProductQuickView/QuickViewButton";

const calculatePriceFromSizes = (product) => {
  if (!product.sizes || product.sizes.length === 0) {
    return { originalPrice: 0, discountedPrice: 0 };
  }

  // Find the smallest priced size
  const pricedSizes = product.sizes.filter(
    (size) => parseFloat(size.price) > 0
  );
  if (pricedSizes.length === 0) {
    return { originalPrice: 0, discountedPrice: 0 };
  }

  const smallestSize = pricedSizes.reduce((min, size) =>
    parseFloat(size.price) < parseFloat(min.price) ? size : min
  );

  let originalPrice = parseFloat(smallestSize.price);
  let discountedPrice =
    parseFloat(smallestSize.discounted_price) || originalPrice;

  return { originalPrice, discountedPrice };
};

const ProductCard = ({
  product,
  onAddToCart,
  isInCart,
  isLoading,
  isAddingToCart,
  onQuickViewClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(null);
  const navigate = useNavigate();

  // ✅ Wishlist hook
  const {
    isInWishlist,
    toggleWishlist,
    isLoading: wishlistLoading,
  } = useWishlist();

  // ✅ Calculate total discount (sum of all active discounts)
  const totalDiscount =
    product.active_discounts && product.active_discounts.length > 0
      ? product.active_discounts.reduce(
          (sum, d) => sum + parseFloat(d.percentage),
          0
        )
      : null;

  // ✅ Calculate prices using the function (now properly defined above)
  let { originalPrice, discountedPrice } = calculatePriceFromSizes(product);

  // ✅ Apply additional discount if needed (but note: backend might already calculate this)
  // If the backend already applies discounts to discounted_price, you might not need this
  if (totalDiscount && discountedPrice === originalPrice) {
    // Only apply if discountedPrice hasn't been set by the backend
    discountedPrice = originalPrice - (originalPrice * totalDiscount) / 100;
  }

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };


  const handleQuickView = () => {
    if (onQuickViewClick) {
      onQuickViewClick(product);
    }
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-orange-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative h-48 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].image_url}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-orange-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.is_featured && (
            <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          )}
          {totalDiscount && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
              {totalDiscount}% OFF
            </span>
          )}
          {(!product.availability_status || product.stock_count === 0) && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* ✅ Wishlist Button */}
        <div
          className="absolute top-3 right-3"
          onClick={(e) => e.stopPropagation()}
        >
          <WishlistButton
            productId={product.id}
            isWishlisted={isInWishlist(product.id)}
            onWishlistToggle={toggleWishlist}
            disabled={wishlistLoading}
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded">
            {product.category_name}
          </span>
          {totalDiscount && (
            <div className="transform scale-75">
              <SpikeBadge
                size={50}
                color="#DC2626"
                label={`${totalDiscount}%`}
              />
            </div>
          )}
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>

        {product.flavour && (
          <span className="inline-block text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded-full mb-2">
            {product.flavour} flavor
          </span>
        )}

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mb-3">
          {product.average_rating ? (
            <>
              <div className="flex text-yellow-400">
                {"★".repeat(Math.round(product.average_rating))}
                {"☆".repeat(5 - Math.round(product.average_rating))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviews_count})
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-500">No reviews yet</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {discountedPrice > 0 ? (
              <>
                <span className="font-bold text-lg text-gray-900">
                  ₹{discountedPrice.toFixed(2)}
                </span>
                {originalPrice > discountedPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500">Price not set</span>
            )}
          </div>
        </div>

        <div
          className="flex justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <AddToCartButton
            productId={product.id}
            onAddToCart={onAddToCart}
            isInCart={isInCart}
            isLoading={isAddingToCart}
            disabled={!product.availability_status || product.stock_count === 0}
          >
            <div className="flex items-center">
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
              {!product.availability_status || product.stock_count === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </div>
          </AddToCartButton>

          {/* Quick View Button */}
          <QuickViewButton
            productId={product.id}
            onQuickViewClick={handleQuickView}
            showTooltip={showTooltip}
            setShowTooltip={setShowTooltip}
            disabled={!product.availability_status}
          />
        </div>
      </div>
    </div>
  );
};

// Add default props for safety
ProductCard.defaultProps = {
  onQuickViewClick: null,
};

export default ProductCard;
