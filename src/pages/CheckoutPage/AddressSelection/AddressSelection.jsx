import React, { useEffect } from "react";
import { FiMapPin, FiPlus } from "react-icons/fi";

const AddressSelection = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onEditAddress,
  onAddAddress,
}) => {
  // Auto-select default address or the first one
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        onSelectAddress(defaultAddress.id);
      } else {
        onSelectAddress(addresses[0].id);
      }
    }
  }, [addresses, selectedAddressId, onSelectAddress]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-[#FED7AA]">
      <h2 className="text-xl font-semibold text-[#7C2D12] mb-4 flex items-center">
        <FiMapPin className="mr-2" /> Delivery Address
      </h2>

      <div className="space-y-4 mb-6">
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.id} className="flex items-start">
              <input
                type="radio"
                id={`address-${address.id}`}
                name="address"
                checked={selectedAddressId === address.id}
                onChange={() => onSelectAddress(address.id)}
                className="mt-1 mr-3 text-[#F97316] focus:ring-[#F97316]"
              />
              <label htmlFor={`address-${address.id}`} className="flex-1">
                <div
                  className={`p-4 rounded-lg border ${
                    selectedAddressId === address.id
                      ? "border-[#F97316] bg-[#FFF5F0]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{address.address}</p>
                      <p className="text-gray-600">
                        {address.city}, {address.state}
                      </p>
                      <p className="text-gray-600">
                        {address.country} - {address.zip_code}
                      </p>
                    </div>
                    {address.is_default && (
                      <span className="bg-[#F97316] text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onEditAddress(address)}
                    className="mt-2 text-[#F97316] text-sm hover:text-[#DC2626]"
                  >
                    Edit
                  </button>
                </div>
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-600">
            No addresses found. Please add an address.
          </p>
        )}
      </div>

      <button
        onClick={onAddAddress}
        className="flex items-center text-[#F97316] font-medium hover:text-[#DC2626]"
      >
        <FiPlus className="mr-1" /> Add New Address
      </button>
    </div>
  );
};

export default AddressSelection;