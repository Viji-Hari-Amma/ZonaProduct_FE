import React, { useEffect, useState } from "react";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsFillTrashFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import ImageWithSpinner from "../../components/Loader/ImageWithSpinner";

export const WishList = () => {
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlist, refreshWishlist, isLoading } =
    useWishlist();
  const { quickAddToCart, isLoading: cartLoading, cartItems = [] } = useCart();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    refreshWishlist();
    document.title = "My Wishlist - Spice Arog";
  }, []);

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    try {
      await quickAddToCart(productId);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[100vh] bg-gradient-to-b from-orange-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[100vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[13vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#7C2D12] mb-4">
            My Wishlist
          </h1>
          <p className="text-lg text-gray-600">
            {wishlistItems.length === 0
              ? "Your wishlist is empty"
              : `You have ${wishlistItems.length} item${
                  wishlistItems.length !== 1 ? "s" : ""
                } in your wishlist`}
          </p>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Start building your wishlist
            </h3>
            <p className="text-gray-500 mb-6">
              Save products you love and come back to them later
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#DC2626] hover:to-[#F97316] transition-all duration-300"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item.product;

              // ✅ Calculate total discount
              const totalDiscount =
                product?.active_discounts && product.active_discounts.length > 0
                  ? product.active_discounts.reduce(
                      (sum, d) => sum + parseFloat(d.percentage),
                      0
                    )
                  : 0;

              // ✅ Base price
              let originalPrice = parseFloat(product.base_price) || 0;
              let discountedPrice = originalPrice;

              if (totalDiscount > 0) {
                discountedPrice =
                  originalPrice - (originalPrice * totalDiscount) / 100;
              }

              // ✅ Handle sizes if available
              const sizes = product?.sizes || [];
              if (sizes.length > 0) {
                const pricedSizes = sizes.filter(
                  (s) => parseFloat(s.price) > 0
                );
                if (pricedSizes.length > 0) {
                  originalPrice = Math.min(
                    ...pricedSizes.map((s) => parseFloat(s.price))
                  );
                  discountedPrice = originalPrice;
                  if (totalDiscount > 0) {
                    discountedPrice =
                      originalPrice - (originalPrice * totalDiscount) / 100;
                  }
                }
              }

              // ✅ Check cart
              const isInCart = cartItems.some(
                (cartItem) => cartItem.product?.id === product.id
              );

              return (
                <div
                  key={item.id}
                  className="bg-white w-[300px] rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <ImageWithSpinner
                      src={
                        product?.images?.[0]?.image_url ||
                        "/placeholder-image.jpg"
                      }
                      alt={product?.name || "Product"}
                      className="w-full h-full cursor-pointer transition-transform duration-500 hover:scale-105"
                      onClick={() => handleProductClick(product.id)}
                    />

                    {/* Category badge */}
                    {product?.category_name && (
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {product.category_name}
                      </div>
                    )}

                    {/* Discount badge */}
                    {totalDiscount > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {totalDiscount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <h3
                      className="font-serif text-xl text-[#4a3c2a] mb-2 cursor-pointer hover:text-[#d35400] transition-colors"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product?.name || "Product Name"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product?.description || "No description available"}
                    </p>

                    {/* Price */}
                    <div className="flex relative items-center gap-2 mb-3">
                      {totalDiscount > 0 ? (
                        <>
                          <span className="text-lg font-bold text-[#d35400]">
                            ₹{discountedPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 right-0 line-through">
                            ₹{originalPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-[#d35400]">
                          ₹{originalPrice.toFixed(2)}
                        </span>
                      )}

                      {sizes.length > 0 && sizes[0]?.label && (
                        <span className="absolute right-0 text-xs text-gray-500">
                          {sizes[0].label}
                          {sizes[0].unit}
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="flex items-center justify-between border-t-2 border-gray-100 pt-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded ${
                          product?.stock_count > 10
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product?.stock_count > 10 ? "In Stock" : "Low Stock"}
                      </span>
                      <span className="text-gray-400">
                        Added:{" "}
                        {new Date(item.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center border-t border-gray-400 px-5 py-3">
                    {isInCart ? (
                      <div className="flex-1 text-[13px] flex items-center justify-center p-2 rounded-lg font-semibold cursor-not-allowed text-green-700 gap-1">
                        Already in Cart
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className={`relative text-[14px] flex items-center gap-2 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-all font-semibold ${
                          addingId === product.id || cartLoading
                            ? "opacity-60 cursor-wait"
                            : ""
                        }`}
                        disabled={addingId === product.id || cartLoading}
                        style={{ minWidth: 120, minHeight: 40 }}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {!(addingId === product.id || cartLoading) ? (
                            <motion.div
                              key="normal"
                              className="flex items-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.25 }}
                            >
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
                    <div className="w-[1px] h-[40px] bg-gray-400"></div>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                    >
                      <span>
                        <BsFillTrashFill />
                      </span>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Refresh Button */}
        {wishlistItems.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={refreshWishlist}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Refresh Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
