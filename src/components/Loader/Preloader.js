import React from "react";
import logo from "../../assets/images/Logo/logo3.png";
import "./LoaderCss/Loader.css"
const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999999] flex flex-col items-center justify-center bg-white/50 w-full h-[100vh]">
      <div className="relative w-44 h-44 ">
        {/* Animated logo */}
        <img
          src={logo}
          alt="Loading..."
          className="w-full h-full object-contain animate-pulse"
          style={{ animationDuration: "1.5s" }}
        />
        
      </div>
      
      {/* Progress bar */}
      <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"></div>
      </div>
    </div>
  );
};

export default Preloader;