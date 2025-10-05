// ProductReviews.jsx
import React from "react";

const ProductReviews = ({ reviews }) => {
  return (
    <div className="bg-white rounded-xl p-6 max-w-375:p-3 border border-[#FED7AA] shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-[#7C2D12] mb-4 pb-2 border-b border-[#FECACA]">
        Customer Reviews
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4 p-4 max-w-375:p-2 border-b border-[#FECACA] last:border-0">
            <img
              src={review.profile_picture_url || "/default-avatar.png"}
              alt={review.user_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#7C2D12]">{review.user_name}</h3>
                <div className="flex text-[#F97316]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "text-[#F97316]" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-2">{review.comment}</p>
              <div className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
                {review.verified_purchase && (
                  <span className="ml-2 text-green-600">✓ Verified Purchase</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;