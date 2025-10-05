// components/UserManagement/Card/UserCard.jsx
import React from 'react';
import { FaEdit, FaTrash, FaUser, FaCalendar, FaClock, FaUserShield, FaUserTie, FaCheck } from 'react-icons/fa';

const UserCard = ({ user, onEdit, onDelete, onSetActive }) => {
  const getStatusBadgeClass = (user) => {
    if (!user.is_active) return 'bg-red-100 text-red-800';
    if (user.requires_action) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (user) => {
    if (!user.is_active) return 'Inactive';
    if (user.requires_action) return 'Needs Attention';
    return 'Active';
  };

  const getUserRole = (user) => {
    if (user.is_superuser) return { text: 'Super User', color: 'bg-purple-100 text-purple-800', icon: FaUserShield };
    if (user.is_staff) return { text: 'Staff Member', color: 'bg-blue-100 text-blue-800', icon: FaUserTie };
    return { text: 'Regular User', color: 'bg-gray-100 text-gray-800', icon: FaUser };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const userRole = getUserRole(user);

  return (
    <div className="bg-white min-w-[320px] rounded-xl shadow-lg border border-[#FED7AA] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="p-6 border-b border-[#FECACA]">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.profile_picture_url}
              alt={user.full_name}
              className="w-16 h-16 rounded-full border-2 border-[#FED7AA]"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=F97316&color=fff`;
              }}
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusBadgeClass(user).split(' ')[0]}`}></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#7C2D12] text-lg truncate">{user.full_name}</h3>
            <p className="text-[#9A3412] text-sm truncate">{user.email}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${userRole.color}`}>
              <userRole.icon className="mr-1" size={10} />
              {userRole.text}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#9CA3AF] text-sm flex items-center">
            <FaUser className="mr-2" /> Status
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(user)}`}>
            {getStatusText(user)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#9CA3AF] text-sm flex items-center">
            <FaClock className="mr-2" /> Inactive Days
          </span>
          <span className="font-medium text-[#7C2D12]">{user.inactive_days}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#9CA3AF] text-sm flex items-center">
            <FaCalendar className="mr-2" /> Last Activity
          </span>
          <span className="font-medium text-[#7C2D12] text-sm">{formatDate(user.last_activity)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-[#FECACA] flex justify-end space-x-3">
        <button
          onClick={onEdit}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white rounded-lg hover:from-[#DC2626] hover:to-[#F97316] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <FaEdit className="mr-2" />
          Edit
        </button>
        
        {/* Show Set Active button for inactive users */}
        {!user.is_active && (
          <button
            onClick={onSetActive}
            className="flex items-center px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaCheck className="mr-2" />
            Activate
          </button>
        )}

        {/* Show Delete button for users requiring action */}
        {user.requires_action && (
          <button
            onClick={onDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;