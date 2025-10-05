import React, { useState } from "react";
import { FaStar, FaEdit, FaTrash, FaUser, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-amber-400" : "text-gray-300"}>
        <FaStar className="inline-block" />
      </span>
    ));

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white rounded-xl border border-amber-200 shadow-lg shadow-red-100 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 p-6 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div
          onClick={() => navigate(`/products/${review.product.id}`)}
          className="flex items-center cursor-pointer"
        >
          <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-amber-300 mr-4">
            <img
              src={
                review.product.images[0]?.image_url ||
                "/placeholder-product.jpg"
              }
              alt={review.product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-brown-900 text-lg">
              {review.product.name}
            </h3>
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {review.product.category.name}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(review)}
            className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-full"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(review.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="flex items-center mb-3">
        <div className="flex mr-2">{renderStars(review.rating)}</div>
        <span className="text-amber-700 font-medium">{review.rating}.0</span>
      </div>

      <div className="mb-4">
        <p className={`text-gray-700 ${isExpanded ? "" : "line-clamp-3"}`}>
          {review.comment}
        </p>
        {review.comment.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-amber-600 hover:text-amber-800 text-sm font-medium mt-1"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-amber-100">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-300 mr-2">
            {review.profile_picture_url ? (
              <img
                src={review.profile_picture_url}
                alt={review.user_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-200 flex items-center justify-center">
                <FaUser className="text-amber-600" />
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-brown-800">
            {review.user_name}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(review.created_at)}
          {review.verified_purchase && (
            <span className="ml-2 text-green-600 flex items-center">
              <FaCheck className="inline mr-1" /> Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
