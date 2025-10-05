import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaTimes,
  FaTrash,
  FaCheckCircle,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";

const RateProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  onDelete,
  product,
  orderId,
  initialRating = 0,
  initialComment = "",
  hasExistingReview = false,
  isLoading = false,
}) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initialComment || "");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Sync props when modal opens or changes
  useEffect(() => {
    if (isOpen) {
      setRating(initialRating || 0);
      setComment(initialComment || "");
    }
  }, [initialRating, initialComment, isOpen]);

  const handlePrimary = async () => {
    if (rating <= 0) {
      toast.warning("Please select a rating before submitting.");
      return;
    }

    if (!product?.id) {
      toast.error("Product information is missing. Cannot submit review.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        rating,
        comment: comment.substring(0, 300), // Ensure max length
        productId: product.id,
      };

      if (hasExistingReview) {
        await onUpdate(payload);
      } else {
        await onSubmit(payload);
      }
    } catch (error) {
      toast.error("Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (typeof onDelete !== "function") return;

    if (!product?.id) {
      toast.error("Product information is missing. Cannot delete review.");
      return;
    }

    try {
      setSubmitting(true);
      await onDelete();
    } catch (error) {
      toast.error("Delete failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Safe image URL with fallback
  const getImageUrl = () => {
    if (!product?.image_url) {
      return "https://via.placeholder.com/80x80?text=No+Image";
    }

    // Ensure the URL is valid
    try {
      new URL(product.image_url);
      return product.image_url;
    } catch {
      return "https://via.placeholder.com/80x80?text=Invalid+Image";
    }
  };

  // Character counter
  const characterCount = comment.length;
  const maxCharacters = 300;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Dim background */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal box */}
          <motion.div
            className="relative bg-white w-full max-w-lg mx-auto rounded-2xl shadow-2xl overflow-hidden border border-orange-200 max-h-[90vh] overflow-y-auto"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-semibold text-lg">
                {hasExistingReview ? "Update Your Review" : "Rate This Product"}
              </h3>
              <button
                onClick={onClose}
                className="text-white/90 hover:text-white text-xl transition-colors"
                disabled={submitting || isLoading}
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <>
                  {/* Product Info */}
                  <div className="flex items-center gap-4 border-b border-orange-100 pb-4">
                    <img
                      src={getImageUrl()}
                      alt={product?.name || "Product"}
                      className="w-16 h-16 object-cover rounded-lg border border-orange-200"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80x80?text=No+Image";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-red-800 truncate">
                        {product?.name || "Product Name"}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Order #{(orderId || "").substring(0, 8)}
                      </p>
                    </div>
                  </div>

                  {/* Existing Review Indicator */}
                  {hasExistingReview && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <FaCheckCircle className="text-green-500" />
                        <span className="font-semibold">
                          You've already reviewed this product
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-green-600">
                          <strong>Your previous rating:</strong> {initialRating}{" "}
                          star{initialRating !== 1 ? "s" : ""}
                        </p>
                        {initialComment && (
                          <p className="text-green-600">
                            <strong>Your previous comment:</strong> "
                            {initialComment}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Star Rating */}
                  <div className="text-center">
                    <p className="text-gray-600 mb-3">
                      {hasExistingReview
                        ? "Update your rating:"
                        : "How would you rate this product?"}
                    </p>
                    <div className="flex justify-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.95 }}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                          onClick={() => setRating(star)}
                          aria-label={`Rate ${star} star`}
                          className="text-3xl disabled:opacity-50"
                          disabled={submitting}
                        >
                          <FaStar
                            className={
                              (hover || rating) >= star
                                ? "text-orange-500 drop-shadow-sm"
                                : "text-gray-300"
                            }
                          />
                        </motion.button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      {rating === 0
                        ? "Select your rating"
                        : `You rated: ${rating} star${rating > 1 ? "s" : ""}`}
                    </p>
                  </div>

                  {/* Comment Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {hasExistingReview ? "Update your review" : "Your review"}{" "}
                      {!hasExistingReview && "(optional)"}
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value.substring(0, maxCharacters))
                      }
                      placeholder={
                        hasExistingReview
                          ? "Update your experience with this product..."
                          : "Share your experience with this product..."
                      }
                      rows={4}
                      className="w-full border border-orange-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-gray-700 disabled:opacity-50"
                      disabled={submitting}
                    />
                    <div
                      className={`text-right text-xs mt-1 ${
                        characterCount > maxCharacters * 0.8
                          ? "text-orange-600"
                          : "text-gray-400"
                      }`}
                    >
                      {characterCount}/{maxCharacters} characters
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-6 gap-3">
                    <button
                      onClick={onClose}
                      disabled={submitting}
                      className="px-5 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      disabled={rating === 0 || submitting}
                      onClick={handlePrimary}
                      className={`px-6 py-2 rounded-lg text-white font-medium transition-transform ${
                        rating === 0 || submitting
                          ? "bg-orange-200 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-red-600 hover:scale-105 shadow-md"
                      }`}
                    >
                      {submitting
                        ? "Saving..."
                        : hasExistingReview
                        ? "Update Review"
                        : "Submit Review"}
                    </button>
                  </div>

                  {/* Delete Review */}
                  {hasExistingReview && (
                    <div className="pt-3 border-t border-orange-100">
                      <button
                        onClick={handleDelete}
                        disabled={submitting}
                        className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <FaTrash /> Delete Review
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Use createPortal to render modal at document body level
  return ReactDOM.createPortal(modalContent, document.body);
};

export default RateProductModal;
