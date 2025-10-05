// AddressSection.jsx
import React from 'react';
import AddressCard from './AddressCard';

const AddressSection = ({ addresses, onAddAddress, onEditAddress, onDeleteAddress }) => {
  return (
    <div className="address-section flex-1 min-w-[300px]">
      <h2 className="section-title text-2xl font-bold text-[#7C2D12] mb-5 pb-3 border-b-2 border-[#FECACA]">
        Your Addresses
      </h2>
      
      <div className="address-cards grid grid-cols-1 md:grid-cols-2 gap-5">
        {addresses.length > 0 ? (
          addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => onEditAddress(address)}
              onDelete={() => onDeleteAddress(address)}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-[#9A3412]">
            <i className="fas fa-map-marker-alt text-4xl mb-3 text-[#DC2626]"></i>
            <p>No addresses found. Add your first address!</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={onAddAddress}
          className="btn-primary bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-3 px-6 rounded-lg shadow-md shadow-[rgba(220,38,38,0.35)] font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#DC2626] hover:to-[#F97316] hover:shadow-lg hover:shadow-[rgba(220,38,38,0.45)] hover:scale-105"
        >
          <i className="fas fa-plus mr-2"></i> Add New Address
        </button>
      </div>
    </div>
  );
};

export default AddressSection;