import React, { useState, useEffect } from "react";
import {
  listUserReviews,
  updateReview,
  deleteReview,
} from "../../../services/reviewApi/reviewApi";
import { FaStar } from "react-icons/fa";
import ReviewStats from "./ReviewStats/ReviewStats";
import ReviewCard from "./ReviewCard/ReviewCard";
import EditReviewModal from "./EditReviewModal/EditReviewModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal/DeleteConfirmationModal";
import { toast  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserReview = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserReviews();
    }
  }, [userId]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const userReviews = await listUserReviews(userId);
      setReviews(userReviews.data);
    } catch (err) {
      setError("Failed to load reviews. Please try again later.");
      toast.error("❌ Failed to load your reviews");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => setEditingReview(review);

  const handleSaveReview = async (reviewId, updatedData) => {
    try {
      const reviewToUpdate = reviews.find((review) => review.id === reviewId);
      if (!reviewToUpdate) throw new Error("Review not found");

      await updateReview(reviewToUpdate.product.id, reviewId, updatedData);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, ...updatedData } : review
        )
      );

      toast.success("✅ Review updated successfully!");
    } catch (err) {
      toast.error("❌ Failed to update review");
      console.error("Error updating review:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const reviewToDelete = reviews.find((review) => review.id === reviewId);
      if (!reviewToDelete) throw new Error("Review not found");

      await deleteReview(reviewToDelete.product.id, reviewId);

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );

      toast.success("🗑️ Review deleted successfully!");
    } catch (err) {
      toast.error("❌ Failed to delete review");
      console.error("Error deleting review:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-800">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={fetchUserReviews}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-brown-900 mb-2">
            Your Ratings & Reviews
          </h1>
          <p className="text-amber-700">
            Here's what you've shared about our products
          </p>
        </div>

        {reviews.length > 0 ? (
          <>
            <ReviewStats reviews={reviews} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={handleEditReview}
                  onDelete={setDeletingReviewId}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FaStar className="text-amber-600 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-brown-900 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-amber-700 mb-6">
              You haven't reviewed any products yet. Your reviews will appear
              here once you submit them.
            </p>
            <button className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg transition-all">
              Browse Products
            </button>
          </div>
        )}

        {editingReview && (
          <EditReviewModal
            review={editingReview}
            onSave={handleSaveReview}
            onClose={() => setEditingReview(null)}
          />
        )}

        {deletingReviewId && (
          <DeleteConfirmationModal
            reviewId={deletingReviewId}
            onConfirm={handleDeleteReview}
            onClose={() => setDeletingReviewId(null)}
          />
        )}
      </div>
    </div>
  );
};
