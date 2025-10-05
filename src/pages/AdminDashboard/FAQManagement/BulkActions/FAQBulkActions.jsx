// components/admin/faq/FAQBulkActions.jsx
import React from 'react';
import { FaTrash, FaPlus, FaCheck } from 'react-icons/fa';
import { LoadingButton } from '../../DiscountManagement/LoadingButton/LoadingButton';

const FAQBulkActions = ({ selectedCount, onBulkDelete, onAddNew }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-[#FED7AA] p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {selectedCount > 0 ? (
            <>
              <div className="flex items-center space-x-2 text-[#7C2D12]">
                <FaCheck className="text-green-600" />
                <span className="font-medium">{selectedCount} FAQ(s) selected</span>
              </div>
              <LoadingButton
                onClick={onBulkDelete}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <FaTrash className="mr-2" />
                Delete Selected
              </LoadingButton>
            </>
          ) : (
            <div className="text-[#9CA3AF]">
              Select FAQs to perform bulk actions
            </div>
          )}
        </div>

        <button
          onClick={onAddNew}
          className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium flex items-center"
        >
          <FaPlus className="mr-2" />
          Add New FAQ
        </button>
      </div>
    </div>
  );
};

export default FAQBulkActions;