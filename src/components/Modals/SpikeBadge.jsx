import React from "react";

const SpikeBadge = ({ size = 150, color = "#F43F5E", label }) => {
  return (
    <div className="relative w-fit h-fit">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          fill={color}
          points="50,5 61,15 75,10 80,25 95,30 90,45 100,55 90,65 95,80 80,85 
                75,100 61,95 50,100 39,95 25,100 20,85 5,80 10,65 0,55 10,45 5,30 20,25 25,10 39,15"
        />
      </svg>
      <div className="absolute left-[10px] top-3 text-white text-[15px]">
        {label}
      </div>
    </div>
  );
};

export default SpikeBadge;
