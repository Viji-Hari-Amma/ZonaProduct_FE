import React, { useState } from "react";

const ImageWithSpinner = ({
  src,
  alt,
  className = "",
  spinnerClass = "",
  ...props
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 z-10 ${spinnerClass}`}>
          <svg className="w-12 h-12 animate-spin text-orange-500" viewBox="0 0 50 50">
            <circle
              className="opacity-20"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
            />
            <path
              className="opacity-80"
              fill="currentColor"
              d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 1 0-15 15v5A20 20 0 0 1 25 5z"
            />
          </svg>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        className={`w-full h-full object-contain transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
        {...props}
      />
    </div>
  );
};

export default ImageWithSpinner;