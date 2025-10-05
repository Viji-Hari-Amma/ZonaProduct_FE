import React, { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";

const EditReviewModal = ({ review, onSave, onClose }) => {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(review.id, { rating, comment });
      onClose();
    } catch (err) {
      console.error("Error updating review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setRating(i + 1)}
        className={`text-2xl ${
          i < rating ? "text-amber-400" : "text-gray-300"
        } hover:text-amber-500`}
      >
        <FaStar />
      </button>
    ));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-brown-900">Edit Your Review</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="mb-4 flex items-center">
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-200 mr-3">
            <img
              src={review.product.images[0]?.image_url || "/placeholder-product.jpg"}
              alt={review.product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium">{review.product.name}</h4>
            <p className="text-sm text-gray-600">
              {review.product.category.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <div className="flex">{renderStars(rating)}</div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-white bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;
