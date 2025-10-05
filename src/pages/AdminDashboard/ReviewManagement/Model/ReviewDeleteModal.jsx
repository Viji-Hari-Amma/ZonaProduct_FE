import React from "react";
import { FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";

const ReviewDeleteModal = ({
  showDeleteModal,
  setShowDeleteModal,
  selectedReview,
  actionLoading,
  onConfirm
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-[#FED7AA] animate-scaleIn">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <FiAlertTriangle className="text-red-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#7C2D12]">Delete Review</h3>
        </div>
        
        <p className="text-[#9A3412] mb-6">
          Are you sure you want to delete this review by <strong>{selectedReview?.user_name}</strong> for product <strong>{selectedReview?.product?.name}</strong>? This action cannot be undone.
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowDeleteModal(false)}
            disabled={actionLoading === `delete-${selectedReview?.id}`}
            className="flex items-center gap-2 px-4 py-2 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] disabled:opacity-50 transition-all duration-200 hover:scale-105"
          >
            <FiX size={16} />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={actionLoading === `delete-${selectedReview?.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.45)]"
          >
            {actionLoading === `delete-${selectedReview?.id}` ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 size={16} />
                Delete Review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDeleteModal;