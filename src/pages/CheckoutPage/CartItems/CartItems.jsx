import React from "react";
import { FiPackage } from "react-icons/fi";

const CartItems = ({ items }) => {

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-[#FED7AA]">
        <h2 className="text-xl font-semibold text-[#7C2D12] mb-4 flex items-center">
          <FiPackage className="mr-2" /> Cart Items
        </h2>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-[#FED7AA]">
      <h2 className="text-xl font-semibold text-[#7C2D12] mb-4 flex items-center">
        <FiPackage className="mr-2" /> Cart Items
      </h2>

      <div className="space-y-4">
        {items.map((item) => {
          const itemDeliveryCharge = parseFloat(item.size?.delivery_charge || item.delivery_charge || 0);
          
          return (
            <div
              key={item.id}
              className="flex border-b border-gray-100 pb-4 last:border-0"
            >
              <img
                src={
                  item.product?.images?.[0]?.image_url || "/placeholder-image.jpg"
                }
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{item.product?.name}</h3>
                <p className="text-gray-600 text-sm">
                  {item.size?.label} {item.size?.unit}
                  {itemDeliveryCharge > 0 && (
                    <span className="ml-2 text-xs text-gray-500">
                      (₹{itemDeliveryCharge.toFixed(2)} delivery)
                    </span>
                  )}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <span className="text-[#DC2626] font-semibold">
                      ₹{item.size?.discounted_price || item.discounted_price}
                    </span>
                    {item.size?.discounted_price < item.size?.price && (
                      <span className="ml-2 text-gray-500 line-through text-sm">
                        ₹{item.size?.price}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600">Qty: {item.quantity}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartItems;
