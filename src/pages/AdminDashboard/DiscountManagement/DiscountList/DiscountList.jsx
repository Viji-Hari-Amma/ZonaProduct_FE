// components/discounts/DiscountList.jsx
import React from "react";
import { DiscountCard } from "../Card/DiscountCard";

export const DiscountList = ({
  discounts,
  onEdit,
  onDelete,
  onToggleActive,
  onSendNotification,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-orange-200 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            <div className="h-16 bg-gray-100 rounded mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!discounts || discounts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🎯</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No discounts found
        </h3>
        <p className="text-gray-500">
          Create your first discount to get started
        </p>
      </div>
    );
  }

  // Filter out any undefined discounts and sort by creation date (newest first)
  const validDiscounts = discounts
    .filter((discount) => discount && discount.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {validDiscounts.map((discount) => (
        <DiscountCard
          key={discount.id}
          discount={discount}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          onSendNotification={onSendNotification}
        />
      ))}
    </div>
  );
};
