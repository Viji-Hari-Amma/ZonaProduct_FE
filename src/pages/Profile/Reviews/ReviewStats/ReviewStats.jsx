import React from "react";

const ReviewStats = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews || 0;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-xl p-6 shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">Your Review Summary</h2>
      <div className="flex justify-around">
        <div className="text-center">
          <div className="text-4xl font-bold">{totalReviews}</div>
          <div className="text-amber-100">Total Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="text-amber-100">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">
            {new Set(reviews.map((r) => r.product.id)).size}
          </div>
          <div className="text-amber-100">Products Reviewed</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
