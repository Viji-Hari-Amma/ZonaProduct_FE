import React from "react";
import { FiEdit, FiStar, FiX } from "react-icons/fi";

const ReviewEditModal = ({
  showEditModal,
  setShowEditModal,
  selectedReview,
  editForm,
  setEditForm,
  actionLoading,
  onSubmit
}) => {
  if (!showEditModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl border border-[#FED7AA] animate-scaleIn max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#7C2D12] flex items-center gap-2">
            <FiEdit className="text-[#F97316]" />
            Edit Review
          </h3>
          <button
            onClick={() => setShowEditModal(false)}
            className="p-2 hover:bg-[#FFEDE9] rounded-lg transition-colors duration-200"
          >
            <FiX size={20} className="text-[#7C2D12]" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Product Info */}
          {selectedReview?.product && (
            <div className="bg-[#FFEDE9] p-4 rounded-lg border border-[#FED7AA]">
              <h4 className="font-semibold text-[#7C2D12] mb-2">Product</h4>
              <div className="flex items-center gap-3">
                <img
                  src={selectedReview.product.images[0]?.image_url || "/placeholder-product.jpg"}
                  alt={selectedReview.product.name}
                  className="w-12 h-12 rounded-lg object-cover border border-[#FED7AA]"
                />
                <div>
                  <p className="font-medium text-[#7C2D12]">{selectedReview.product.name}</p>
                  <p className="text-sm text-[#9A3412]">By {selectedReview.user_name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-[#7C2D12] font-medium mb-3">
              Rating *
            </label>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setEditForm((prev) => ({ ...prev, rating: star }))
                  }
                  className="p-2 hover:scale-110 transform transition-all duration-200"
                >
                  <FiStar
                    className={`${
                      star <= editForm.rating
                        ? "fill-current text-yellow-400"
                        : "text-gray-300"
                    } transition-colors duration-200`}
                    size={32}
                  />
                </button>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-[#9A3412]">
                Selected: {editForm.rating} star{editForm.rating !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-[#7C2D12] font-medium mb-2">
              Review Comment *
            </label>
            <textarea
              value={editForm.comment}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              rows="6"
              className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Enter review comment..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-[#FECACA]">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              disabled={actionLoading === `edit-${selectedReview?.id}`}
              className="flex items-center gap-2 px-6 py-3 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] disabled:opacity-50 transition-all duration-200 hover:scale-105"
            >
              <FiX size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading === `edit-${selectedReview?.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white rounded-lg hover:from-[#DC2626] hover:to-[#F97316] disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.45)]"
            >
              {actionLoading === `edit-${selectedReview?.id}` ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating Review...
                </>
              ) : (
                <>
                  <FiEdit size={16} />
                  Update Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewEditModal;