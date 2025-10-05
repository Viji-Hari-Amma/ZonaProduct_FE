import React from "react";

const BuyNowItem = ({ product, selectedSize, quantity }) => {
  if (!product) {
    return <div>No product information available</div>;
  }

  const price = selectedSize
    ? parseFloat(selectedSize.discounted_price || selectedSize.price)
    : parseFloat(product.base_price);

  const deliveryCharge = selectedSize
    ? parseFloat(selectedSize.delivery_charge || 0)
    : 0;

  const totalPrice = price * (quantity || 1);

  return (
    <div className="border border-[#FED7AA] rounded-lg p-4 bg-white">
      <div className="flex items-center space-x-4">
        <img
          src={product.images?.[0]?.image_url}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="w-full">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-[#7C2D12]">{product.name}</h3>
            {selectedSize && (
              <p className="text-sm text-gray-600">
                Size: {selectedSize.label} {selectedSize.unit}
                {deliveryCharge > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    (₹{deliveryCharge.toFixed(2)} delivery)
                  </span>
                )}
              </p>
            )}
            <p className="text-sm text-gray-600">Quantity: {quantity}</p>
          </div>
          <div className="w-full  flex items-center justify-between mt-3">
            <p className="font-semibold text-[#DC2626]">₹{price.toFixed(2)}</p>
            <p className="text-sm text-gray-600">
              Total: ₹{totalPrice.toFixed(2)}
            </p>
            {deliveryCharge > 0 && (
              <p className="text-xs text-gray-500">
                + ₹{deliveryCharge.toFixed(2)} delivery
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowItem;
