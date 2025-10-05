// components/Loader/Spinner.jsx
import React from "react";

const Spinner = ({ size = "w-8 h-8", color = "border-blue-500" }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${color} ${size}`}
      />
    </div>
  );
};

export default Spinner;
