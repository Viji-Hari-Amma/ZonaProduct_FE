// src/pages/Forbidden/Forbidden.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaArrowLeft,
  FaHome,
  FaExclamationTriangle,
} from "react-icons/fa";

const Forbidden = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-6">
      <div
        className={`max-w-lg w-full text-center transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-200 animate-pulse">
            <FaLock className="text-white text-5xl" />
          </div>

          {/* Pulse Animation */}
          <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full opacity-20 animate-ping"></div>

          {/* Warning Icon */}
          <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2 shadow-lg animate-bounce">
            <FaExclamationTriangle className="text-white text-sm" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Error Code */}
          <div className="relative">
            <h1 className="text-9xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent animate-pulse">
              403
            </h1>
            <div className="absolute inset-0 text-9xl font-black text-gray-200 -z-10 animate-pulse">
              403
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 animate-fade-in">
            Access Denied
          </h2>

          {/* Message */}
          <p className="text-lg text-gray-600 leading-relaxed animate-fade-in-delay">
            Oops! It seems you've stumbled upon a restricted area.
            <br />
            You don't have permission to view this page.
          </p>

          {/* Animated Divider */}
          <div className="flex items-center justify-center space-x-4 animate-fade-in-delay-2">
            <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-20"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-20"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-3">
            <button
              onClick={() => navigate(-1)}
              className="group px-8 py-4 rounded-xl border-2 border-orange-500 text-orange-500 font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-200 hover:scale-105"
            >
              <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-orange-300 hover:scale-105 hover:from-orange-600 hover:to-red-700"
            >
              <FaHome className="transition-transform duration-300 group-hover:scale-110" />
              Go to Home
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-xl animate-fade-in-delay-4">
            <p className="text-sm text-orange-700">
              <strong>Need help?</strong> Contact support if you believe this is
              an error.
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-orange-300 rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-red-300 rounded-full opacity-40 animate-float-delay"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-orange-400 rounded-full opacity-70 animate-float-delay-2"></div>
        <div className="absolute bottom-10 right-10 w-5 h-5 bg-red-400 rounded-full opacity-50 animate-float"></div>
      </div>

      {/* Add custom animations to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.9s both;
        }
        .animate-fade-in-delay-4 {
          animation: fade-in 0.8s ease-out 1.2s both;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out infinite 2s;
        }
        .animate-float-delay-2 {
          animation: float 6s ease-in-out infinite 4s;
        }
      `}</style>
    </div>
  );
};

export default Forbidden;
