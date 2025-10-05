import React from "react";
import { FiCreditCard } from "react-icons/fi";

/**
 * @param {Object} props
 * @param {Array} props.items - Cart items array (each item has price, discounted_price, quantity)
 * @param {number} props.subtotal - Discounted subtotal (already calculated)
 * @param {number} props.deliveryCharge - Delivery charge
 * @param {number} props.totalAmount - Total amount
 */
const OrderSummary = ({ items = [], subtotal, deliveryCharge = 0, totalAmount }) => {
  // Enhanced price extraction to handle both cart items and buy now items
  const calculateOriginalTotal = (items) => {
    return items.reduce((acc, item) => {
      // Handle different item structures:
      // 1. Regular cart items: item.size?.price or item.price
      // 2. Buy now items: item.size?.price or item.product?.sizes?.[0]?.price
      let price = 0;
      
      if (item.size?.price) {
        // Item has size with price (both cart and buy now)
        price = parseFloat(item.size.price);
      } else if (item.price) {
        // Item has direct price
        price = parseFloat(item.price);
      } else if (item.product?.sizes?.[0]?.price) {
        // Buy now item with product and sizes
        price = parseFloat(item.product.sizes[0].price);
      }
      
      const quantity = item.quantity || 1;
      return acc + price * quantity;
    }, 0);
  };

  // Calculate original price (without discount)
  const originalTotal = calculateOriginalTotal(items);

  // Discount amount
  const discount = Math.max(0, originalTotal - subtotal);
  const total = totalAmount || (subtotal + deliveryCharge);

  // Show discount only if there is any
  const hasDiscount = discount > 0;
  const hasDeliveryCharge = deliveryCharge > 0;

  return (
    <div className="bg-[#FFEDE9] rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#7C2D12] mb-4 flex items-center">
        <FiCreditCard className="mr-2" /> Order Summary
      </h2>

      <div className="space-y-3">
        {hasDiscount ? (
          <>
            <div className="flex justify-between">
              <span>Original Price</span>
              <span className="line-through text-gray-400">
                ₹{originalTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discounted Price</span>
              <span className="text-green-700 font-semibold">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">-₹{discount.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>
            {hasDeliveryCharge ? (
              `₹${deliveryCharge.toFixed(2)}`
            ) : (
              <span className="text-green-600">Free</span>
            )}
          </span>
        </div>
        
        {hasDeliveryCharge && (
          <div className="text-xs text-gray-500 bg-orange-50 p-2 rounded-lg">
            💡 Delivery charges are calculated based on your items
          </div>
        )}
        
        <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
