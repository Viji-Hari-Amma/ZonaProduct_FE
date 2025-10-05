import React from "react";

const CarouselSlide = ({ slide, isActive }) => {
  // Check if slide has at least one piece of meaningful content
  const hasContent =
    slide?.title ||
    slide?.description ||
    (slide?.button_text && slide?.button_link);

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      <div className="relative w-full h-[60vh] md:h-[100vh]">
        {/* Background Image */}
        <img
          src={slide.image_url}
          alt={slide.title || "Carousel slide"}
          className="w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Content - Render ONLY if content exists */}
        {hasContent && (
          <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 max-w-4xl">
            <div className="bg-gradient-to-r from-orange-700/80 to-red-700/80 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-orange-500/40 shadow-2xl">
              {slide?.title && (
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 font-serif drop-shadow-md">
                  {slide.title}
                </h2>
              )}

              {slide?.description && (
                <p className="text-sm sm:text-base md:text-xl text-orange-50 mb-4 md:mb-6 max-w-2xl">
                  {slide.description}
                </p>
              )}

              {slide?.button_text && slide?.button_link && (
                <a
                  href={slide.button_link}
                  className="inline-block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50"
                >
                  {slide.button_text} →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarouselSlide;
