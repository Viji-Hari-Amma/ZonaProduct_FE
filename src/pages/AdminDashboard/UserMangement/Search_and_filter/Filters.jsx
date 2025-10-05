// components/UserManagement/Filters.jsx
import React from 'react';
import { FaUsers, FaUserCheck, FaUserTimes, FaExclamationTriangle, FaUserShield, FaUserTie } from 'react-icons/fa';

const Filters = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'all', label: 'All Users', icon: FaUsers },
    { key: 'active', label: 'Active', icon: FaUserCheck },
    { key: 'inactive', label: 'Inactive', icon: FaUserTimes },
    { key: 'requires_action', label: 'Requires Action', icon: FaExclamationTriangle },
    { key: 'superusers', label: 'Super Users', icon: FaUserShield },
    { key: 'staff', label: 'Staff Members', icon: FaUserTie }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex items-center px-4 py-2 rounded-full border transition-all duration-300 ${
            activeTab === tab.key
              ? 'bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white border-transparent shadow-lg'
              : 'border-[#FDBA74] text-[#9A3412] hover:bg-[#FFEDE9]'
          }`}
        >
          <tab.icon className="mr-2" />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Filters;