import React from "react";
import { WishlistButton } from "../../../../components/Buttons/WishlistButton";
import SpikeBadge from "../../../../components/Modals/SpikeBadge";
import AddToCartButton from "../../../../components/Buttons/AddToCartButton";
import { QuickViewButton } from "../../../../components/Buttons/ProductQuickView/QuickViewButton";
import { useWishlist } from "../../../../hooks/useWishlist";

export const ProductItem = ({
  product,
  onWishlistToggle,
  showTooltip,
  setShowTooltip,
  wishlistLoading = false,
  onProductClick,
  cartItems = [],
  loadingItems = {},
  onAddToCart,
  onQuickViewClick, // This prop should now be properly passed
}) => {
  const [imgLoading, setImgLoading] = React.useState(true);

  const { isInWishlist, toggleWishlist } = useWishlist();

  // ✅ Check if product is already in cart
  const isInCart = cartItems.some((item) => item.product?.id === product.id);

  // ✅ Check if this specific product is being added to cart
  const isAdding = loadingItems[product.id] || false;

  // ✅ Calculate total discount
  const calculateTotalDiscount = (discounts) => {
    if (!discounts || discounts.length === 0) return 0;
    const total = discounts.reduce(
      (sum, d) => sum + parseFloat(d.percentage),
      0
    );
    return Math.round(total);
  };

  const totalDiscount = calculateTotalDiscount(product.active_discounts);

  // ✅ Figure out pricing
  let originalPrice = parseFloat(product.base_price) || 0;
  let discountedPrice = originalPrice;

  if (product.sizes && product.sizes.length > 0) {
    const pricedSizes = product.sizes.filter(
      (size) => parseFloat(size.price) > 0
    );
    if (pricedSizes.length > 0) {
      originalPrice = Math.min(
        ...pricedSizes.map((size) => parseFloat(size.price))
      );
      discountedPrice = originalPrice;
    }
  }

  if (totalDiscount > 0 && originalPrice > 0) {
    discountedPrice = originalPrice - (originalPrice * totalDiscount) / 100;
  }

  // Safe handler for quick view
  const handleQuickViewClick = () => {
    if (onQuickViewClick && typeof onQuickViewClick === "function") {
      onQuickViewClick(product);
    } else {
      console.warn("onQuickViewClick is not a function");
    }
  };

  return (
    <div className="w-full min-h-[520px] max-w-375:min-h-[480px]  border border-[#FED7AA] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_10px_22px_rgba(249,115,22,0.25)] hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[#FFFFFF] hover:to-[#FFF5F0]">
      {/* Image wrapper (clickable) */}
      <div
        className="relative h-56 max-w-375:min-h-52 overflow-hidden cursor-pointer group"
        onClick={() => onProductClick && onProductClick(product.id)}
        title={product.name}
        style={{ userSelect: "none" }}
      >
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 z-10">
            <svg
              className="w-12 h-12 animate-spin text-orange-500"
              viewBox="0 0 50 50"
            >
              <circle
                className="opacity-20"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 1 0-15 15v5A20 20 0 0 1 25 5z"
              />
            </svg>
          </div>
        )}
        <img
          src={
            product.images?.find((img) => img.is_primary)?.image_url ||
            product.images?.[0]?.image_url
          }
          alt={product.name}
          draggable={false}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
        />
        <div className="absolute top-3 left-3 bg-[#DC2626] text-white px-3 py-1 rounded-full text-xs font-semibold">
          {product.category_name}
        </div>

        {/* Wishlist */}
        <WishlistButton
          productId={product.id}
          isWishlisted={isInWishlist(product.id)}
          onWishlistToggle={() => toggleWishlist(product.id)}
          disabled={wishlistLoading}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Content */}
      <div className="p-5 max-w-375:p-3">
        {/* Product name */}
        <h2
          className="text-left text-xl font-bold text-[#7C2D12] mb-2 cursor-pointer hover:underline"
          onClick={() => onProductClick && onProductClick(product.id)}
        >
          {product.name}
        </h2>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-[#F97316]">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 mr-0.5 ${
                  product.average_rating && i < product.average_rating
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
          <span className="text-gray-500 text-sm ml-1">
            ({product.reviews_count || 0} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="text-[#1E293B] text-left text-sm leading-relaxed mb-4">
          {product.description.length > 60
            ? product.description.slice(0, 60) + "..."
            : product.description}
        </p>

        {/* Price & Discount */}
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-lg text-[#7C2D12] w-full">
            {originalPrice > 0 ? (
              <div className="flex items-center justify-between w-full">
                <div className="w-fit">
                  {totalDiscount > 0 ? (
                    <>
                      <span className="line-through text-gray-400 text-base mr-2">
                        ₹{originalPrice.toFixed(2)}
                      </span>
                      ₹{discountedPrice.toFixed(2)}
                    </>
                  ) : (
                    <>₹{originalPrice.toFixed(2)}</>
                  )}
                </div>
                <div className="w-fit">
                  {totalDiscount > 0 && (
                    <SpikeBadge
                      size={50}
                      color="red"
                      label={`${totalDiscount}%`}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="block w-fit">Price not available</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <AddToCartButton
            productId={product.id}
            onAddToCart={onAddToCart}
            isInCart={isInCart}
            isLoading={isAdding}
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

          {/* Quick View Button - Only render if onQuickViewClick is provided */}
          {onQuickViewClick && (
            <QuickViewButton
              productId={product.id}
              onQuickViewClick={handleQuickViewClick}
              showTooltip={showTooltip}
              setShowTooltip={setShowTooltip}
              disabled={!product.availability_status}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Add default props for safety
ProductItem.defaultProps = {
  onQuickViewClick: null,
};
