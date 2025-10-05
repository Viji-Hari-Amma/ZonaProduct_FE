// components/UserManagement/Modal/NotificationModal.jsx
import React, { useState } from "react";
import { FaTimes, FaBell, FaCheck } from "react-icons/fa";

const NotificationModal = ({ users, onSendAll, onSendSpecific, onClose }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const toggleUserSelection = (userId) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendSpecific = () => {
    if (selectedUserIds.length === 0) {
      alert("Please select at least one user");
      return;
    }
    onSendSpecific(selectedUserIds);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-t-xl text-white sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaBell className="text-2xl" />
              <h2 className="text-xl font-semibold">Send Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-yellow-200 transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <p className="mt-2 text-yellow-100">
            Send notifications to users requiring action
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Send to All Button */}
          <div className="mb-6">
            <button
              onClick={onSendAll}
              className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
            >
              <FaBell className="mr-2" />
              Send Notification to All {users.length} Users
            </button>
          </div>

          {/* Or Select Specific Users */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Or select specific users:
            </h3>
            
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {users.map(user => (
                <div key={user.id} className="flex items-center p-3 border-b last:border-b-0">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.user_id)}
                    onChange={() => toggleUserSelection(user.user_id)}
                    className="mr-3"
                  />
                  <img
                    src={user.profile_picture_url}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-red-600">{user.inactive_days} inactive days</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSendSpecific}
              disabled={selectedUserIds.length === 0}
              className={`w-full mt-4 py-3 rounded-lg flex items-center justify-center transition-colors ${
                selectedUserIds.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              <FaCheck className="mr-2" />
              Send to Selected Users ({selectedUserIds.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;