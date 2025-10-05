import { useState } from "react";
import { FaExclamationTriangle, FaTrash, FaTimes } from "react-icons/fa";

const DeleteConfirmationModal = ({ 
  contactToDelete, 
  selectedContactsCount, 
  onConfirm, 
  onCancel,
  onSuccess 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isBulkDelete = Array.isArray(contactToDelete);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      if (isBulkDelete) {
        // For bulk delete, delete each contact individually
        for (const contactId of contactToDelete) {
          await onConfirm(contactId);
        }
      } else {
        // For single delete
        await onConfirm(contactToDelete);
      }
      onSuccess();
    } catch (error) {
      // Error handling is done in the onConfirm function
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] p-6 text-white rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <FaExclamationTriangle className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isBulkDelete ? `Delete ${selectedContactsCount} Messages` : "Delete Message"}
                </h2>
                <p className="mt-1 opacity-90 text-sm">
                  {isBulkDelete 
                    ? "This action will permanently delete the selected messages." 
                    : "This action cannot be undone."
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="text-white hover:text-gray-200 text-xl transition-colors disabled:opacity-50"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <FaExclamationTriangle className="text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Warning: Irreversible Action</p>
              <p className="text-red-700 text-sm mt-1">
                {isBulkDelete 
                  ? `You are about to delete ${selectedContactsCount} contact messages. This action cannot be undone.`
                  : "You are about to delete this contact message. This action cannot be undone."
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash />
                  {isBulkDelete ? `Delete ${selectedContactsCount} Messages` : "Delete Message"}
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