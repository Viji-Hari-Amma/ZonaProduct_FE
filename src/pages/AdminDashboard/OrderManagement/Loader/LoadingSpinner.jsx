// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-amber-900 mt-4 text-lg">Loading orders...</p>
        <p className="text-red-600 mt-2">Please wait while we fetch your data</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;