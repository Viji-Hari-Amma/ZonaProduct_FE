import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaBell,
  FaToggleOn,
  FaToggleOff,
  FaCalendarAlt,
  FaPercentage,
  FaBox,
  FaTags,
  FaGlobe,
} from "react-icons/fa";
import { StatusBadge } from "../Badge/StatusBadge";

export const DiscountCard = ({
  discount,
  onEdit,
  onDelete,
  onToggleActive,
  onSendNotification,
}) => {
  const [loading, setLoading] = useState({});
  const [showActions, setShowActions] = useState(false);

  if (!discount) {
    return null;
  }

  const handleAction = async (action, id) => {
    setLoading((prev) => ({ ...prev, [action]: true }));

    try {
      switch (action) {
        case "toggle":
          await onToggleActive(id);
          break;
        case "notify":
          await onSendNotification(id);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error in ${action}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  const getStatus = (discount) => {
    const now = new Date();
    const start = new Date(discount.start_date);
    const end = new Date(discount.end_date);

    if (!discount.is_active) return "inactive";
    if (now < start) return "upcoming";
    if (now > end) return "expired";
    return "active";
  };

  const getDiscountTarget = () => {
    switch (discount.discount_type) {
      case "product":
        return discount.product
          ? {
              type: "product",
              name: discount.product.name,
              id: discount.product.id,
              price: discount.product.base_price,
              image: discount.product.images?.[0]?.image_url,
            }
          : null;

      case "category":
        return discount.category
          ? {
              type: "category",
              name: discount.category.name,
              id: discount.category.id,
              productsCount: discount.category.products_count,
              sampleProducts: discount.category.sample_products,
            }
          : null;

      case "universal":
        return discount.universal
          ? {
              type: "universal",
              productsCount: discount.universal.products_count,
              sampleProducts: discount.universal.sample_products,
            }
          : null;

      default:
        return null;
    }
  };

  const status = getStatus(discount);
  const target = getDiscountTarget();

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-xl border border-orange-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-brown-800">
              {discount.name}
            </h3>
            <StatusBadge type={discount.discount_type} />
            <StatusBadge status={status} />
          </div>

          {discount.description && (
            <p className="text-gray-600 mb-3 text-sm">{discount.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <FaPercentage className="text-orange-500" />
              <span className="font-semibold text-brown-700">
                {discount.percentage}% OFF
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-orange-500" />
              <span>
                {new Date(discount.start_date).toLocaleDateString()} -{" "}
                {new Date(discount.end_date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Discount Target Details */}
          {target && (
            <div className="mb-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                {target.type === "product" && (
                  <FaBox className="text-blue-500" />
                )}
                {target.type === "category" && (
                  <FaTags className="text-green-500" />
                )}
                {target.type === "universal" && (
                  <FaGlobe className="text-purple-500" />
                )}
                <span className="font-medium text-brown-700 capitalize">
                  {target.type} Discount
                </span>
              </div>

              {target.type === "product" && (
                <div className="flex items-center gap-3">
                  {target.image && (
                    <img
                      src={target.image}
                      alt={target.name}
                      className="w-10 h-10 rounded-lg object-cover border border-orange-200"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {target.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Price: {formatPrice(target.price)}
                    </p>
                  </div>
                </div>
              )}

              {target.type === "category" && (
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {target.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Applies to {target.productsCount || 0} products
                  </p>
                  {target.sampleProducts &&
                    target.sampleProducts.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {target.sampleProducts
                          .slice(0, 3)
                          .map((product, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1"
                            >
                              {product.images?.[0]?.image_url && (
                                <img
                                  src={product.images[0].image_url}
                                  alt={product.name}
                                  className="w-6 h-6 rounded border border-gray-300"
                                />
                              )}
                              <span className="text-xs text-gray-500">
                                {product.name}
                              </span>
                            </div>
                          ))}
                        {target.sampleProducts.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{target.sampleProducts.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                </div>
              )}

              {target.type === "universal" && (
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    All Products
                  </p>
                  <p className="text-xs text-gray-600">
                    Applies to {target.productsCount || 0} products
                  </p>
                  {target.sampleProducts &&
                    target.sampleProducts.length > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {target.sampleProducts
                          .slice(0, 4)
                          .map((product, index) => (
                            <img
                              key={index}
                              src={product.images?.[0]?.image_url}
                              alt={product.name}
                              className="w-6 h-6 rounded border border-gray-300"
                              title={product.name}
                            />
                          ))}
                        {target.sampleProducts.length > 4 && (
                          <span className="text-xs text-gray-400 self-center">
                            +{target.sampleProducts.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {/* Product Sizes (for product discounts) */}
          {target?.type === "product" && discount.product?.sizes && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-1">
                Available Sizes:
              </p>
              <div className="flex flex-wrap gap-1">
                {discount.product.sizes.slice(0, 3).map((size, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 border"
                  >
                    {size.label}
                    {size.unit ? size.unit : ""} - {formatPrice(size.price)}
                  </span>
                ))}
                {discount.product.sizes.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-400 border">
                    +{discount.product.sizes.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showActions && (
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-orange-200 py-2 z-10 min-w-48">
              <button
                onClick={() => {
                  onEdit(discount);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center gap-2 text-sm text-gray-700"
              >
                <FaEdit className="text-blue-500" />
                Edit Discount
              </button>

              <button
                onClick={() => handleAction("toggle", discount.id)}
                disabled={loading.toggle}
                className="w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center gap-2 text-sm text-gray-700"
              >
                {discount.is_active ? (
                  <FaToggleOff className="text-orange-500" />
                ) : (
                  <FaToggleOn className="text-green-500" />
                )}
                {loading.toggle
                  ? "Updating..."
                  : discount.is_active
                  ? "Deactivate"
                  : "Activate"}
              </button>

              <button
                onClick={() => handleAction("notify", discount.id)}
                disabled={loading.notify || discount.notification_sent}
                className={`w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center gap-2 text-sm ${
                  discount.notification_sent ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <FaBell
                  className={
                    discount.notification_sent
                      ? "text-green-500"
                      : "text-yellow-500"
                  }
                />
                {loading.notify
                  ? "Sending..."
                  : discount.notification_sent
                  ? "Notification Sent"
                  : "Send Notification"}
              </button>

              <hr className="my-1" />

              <button
                onClick={() => {
                  onDelete(discount);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center gap-2 text-sm text-red-600"
              >
                <FaTrash />
                Delete Discount
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          Created: {new Date(discount.created_at).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              discount.notification_sent ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span>
            {discount.notification_sent ? "Notified" : "Pending Notification"}
          </span>
        </div>
      </div>
    </div>
  );
};
