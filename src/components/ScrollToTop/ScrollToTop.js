import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const { pathname } = useLocation();

  // 🔹 Auto scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // 🔹 Track scroll position for button + progress ring
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent = (scrollTop / docHeight) * 100;
      setScrollPercent(percent);
      setIsVisible(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Manual scroll to top when clicking button
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollPercent / 100) * circumference;

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-16 right-6 z-50 group"
        >
          <div className="relative w-16 h-16">
            {/* SVG Progress Ring */}
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="url(#grad)"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Button */}
            <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
              <FaArrowUp className="text-xl animate-bounce-slow" />
            </div>
          </div>
        </button>
      )}
    </>
  );
};
