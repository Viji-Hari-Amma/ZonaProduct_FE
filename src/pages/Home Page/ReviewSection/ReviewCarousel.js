import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import { listReviews } from "../../../services/reviewApi/reviewApi";
import { useNavigate } from "react-router-dom";

const ReviewCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Calculate items per view based on screen size
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      const mobile = window.innerWidth < 768;
      setItemsPerView(mobile ? 1 : 2);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // Fetch reviews from API with error handling
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await listReviews();

        // Filter only approved reviews and sort by rating
        const approvedReviews = response.data
          .filter((review) => review.is_approved)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10); // Limit to top 10 reviews
        setReviews(approvedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Create slides based on itemsPerView (1 for mobile, 2 for desktop)
  const slides = useMemo(() => {
    const result = [];
    for (let i = 0; i < reviews.length; i += itemsPerView) {
      const slide = [];
      // Add reviews based on itemsPerView
      for (let j = 0; j < itemsPerView; j++) {
        if (reviews[i + j]) {
          slide.push(reviews[i + j]);
        }
      }
      // Only add the slide if it has at least one review
      if (slide.length > 0) {
        result.push(slide);
      }
    }
    return result;
  }, [reviews, itemsPerView]);

  // Calculate total pages based on slides
  const totalPages = useMemo(() => {
    return Math.max(1, slides.length);
  }, [slides.length]);

  // Auto-rotate carousel every 5 seconds with pause on hover
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= totalPages) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides.length, totalPages, isHovered]);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev + 1 >= totalPages) return 0;
      return prev + 1;
    });
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev - 1 < 0) return totalPages - 1;
      return prev - 1;
    });
  }, [totalPages]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Handle drag end for carousel
  const handleDragEnd = useCallback(
    (event, info) => {
      setIsDragging(false);

      if (Math.abs(info.offset.x) > 100) {
        if (info.offset.x > 0) {
          goToPrev();
        } else {
          goToNext();
        }
      }
    },
    [goToNext, goToPrev]
  );

  // Handle product redirect
  const handleProductRedirect = (productId) => {
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="review-section py-16 px-4 md:px-8 bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7]">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-[#FED7AA] rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-[#FED7AA] rounded-lg w-full md:w-96 mx-auto mb-12"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 h-80 animate-pulse"
                >
                  <div className="flex items-start mb-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="review-section py-16 px-4 md:px-8 bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No reviews state
  if (reviews.length === 0) {
    return (
      <section className="review-section py-16 px-4 md:px-8 bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 border border-[#FED7AA] shadow-lg">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold text-[#7C2D12] mb-2">
              Be the First to Review!
            </h2>
            <p className="text-[#9A3412]">
              Share your experience and help others discover our amazing
              products.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="review-section py-16 px-4 md:px-8 bg-gradient-to-br from-[#FFF7ED] via-[#FEF3C7] to-[#FED7AA] relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FED7AA] rounded-full opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FEF3C7] rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-[#FED7AA] rounded-full opacity-15"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-375:mb-3"
        >
          <h2 className="text-4xl font-extrabold text-[#7C2D12] mb-6 tracking-wide font-delius">
            Voices of Trust
          </h2>
          <p className="text-xl font-josefin text-[#9A3412] max-w-3xl mx-auto leading-relaxed">
            These reviews aren't just feedback—they're the heartbeat of our
            journey
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Carousel Track */}
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            animate={{
              x: `-${currentIndex * 100}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: isDragging ? 0 : 0.5,
            }}
          >
            {slides.map((slideReviews, slideIndex) => (
              <div key={slideIndex} className="flex-shrink-0 w-full">
                <div
                  className={`flex ${
                    slideReviews.length === 2
                      ? "flex-col md:flex-row gap-6"
                      : "justify-center"
                  } px-3`}
                >
                  {slideReviews.map((review, reviewIndex) => (
                    <motion.div
                      key={`${review.id}-${reviewIndex}`}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className={`bg-white/95 backdrop-blur-sm rounded-3xl p-8 min-h-[400px] border border-[#FED7AA] shadow-xl shadow-[rgba(220,38,38,0.1)] hover:shadow-2xl hover:shadow-[rgba(249,115,22,0.2)] transition-all duration-500 relative overflow-hidden group ${
                        slideReviews.length === 2 ? "flex-1" : "w-full md:w-2/3"
                      }`}
                    >
                      {/* Decorative background pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FEF3C7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Review Header */}
                      <div className="flex items-start mb-6 relative z-10">
                        <div className="relative">
                          <img
                            src={
                              review.profile_picture_url ||
                              "/default-avatar.png"
                            }
                            alt={review.user_name}
                            className="w-16 h-16 rounded-full object-cover border-3 border-[#FED7AA] shadow-lg"
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                          {review.verified_purchase && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-5 flex-1">
                          <h3 className="font-bold text-xl text-[#7C2D12] mb-2">
                            {review.user_name}
                          </h3>
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating
                                    ? "text-[#F97316]"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          {review.verified_purchase && (
                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Review Comment */}
                      <div className="mb-6 relative z-10">
                        <blockquote className="text-[#1E293B] text-justify text-[16px] leading-relaxed italic max-w-375:text-[15px]">
                          "{review.comment}"
                        </blockquote>
                      </div>

                      {/* Product Info */}
                      <div
                        className="mt-auto pt-6 border-t border-[#FECACA] relative z-10 cursor-pointer hover:bg-[#FFF7ED]/60 transition"
                        onClick={() =>
                          handleProductRedirect(review.product?.id)
                        }
                        title="View product"
                      >
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src={
                                review.product?.images?.[0]?.image_url ||
                                "/default-product.png"
                              }
                              alt={review.product?.name || "Product"}
                              className="w-14 h-14 rounded-xl object-cover border-2 border-[#FED7AA] shadow-md"
                              onError={(e) => {
                                e.target.src = "/default-product.png";
                              }}
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-semibold text-[#7C2D12] underline hover:text-[#DC2626]">
                              {review.product?.name || "Product"}
                            </p>
                            <p className="text-xs text-[#9CA3AF]">
                              {review.product?.category?.name || "Category"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Controls */}
        {slides.length > 1 && (
          <div className="flex flex-col items-center mt-12 max-w-375:mt-2 space-y-6">
            {/* Navigation Arrows */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToPrev}
                className="p-3 rounded-full bg-white/90 backdrop-blur-sm border border-[#FDBA74] text-[#DC2626] hover:bg-white hover:shadow-lg transition-all duration-200 shadow-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>

              {/* Page Counter */}
              <div className="text-[#7C2D12] font-semibold text-lg px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#FDBA74]">
                {currentIndex + 1} / {totalPages}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNext}
                className="p-3 rounded-full bg-white/90 backdrop-blur-sm border border-[#FDBA74] text-[#DC2626] hover:bg-white hover:shadow-lg transition-all duration-200 shadow-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>

            {/* Dots Navigation */}
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#DC2626] scale-125"
                      : "bg-[#FECACA] hover:bg-[#FDA4AF]"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewCarousel;
