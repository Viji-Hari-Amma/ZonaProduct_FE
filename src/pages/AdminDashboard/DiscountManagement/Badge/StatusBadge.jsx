// components/ui/StatusBadge.jsx
import React from 'react';

export const StatusBadge = ({ status, type }) => {
  const getStatusConfig = (status) => {
    const config = {
      active: { color: 'bg-green-500', text: 'Active' },
      expired: { color: 'bg-red-500', text: 'Expired' },
      upcoming: { color: 'bg-blue-500', text: 'Upcoming' },
      inactive: { color: 'bg-gray-500', text: 'Inactive' },
    };
    return config[status] || config.inactive;
  };

  const getTypeConfig = (type) => {
    const config = {
      universal: { color: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'Universal' },
      category: { color: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'Category' },
      product: { color: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'Product' },
    };
    return config[type] || { color: 'bg-gray-500', text: type };
  };

  if (status) {
    const { color, text } = getStatusConfig(status);
    return (
      <span className={`${color} text-white px-3 py-1 rounded-full text-xs font-medium`}>
        {text}
      </span>
    );
  }

  if (type) {
    const { color, text } = getTypeConfig(type);
    return (
      <span className={`${color} text-white px-3 py-1 rounded-full text-xs font-medium`}>
        {text}
      </span>
    );
  }

  return null;
};