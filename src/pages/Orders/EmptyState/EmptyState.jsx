import React from "react";
import { FaShoppingBag } from "react-icons/fa";

const EmptyState = ({ icon, message, buttonText, onButtonClick }) => (
  <div className="text-center py-10 text-gray-500">
    <div className="text-5xl mb-4 text-orange-200 flex items-center justify-center">{icon}</div>
    <p className="mb-5 text-lg font-semibold">{message}</p>
    {buttonText && (
      <button
        onClick={onButtonClick}
        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto font-semibold"
      >
        <FaShoppingBag /> {buttonText}
      </button>
    )}
  </div>
);

export default EmptyState;
