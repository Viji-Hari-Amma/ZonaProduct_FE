import React from 'react';
import { FaBars } from 'react-icons/fa';
import { ProfileIcon } from '../ProfileIcon/ProfileIcon';

const Topbar = ({ setSidebarOpen }) => {

  return (
    <header className="bg-white shadow-sm border-b border-card-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden text-heading"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="text-xl" />
          </button>
          
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-muted-text" />
            </div>
            <input
              type="text"
              className="block w-64 pl-10 pr-3 py-2 border border-input-border rounded-full focus:outline-none focus:ring-2 focus:ring-focused-input focus:border-transparent"
              placeholder="Search..."
            />
          </div> */}
        </div>

        {/* Right side - Notifications and profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <div className="relative">
            <button className="relative p-2 text-secondary-text hover:text-primary-orange transition-colors">
              <FaBell className="text-xl" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div> */}

          {/* Profile dropdown */}
          <div className='relative right-5'>
              <ProfileIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;