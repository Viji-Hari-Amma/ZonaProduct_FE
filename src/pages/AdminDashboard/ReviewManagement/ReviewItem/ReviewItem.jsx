import React from "react";
import { FiUser, FiMail, FiCalendar, FiShoppingBag, FiCheckCircle, FiClock } from "react-icons/fi";

const ReviewItem = ({ 
  review, 
  onApprove, 
  onReject, 
  onEdit, 
  onDelete,
  actionLoading 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600 bg-[#FFEDE9] px-2 py-1 rounded-full">
          {rating}.0
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_6px_16px_rgba(220,38,38,0.15)] border border-[#FED7AA] hover:shadow-[0_10px_22px_rgba(249,115,22,0.25)] hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Info & Review Content */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={
                review.product?.images?.[0]?.image_url ||
                "/placeholder-product.jpg"
              }
              alt={review.product?.name}
              className="w-16 h-16 rounded-lg object-cover border border-[#FED7AA] group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[#7C2D12] text-lg mb-1">
                    {review.product?.name}
                  </h3>
                  <p className="text-[#9A3412] text-sm line-clamp-2">
                    {review.product?.description}
                  </p>
                </div>
                {/* Status Badge */}
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    review.is_approved
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  }`}
                >
                  {review.is_approved ? (
                    <>
                      <FiCheckCircle size={14} />
                      Approved
                    </>
                  ) : (
                    <>
                      <FiClock size={14} />
                      Pending
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="mb-4">
            {renderStars(review.rating)}
            <p className="text-[#1E293B] mt-3 leading-relaxed bg-[#FFF7ED] p-4 rounded-lg border border-[#FED7AA]">
              {review.comment}
            </p>
          </div>

          {/* User Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#9A3412]">
            <div className="flex items-center gap-2 bg-[#FFEDE9] px-3 py-1 rounded-full">
              <FiUser size={14} />
              <span className="font-medium">{review.user_name}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FFEDE9] px-3 py-1 rounded-full">
              <FiMail size={14} />
              <span>{review.user_email}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FFEDE9] px-3 py-1 rounded-full">
              <FiCalendar size={14} />
              <span>{formatDate(review.created_at)}</span>
            </div>
            {review.verified_purchase && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
                <FiShoppingBag size={12} />
                Verified Purchase
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col gap-2 lg:min-w-[200px]">
          <div className="flex lg:flex-col gap-2">
            {!review.is_approved && (
              <button
                onClick={() => onApprove(review)}
                disabled={actionLoading === `approve-${review.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(34,197,94,0.35)] hover:shadow-[0_6px_16px_rgba(34,197,94,0.45)] group"
              >
                {actionLoading === `approve-${review.id}` ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <FiCheckCircle size={18} />
                )}
                <span className="lg:hidden xl:inline">
                  {actionLoading === `approve-${review.id}` ? "Approving..." : "Approve"}
                </span>
              </button>
            )}

            {review.is_approved && (
              <button
                onClick={() => onReject(review)}
                disabled={actionLoading === `reject-${review.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_16px_rgba(245,158,11,0.45)] group"
              >
                {actionLoading === `reject-${review.id}` ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <FiClock size={18} />
                )}
                <span className="lg:hidden xl:inline">
                  {actionLoading === `reject-${review.id}` ? "Rejecting..." : "Reject"}
                </span>
              </button>
            )}

            <button
              onClick={() => onEdit(review)}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.45)] group"
            >
              <FiUser size={18} />
              <span className="lg:hidden xl:inline">Edit</span>
            </button>

            <button
              onClick={() => onDelete(review)}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.45)] group"
            >
              <FiShoppingBag size={18} />
              <span className="lg:hidden xl:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;