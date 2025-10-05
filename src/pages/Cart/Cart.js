import React, { useState, useEffect } from "react";
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Info,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  Edit,
  Check,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import ImageWithSpinner from "../../components/Loader/ImageWithSpinner";

export const Cart = () => {
  const { cartItems, removeFromCart, updateCart, isLoading, cartCount, refreshCart } =
    useCart();
  const [updatingItems, setUpdatingItems] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [editingSize, setEditingSize] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const navigate = useNavigate();

  // Refresh cart when component mounts
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
    await updateCart(itemId, { quantity: newQuantity });
    setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
    await removeFromCart(itemId);
    setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleSizeChange = async (itemId, newSizeId) => {
    if (!newSizeId) return;
    
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
    await updateCart(itemId, { size_id: newSizeId });
    setEditingSize(null);
    setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
  };

  const toggleItemDetails = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const startEditingSize = (itemId, currentSize) => {
    setEditingSize(itemId);
    setSelectedSizes((prev) => ({
      ...prev,
      [itemId]: currentSize?.id || null,
    }));
  };

  const cancelEditingSize = () => {
    setEditingSize(null);
    setSelectedSizes({});
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const getTotalDiscountPercent = (product) => {
    return product.active_discounts && product.active_discounts.length > 0
      ? product.active_discounts.reduce(
          (sum, d) => sum + parseFloat(d.percentage),
          0
        )
      : 0;
  };

  const getItemUnitPrice = (item) => {
    // Use discounted_price if available, otherwise calculate from base price and discounts
    if (item.size?.discounted_price && parseFloat(item.size.discounted_price) > 0) {
      return parseFloat(item.size.discounted_price);
    }
    
    const basePrice = parseFloat(item.size?.price || item.price || 0);
    const totalDiscount = getTotalDiscountPercent(item.product);

    if (totalDiscount > 0) {
      return basePrice - (basePrice * totalDiscount) / 100;
    }
    return basePrice;
  };

  const getItemTotal = (item) => getItemUnitPrice(item) * item.quantity;

  const getItemOriginalPrice = (item) => {
    return parseFloat(item.size?.price || item.price || 0);
  };

  // Calculate cart totals based on items
  const subtotal = cartItems.reduce(
    (total, item) => total + getItemTotal(item),
    0
  );

  const discount = cartItems.reduce((total, item) => {
    const originalPrice = getItemOriginalPrice(item) * item.quantity;
    const discountedPrice = getItemTotal(item);
    return total + (originalPrice - discountedPrice);
  }, 0);

  // Calculate delivery charge - if any item has delivery charge, use the maximum one
  // or you can sum them up based on your business logic
  const deliveryCharge = cartItems.reduce((maxCharge, item) => {
    const itemDeliveryCharge = parseFloat(item.size?.delivery_charge || item.delivery_charge || 0);
    return Math.max(maxCharge, itemDeliveryCharge);
  }, 0);

  const total = subtotal + deliveryCharge;

  // Check if any item requires special delivery consideration
  const hasDeliveryCharge = deliveryCharge > 0;
  const isFreeDelivery = deliveryCharge === 0;

  if (isLoading && cartCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 pt-24 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-orange-900 mb-2 max-w-375:text-3xl">
            Your Shopping Cart
          </h1>
          <p className="text-orange-700">
            {cartCount === 0
              ? "Your cart is empty"
              : `You have ${cartCount} item${
                  cartCount !== 1 ? "s" : ""
                } in your cart`}
          </p>
        </div>

        {cartCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl p-8 shadow-lg">
            <div className="relative mb-6">
              <ShoppingBag size={100} className="text-orange-300" />
              <div className="absolute -inset-4 bg-orange-100 rounded-full opacity-50 -z-10"></div>
            </div>
            <h2 className="text-2xl font-semibold text-orange-900 mb-4">
              Your cart feels lonely
            </h2>
            <p className="text-orange-700 mb-8 text-center max-w-md">
              Add some delicious, handmade products to your cart and treat
              yourself!
            </p>
            <button
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold flex items-center gap-2"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-6">
              {cartItems.map((item) => {
                const totalDiscount = getTotalDiscountPercent(item.product);
                const basePrice = getItemOriginalPrice(item);
                const unitPrice = getItemUnitPrice(item);
                const itemDeliveryCharge = parseFloat(item.size?.delivery_charge || item.delivery_charge || 0);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0 relative">
                        <ImageWithSpinner
                          src={
                            item.product.images.find((img) => img.is_primary)
                              ?.image_url ||
                            item.product.images[0]?.image_url ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.product.name}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                          onClick={() => handleProductClick(item.product.id)}
                        />
                        {totalDiscount > 0 && (
                          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {totalDiscount}% OFF
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between items-start relative">
                          <div className="flex-1">
                            <h3
                              className="text-xl font-bold text-orange-900 hover:text-orange-700 cursor-pointer transition-colors"
                              onClick={() =>
                                handleProductClick(item.product.id)
                              }
                            >
                              {item.product.name}
                            </h3>

                            <div className="mt-2 flex items-center gap-2  max-w-375:w-full">
                              <span className="text-orange-700 font-medium">
                                Size:{" "}
                              </span>
                              {editingSize === item.id ? (
                                <div className="flex items-center gap-2">
                                  <select
                                    value={
                                      selectedSizes[item.id] ||
                                      item.size?.id ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setSelectedSizes((prev) => ({
                                        ...prev,
                                        [item.id]: parseInt(e.target.value),
                                      }))
                                    }
                                    className="border border-orange-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    disabled={updatingItems[item.id]}
                                  >
                                    <option value="">Select Size</option>
                                    {item.product.sizes?.map((size) => (
                                      <option key={size.id} value={size.id}>
                                        {size.label} {size.unit}
                                        {parseFloat(size.delivery_charge) > 0 && 
                                          ` (+₹${parseFloat(size.delivery_charge).toFixed(2)} delivery)`
                                        }
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() =>
                                      handleSizeChange(
                                        item.id,
                                        selectedSizes[item.id]
                                      )
                                    }
                                    disabled={
                                      updatingItems[item.id] ||
                                      !selectedSizes[item.id]
                                    }
                                    className="text-green-600 hover:text-green-800 transition-colors p-1"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button
                                    onClick={cancelEditingSize}
                                    disabled={updatingItems[item.id]}
                                    className="text-gray-500 absolute right-5 hover:text-gray-700 transition-colors p-1"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-orange-800">
                                    {item.size?.label || "N/A"}{" "}
                                    {item.size?.unit || ""}
                                  </span>
                                  {itemDeliveryCharge > 0 && (
                                    <span className="text-xs text-gray-500">
                                      (₹{itemDeliveryCharge.toFixed(2)} delivery)
                                    </span>
                                  )}
                                  <button
                                    onClick={() =>
                                      startEditingSize(item.id, item.size)
                                    }
                                    disabled={updatingItems[item.id]}
                                    className="text-orange-600 hover:text-orange-800 transition-colors p-1 ml-2"
                                  >
                                    <Edit size={16} />
                                  </button>
                                </div>
                              )}
                            </div>

                            {item.product.flavour && (
                              <span className="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full mt-2">
                                {item.product.flavour} flavor
                              </span>
                            )}

                            <div className="mt-2 flex items-center">
                              {item.product.stock_count > 0 ? (
                                <span className="text-green-600 text-sm flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                  In stock ({item.product.stock_count}{" "}
                                  available)
                                </span>
                              ) : (
                                <span className="text-red-600 text-sm">
                                  Out of stock
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updatingItems[item.id]}
                            className="text-red-500 absolute -right-2 hover:text-red-700 transition-colors p-1 ml-4"
                          >
                            <X size={22} />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between">
                          <div className="mb-4 md:mb-0">
                            {totalDiscount > 0 || (item.size?.discounted_price && parseFloat(item.size.discounted_price) < parseFloat(item.size?.price || item.price)) ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-red-600">
                                  ₹{unitPrice.toFixed(2)}
                                </span>
                                <span className="text-gray-400 line-through">
                                  ₹{basePrice.toFixed(2)}
                                </span>
                                <span className="text-green-600 text-sm font-medium">
                                  You save ₹{(basePrice - unitPrice).toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-red-600">
                                ₹{basePrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center border border-orange-300 rounded-xl overflow-hidden bg-orange-50">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={
                                updatingItems[item.id] || item.quantity <= 1
                              }
                              className="p-2 text-orange-700 hover:bg-orange-100 disabled:opacity-40"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="px-4 py-2 bg-white text-orange-900 font-medium min-w-[3rem] text-center">
                              {updatingItems[item.id] ? (
                                <div className="h-4 w-4 border-t-2 border-orange-500 rounded-full animate-spin mx-auto"></div>
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={
                                updatingItems[item.id] ||
                                item.quantity >= item.product.stock_count
                              }
                              className="p-2 text-orange-700 hover:bg-orange-100 disabled:opacity-40"
                            >
                              <Plus size={18} />
                            </button>
                          </div>

                          <div className="mt-4 md:mt-0 w-full md:w-auto">
                            <p className="text-lg font-bold text-orange-900">
                              Total: ₹{getItemTotal(item).toFixed(2)}
                            </p>
                            {itemDeliveryCharge > 0 && (
                              <p className="text-xs text-gray-500">
                                + ₹{itemDeliveryCharge.toFixed(2)} delivery
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-orange-100">
                          <button
                            onClick={() => toggleItemDetails(item.id)}
                            className="flex items-center text-orange-600 hover:text-orange-800"
                          >
                            <Info size={16} className="mr-1" />
                            {expandedItems[item.id]
                              ? "Hide details"
                              : "Show product details"}
                            {expandedItems[item.id] ? (
                              <ChevronUp size={16} className="ml-1" />
                            ) : (
                              <ChevronDown size={16} className="ml-1" />
                            )}
                          </button>

                          {expandedItems[item.id] && (
                            <div className="mt-3 space-y-3 animate-fadeIn">
                              <p className="text-sm text-gray-600">
                                {item.product.description}
                              </p>

                              {item.product.ingredients &&
                                item.product.ingredients.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-orange-800 mb-1">
                                      Ingredients:
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {item.product.ingredients
                                        .slice(0, 5)
                                        .map((ingredient) => (
                                          <span
                                            key={ingredient.id}
                                            className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full"
                                          >
                                            {ingredient.name}
                                          </span>
                                        ))}
                                      {item.product.ingredients.length > 5 && (
                                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                          +{item.product.ingredients.length - 5}{" "}
                                          more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                              {item.product.nutritional_facts &&
                                item.product.nutritional_facts.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-orange-800 mb-1">
                                      Nutritional Facts (per 100g):
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      {item.product.nutritional_facts.map(
                                        (fact) => (
                                          <div
                                            key={fact.id}
                                            className="flex justify-between"
                                          >
                                            <span className="text-gray-600">
                                              {fact.component}:
                                            </span>
                                            <span className="font-medium">
                                              {fact.value} {fact.unit}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-md sticky top-28">
                <h2 className="text-2xl font-bold text-orange-900 mb-6 pb-3 border-b border-orange-100">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({cartCount} items)
                    </span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -₹{discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">
                      {isFreeDelivery ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${deliveryCharge.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {hasDeliveryCharge && (
                    <div className="text-xs text-gray-500 bg-orange-50 p-2 rounded-lg">
                      💡 Delivery charges are calculated based on your items and location
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="border-t border-orange-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-orange-900">
                      Total Amount
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-red-600">
                        ₹{total.toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-500">
                        Inclusive of all taxes
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-bold text-lg mb-4"
                >
                  Proceed to Checkout
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">or</p>
                  <button
                    className="text-orange-600 hover:text-orange-800 font-medium mt-2 transition-colors"
                    onClick={() => navigate("/products")}
                  >
                    Continue Shopping
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-orange-100">
                  <div className="flex items-center justify-center gap-6 text-gray-500">
                    <div className="flex flex-col items-center text-center">
                      <Truck size={20} className="mb-1" />
                      <span className="text-xs">
                        {isFreeDelivery ? 'Free Shipping' : 'Reliable Delivery'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <RotateCcw size={20} className="mb-1" />
                      <span className="text-xs">Easy Returns</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Shield size={20} className="mb-1" />
                      <span className="text-xs">Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-md mt-6">
                <h3 className="font-bold text-orange-900 mb-4 flex items-center">
                  <Heart size={18} className="mr-2 text-red-400" />
                  Saved for Later (0 items)
                </h3>
                <p className="text-gray-500 text-sm">
                  You haven't saved any items for later.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
