import React, { useState } from "react";
import { FaExclamationTriangle, FaTimes, FaTrash } from "react-icons/fa";

const DeleteConfirmationModal = ({ user, onConfirm, onCancel }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!user) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-red-600 p-6 rounded-t-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaExclamationTriangle className="text-2xl" />
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:text-red-200 transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={user.profile_picture_url}
              alt={user.full_name}
              className="w-12 h-12 rounded-full border-2 border-red-200"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.full_name
                )}&background=DC2626&color=fff`;
              }}
            />
            <div>
              <h3 className="font-semibold text-[#7C2D12]">{user.full_name}</h3>
              <p className="text-[#9A3412] text-sm">{user.email}</p>
            </div>
          </div>

          <p className="text-[#1E293B] mb-2">
            This action will permanently delete the user account and all
            associated data.
          </p>
          <p className="text-red-600 font-semibold">
            This action cannot be undone.
          </p>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> User has been inactive for{" "}
              {user.inactive_days} days.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-[#FECACA] flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-[#FDBA74] text-[#9A3412] rounded-lg hover:bg-[#FFEDE9] transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg 
                ${
                  isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700 hover:shadow-xl"
                }`}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="mr-2" />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
