import React, { useState } from "react";

const EditProfileModal = ({ profile, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    email: profile.email || "",
    mobile: profile.mobile || "",
    date_of_birth: profile.date_of_birth || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = [
    { name: "first_name", label: "First Name", icon: "fa-user" },
    { name: "last_name", label: "Last Name", icon: "fa-user" },
    { name: "email", label: "Email", icon: "fa-envelope", type: "email" },
    { name: "mobile", label: "Mobile", icon: "fa-phone", type: "tel" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-[#7C2D12]">Edit Profile</h2>
            <button onClick={onClose} className="text-[#F97316] hover:text-[#DC2626]">
              <i className="fas fa-times text-lg sm:text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div className="mb-3" key={field.name}>
                <label className="block text-[#7C2D12] mb-1.5 font-medium text-sm sm:text-base">
                  {field.label}
                </label>
                <div className="relative flex items-center">
                  <i className={`fas ${field.icon} text-[#DC2626] absolute left-3`}></i>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-1.5 sm:py-2 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    required
                  />
                </div>
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-[#7C2D12] mb-1.5 font-medium text-sm sm:text-base">
                Date of Birth
              </label>
              <div className="relative flex items-center">
                <i className="fas fa-birthday-cake text-[#DC2626] absolute left-3"></i>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-1.5 sm:py-2 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-[#F97316] font-medium border border-[#FDBA74] rounded-lg hover:bg-[#FFEDE9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white font-medium rounded-lg shadow-md hover:from-[#DC2626] hover:to-[#F97316] transition-all disabled:opacity-50"
              >
                {loading ? <i className="fas fa-spinner animate-spin"></i> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
