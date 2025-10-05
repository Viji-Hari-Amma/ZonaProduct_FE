import React from "react";

const AddressCard = ({ address, onEdit, onDelete, loading }) => {
  return (
    <div className="address-card bg-white border border-[#FED7AA] rounded-xl shadow-md p-5 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-[#FFF5F0] relative">
      {address.is_default && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-1 px-3 rounded-full text-xs font-bold shadow-md">
          DEFAULT
        </div>
      )}

      <div className="flex items-center mb-2">
        <i className="fas fa-map-marker-alt text-[#DC2626] mr-3 w-5"></i>
        <span>{address.address}</span>
      </div>
      <div className="flex items-center mb-2">
        <i className="fas fa-city text-[#DC2626] mr-3 w-5"></i>
        <span>
          {address.city}, {address.state} {address.zip_code}
        </span>
      </div>
      <div className="flex items-center">
        <i className="fas fa-globe-americas text-[#DC2626] mr-3 w-5"></i>
        <span>{address.country}</span>
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={onEdit}
          disabled={loading}
          className="flex items-center border border-[#F97316] text-[#F97316] py-1 px-3 rounded font-semibold transition-colors hover:bg-[#F97316] hover:text-white disabled:opacity-50"
        >
          <i className="fas fa-pen mr-2"></i> Edit
        </button>

        <button
          onClick={onDelete}
          disabled={loading}
          className="flex items-center bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-1 px-3 rounded shadow-md hover:from-[#DC2626] hover:to-[#F97316] transition-all disabled:opacity-50"
        >
          {loading ? (
            <i className="fas fa-spinner animate-spin"></i>
          ) : (
            <>
              <i className="fas fa-trash mr-2"></i> Remove
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
