import React, { useState, useEffect, useCallback, useRef } from "react";
import CarouselSlide from "./CarouselSlide";
import { getCarouselData } from "../../../services/HomePage/HomePageAPI";

const Carousel = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For drag/swipe
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  // Interval ref (so we can clear/reset autoplay)
  const intervalRef = useRef(null);

  const fetchCarouselItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCarouselData();

      if (response.status === "success") {
        // Only keep items where is_active === true
        const activeItems = (response.data || []).filter(
          (item) => item.is_active
        );
        setCarouselItems(activeItems);
        setError(null);
      } else {
        setError(response.message || "Failed to load carousel items");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarouselItems();
  }, [fetchCarouselItems]);

  // Reset autoplay timer
  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (carouselItems.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === carouselItems.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
  };

  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, [carouselItems]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
    resetInterval();
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
    resetInterval();
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetInterval();
  };

  // Mouse/touch handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX || e.touches[0].clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    currentX.current = e.clientX || e.touches[0].clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = startX.current - currentX.current;
    if (diff > 50) {
      goToNext(); // swipe left → next slide
    } else if (diff < -50) {
      goToPrev(); // swipe right → prev slide
    }
  };

  if (loading) {
    return (
      <div className="h-[100vh] bg-gradient-to-b from-orange-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[100vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center bg-amber-50">
        <div className="text-center p-8 bg-amber-100 rounded-xl max-w-md border border-amber-300">
          <div className="text-5xl mb-4">🌶️</div>
          <h2 className="text-2xl font-bold text-amber-800 mb-2">
            Carousel Unavailable
          </h2>
          <p className="text-amber-700 mb-4">{error}</p>
          <p className="text-amber-600">
            Please contact admin for adding carousel items to this website
          </p>
        </div>
      </div>
    );
  }

  if (carouselItems.length === 0) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center bg-amber-50">
        <div className="text-center p-8 bg-amber-100 rounded-xl max-w-md border border-amber-300">
          <div className="text-5xl mb-4">🧂</div>
          <h2 className="text-2xl font-bold text-amber-800 mb-2">
            No Carousel Available
          </h2>
          <p className="text-amber-600">
            Please contact admin for adding carousel items to this website
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full pt-[10vh] xs:pt-0 h-[60vh] md:h-[100vh] overflow-hidden bg-amber-900 select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {carouselItems.map((slide, index) => (
          <CarouselSlide
            key={slide.id}
            slide={slide}
            isActive={index === currentIndex}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {carouselItems.length > 1 && (
        <>
          {/* Left Hover Zone */}
          <div className="absolute inset-y-0 left-0 w-1/2 group z-10">
            <button
              onClick={goToPrev}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute left-4 top-1/2 -translate-y-1/2 
                   opacity-0 group-hover:opacity-100 
                   transition-all duration-300 
                   bg-amber-900/40 hover:bg-amber-900/70 
                   backdrop-blur-md rounded-full p-2 md:p-3 
                   border border-amber-600 shadow-lg 
                   hover:scale-110 focus:outline-none"
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-8 md:w-8 text-amber-50 drop-shadow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          {/* Right Hover Zone */}
          <div className="absolute inset-y-0 right-0 w-1/2 group z-10">
            <button
              onClick={goToNext}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute right-4 top-1/2 -translate-y-1/2 
                   opacity-0 group-hover:opacity-100 
                   transition-all duration-300 
                   bg-amber-900/40 hover:bg-amber-900/70 
                   backdrop-blur-md rounded-full p-2 md:p-3 
                   border border-amber-600 shadow-lg 
                   hover:scale-110 focus:outline-none"
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-8 md:w-8 text-amber-50 drop-shadow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Dots Indicators */}
      {carouselItems.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-amber-500 scale-125"
                  : "bg-amber-300 opacity-70 hover:opacity-100"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Theme Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 bg-amber-800/10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 -mb-24 -ml-24 bg-amber-700/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default Carousel;
