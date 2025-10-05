import React, { useState } from "react";

const AddressFormModal = ({ address, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    address: address?.address || "",
    city: address?.city || "",
    state: address?.state || "",
    country: address?.country || "",
    zip_code: address?.zip_code || "",
    is_default: address?.is_default || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = [
    { name: "address", label: "Address", icon: "fa-home" },
    { name: "city", label: "City", icon: "fa-city" },
    { name: "state", label: "State", icon: "fa-map" },
    { name: "country", label: "Country", icon: "fa-flag" },
    { name: "zip_code", label: "ZIP Code", icon: "fa-mail-bulk" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-[#7C2D12]">
              {address ? "Edit Address" : "Add New Address"}
            </h2>
            <button onClick={onClose} className="text-[#F97316] hover:text-[#DC2626]">
              <i className="fas fa-times text-lg sm:text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.name} className="mb-3">
                <label className="block text-[#7C2D12] mb-1.5 font-medium text-sm sm:text-base">
                  {field.label}
                </label>
                <div className="relative flex items-center">
                  <i className={`fas ${field.icon} text-[#DC2626] absolute left-3`}></i>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-1.5 sm:py-2 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    required
                  />
                </div>
              </div>
            ))}

            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="h-4 w-4 text-[#F97316] focus:ring-[#F97316] border-[#FDBA74] rounded"
              />
              <span className="text-[#7C2D12] text-sm sm:text-base">
                Set as default address
              </span>
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
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white font-medium rounded-lg shadow-md hover:from-[#DC2626] hover:to-[#F97316] disabled:opacity-50"
              >
                {loading ? (
                  <i className="fas fa-spinner animate-spin"></i>
                ) : address ? (
                  "Update Address"
                ) : (
                  "Add Address"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;
