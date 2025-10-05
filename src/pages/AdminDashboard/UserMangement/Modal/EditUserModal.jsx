// components/UserManagement/EditUserModal.jsx
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUserCog,
  FaSave,
  FaUserShield,
  FaUserTie,
  FaUserCheck,
} from "react-icons/fa";

const EditUserModal = ({ user, onSave, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    is_active: false,
    is_staff: false,
    is_superuser: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        is_active: user.is_active || false,
        is_staff: user.is_staff || false,
        is_superuser: user.is_superuser || false,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      // If setting superuser to true, also set staff to true
      if (field === "is_superuser" && value === true) {
        return {
          ...prev,
          is_superuser: true,
          is_staff: true,
          [field]: value,
        };
      }
      // If setting staff to false and user is superuser, also set superuser to false
      if (field === "is_staff" && value === false && prev.is_superuser) {
        return {
          ...prev,
          is_superuser: false,
          is_staff: false,
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  if (!user) return null;

  const permissionItems = [
    {
      field: "is_active",
      label: "Active User",
      description: "User can login and use the system",
      icon: FaUserCheck,
      color: "green",
    },
    {
      field: "is_staff",
      label: "Staff Member",
      description: "User has access to admin interface",
      icon: FaUserTie,
      color: "blue",
    },
    {
      field: "is_superuser",
      label: "Super User",
      description: "User has all permissions without explicitly assigning them",
      icon: FaUserShield,
      color: "purple",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F97316] to-[#DC2626] p-6 rounded-t-xl text-white sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaUserCog className="text-2xl" />
              <h2 className="text-xl font-semibold">Edit User Permissions</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-[#FED7AA] transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <div className="mt-3 flex items-center space-x-3">
            <img
              src={user.profile_picture_url}
              alt={user.full_name}
              className="w-10 h-10 rounded-full border-2 border-white"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.full_name
                )}&background=fff&color=F97316`;
              }}
            />
            <div>
              <p className="font-semibold">{user.full_name}</p>
              <p className="text-[#FFE5E0] text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#7C2D12] mb-4">
              User Permissions
            </h3>

            {permissionItems.map((item) => (
              <div
                key={item.field}
                className="border border-[#FED7AA] rounded-lg p-4"
              >
                <label className="flex items-start space-x-3 cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={formData[item.field]}
                      onChange={(e) =>
                        handleChange(item.field, e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <item.icon className={`text-${item.color}-500`} />
                      <span className="font-medium text-[#1E293B]">
                        {item.label}
                      </span>
                      {formData[item.field] && (
                        <span
                          className={`bg-${item.color}-100 text-${item.color}-800 text-xs px-2 py-1 rounded-full`}
                        >
                          Enabled
                        </span>
                      )}
                    </div>
                    <p className="text-[#9CA3AF] text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                </label>

                {/* Dependency note */}
                {item.field === "is_superuser" && formData.is_superuser && (
                  <p className="text-xs text-purple-600 mt-2 ml-7">
                    ✓ Super user automatically includes staff permissions
                  </p>
                )}
                {item.field === "is_staff" &&
                  !formData.is_staff &&
                  formData.is_superuser && (
                    <p className="text-xs text-red-600 mt-2 ml-7">
                      ✗ Cannot remove staff permission while user is super user
                    </p>
                  )}
              </div>
            ))}
          </div>

          {/* Current Status Summary */}
          {/* <div className="mt-6 bg-[#FFEDE9] rounded-lg p-4">
            <h4 className="font-semibold text-[#7C2D12] mb-2">Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Active Status:</span>
                <span className={formData.is_active ? 'text-green-600 font-medium' : 'text-red-600'}>
                  {formData.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Staff Access:</span>
                <span className={formData.is_staff ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                  {formData.is_staff ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Super User:</span>
                <span className={formData.is_superuser ? 'text-purple-600 font-medium' : 'text-gray-600'}>
                  {formData.is_superuser ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div> */}

          {/* Actions */}
          <div className="flex space-x-3 pt-6 mt-4 border-t border-[#FECACA]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#FDBA74] text-[#9A3412] rounded-lg hover:bg-[#FFEDE9] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg 
                ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white hover:from-[#DC2626] hover:to-[#F97316] hover:shadow-xl"
                }`}
            >
              {isSaving ? (
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
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
