import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaStar,
  FaShoppingCart,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WishlistButton } from "../WishlistButton";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import BuyNowButton from "../BuyNowButton";

const ProductQuickView = ({ product, isOpen, onClose, onWishlistToggle }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const imageContainerRef = useRef(null);
  const navigate = useNavigate();
  const { addToCartWithQty } = useCart();
  const { isAuthenticated } = useAuth();

  // Minimum swipe distance (px) to trigger image change
  const minSwipeDistance = 50;

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  // Image navigation functions
  const nextImage = () => {
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error("Please select a size before adding to cart");
      return;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      // Store cart data for after login
      sessionStorage.setItem(
        "pendingCartItem",
        JSON.stringify({
          productId: product.id,
          quantity: quantity,
          sizeId: selectedSize?.id || null,
          product: product,
          selectedSize: selectedSize,
        })
      );

      navigate("/login", {
        state: {
          from: window.location.pathname,
          message: "Please login to add items to your cart",
        },
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCartWithQty(product.id, quantity, selectedSize?.id || null);
      toast.success("Product added to cart!");
      onClose();
    } catch (error) {
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/products/${productId}`);
      onClose();
    }
  };

  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQuantity = () =>
    quantity < product.stock_count && setQuantity(quantity + 1);

  if (!isOpen || !product) return null;

  // Price calculation
  const basePrice = selectedSize
    ? parseFloat(selectedSize.price)
    : parseFloat(product.base_price);
  const discountPercentage = product.active_discounts?.[0]?.percentage
    ? parseFloat(product.active_discounts[0].percentage)
    : 0;
  const discountedPrice = basePrice - (basePrice * discountPercentage) / 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden max-h-[75vh] max-w-375:max-h-[80vh] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 z-10 text-[#7C2D12] hover:bg-[#DC2626] hover:text-white transition-all duration-300"
        >
          <FaTimes size={20} />
        </button>

        {/* Image section */}
        <div
          className="md:w-2/5 bg-[#FFEDE9] p-3 flex items-center justify-center relative"
          ref={imageContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left arrow - only show if not first image */}
          {product.images.length > 1 && currentImageIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 z-10 text-[#7C2D12] hover:text-[#DC2626] transition-all duration-300 shadow-md hidden md:block"
            >
              <FaChevronLeft size={20} />
            </button>
          )}

          <img
            src={product.images[currentImageIndex]?.image_url}
            alt={product.name}
            className="max-h-[300px] max-w-375:max-h-[250px] w-auto object-contain rounded-lg transition-opacity duration-300 select-none"
            draggable="false"
          />

          {/* Right arrow - only show if not last image */}
          {product.images.length > 1 &&
            currentImageIndex < product.images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 z-10 text-[#7C2D12] hover:text-[#DC2626] transition-all duration-300 shadow-md hidden md:block"
              >
                <FaChevronRight size={20} />
              </button>
            )}

          {/* Image counter */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-full">
              {currentImageIndex + 1} / {product.images.length}
            </div>
          )}

          {/* Mobile swipe indicators */}
          {product.images.length > 1 && (
            <>
              {/* Left swipe indicator - only show if not first image */}
              {currentImageIndex > 0 && (
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 rounded-full p-2 z-5 md:hidden">
                  <FaChevronLeft size={16} className="text-white" />
                </div>
              )}

              {/* Right swipe indicator - only show if not last image */}
              {currentImageIndex < product.images.length - 1 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 rounded-full p-2 z-5 md:hidden">
                  <FaChevronRight size={16} className="text-white" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Details section */}
        <div className="md:w-3/5 p-4 overflow-y-auto">
          <div className="mb-4 max-w-375:mb-2">
            <span className="text-[#9A3412] text-sm uppercase tracking-wider">
              {product.category_name}
            </span>
            <h2 className="text-2xl font-bold text-[#7C2D12] mt-1">
              {product.name}
            </h2>

            {/* Rating */}
            {product.average_rating !== null && (
              <div className="flex items-center mt-2">
                <div className="flex text-[#F97316]">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.average_rating)
                          ? "text-[#F97316]"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">
                  ({product.reviews_count || 0} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6 max-w-375:mb-3">
            <span className="text-3xl font-bold text-[#DC2626]">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  ₹{basePrice.toFixed(2)}
                </span>
                <span className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white text-sm font-medium px-2 py-1 rounded-full">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description - 2 lines only */}
          <p className="text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          <button
            onClick={() => handleProductClick(product.id)}
            className="text-[#DC2626] text-sm font-medium hover:underline mb-6 max-w-375:mb-3 inline-block"
          >
            View More
          </button>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#7C2D12] mb-3">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(
                  (size) =>
                    size.price !== "0.00" && (
                      <div
                        key={size.id}
                        className={`border-2 rounded-lg p-3 min-w-[80px] text-center cursor-pointer transition-all ${
                          selectedSize?.id === size.id
                            ? "border-[#DC2626] bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white"
                            : "border-[#FDBA74] hover:border-[#F97316]"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <div className="font-semibold">
                          {size.label} {size.unit}
                        </div>
                        <div className="text-sm">₹{size.price}</div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Stock */}
          <div
            className={`flex items-center gap-2 mb-6 ${
              product.stock_count > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <FaCheckCircle />
            {product.stock_count > 0
              ? `In Stock (${product.stock_count} available)`
              : "Out of Stock"}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-[#FDBA74] rounded-lg overflow-hidden">
              <button
                className="bg-[#FFEDE9] w-10 h-10 flex items-center justify-center text-[#7C2D12] hover:bg-[#FED7AA] disabled:opacity-50"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                className="w-12 h-10 text-center border-x border-[#FDBA74]"
                value={quantity}
                min="1"
                max={product.stock_count}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setQuantity(
                    Math.max(1, Math.min(value, product.stock_count))
                  );
                }}
              />
              <button
                className="bg-[#FFEDE9] w-10 h-10 flex items-center justify-center text-[#7C2D12] hover:bg-[#FED7AA] disabled:opacity-50"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock_count}
              >
                +
              </button>
            </div>

            <button
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-2 px-4 max-w-375:px-3 rounded-lg font-semibold hover:from-[#DC2626] hover:to-[#F97316] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={product.stock_count === 0 || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FaShoppingCart /> Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Buy Now - Remove disabled prop for authentication */}
          <BuyNowButton
            w="w-full"
            product={product}
            selectedSize={selectedSize}
            quantity={quantity}
            disabled={product.stock_count === 0} // Only disable for stock issues, not authentication
            loading={isAddingToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
