import React from "react";

const DeleteConfirmationModal = ({ onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#7C2D12]">Confirm Deletion</h2>
            <button onClick={onCancel} className="text-[#F97316] hover:text-[#DC2626]">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-[#7C2D12]">
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-[#F97316] font-medium border border-[#FDBA74] rounded-lg hover:bg-[#FFEDE9]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white font-medium rounded-lg shadow-md hover:from-[#B91C1C] hover:to-[#7F1D1D] disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-spinner animate-spin"></i>
              ) : (
                <>
                  <i className="fas fa-trash mr-2"></i> Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
