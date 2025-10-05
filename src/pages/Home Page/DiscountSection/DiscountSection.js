import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { discountService } from "../../../services/productApi/productDiscountApi/productDiscountApi";

export const DiscountSection = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await discountService.listDiscounts();
        // check if response is nested
        const offersData = (res.data || res.offers || []).filter(
          (offer) => offer.is_active
        );
        setOffers(offersData);

        if (offersData.length > 0) {
          setSelectedOffer(offersData[0]);
          setCurrentIndex(0);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching discounts:", error);
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  // Setup auto-cycling of offers
  useEffect(() => {
    if (offers.length <= 1) return; // No need to cycle if only one offer

    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval for auto-cycling
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % offers.length;
          setSelectedOffer(offers[newIndex]);
          setIsTransitioning(false);
          return newIndex;
        });
      }, 300); // Match this with the transition duration
    }, 5000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [offers]);

  useEffect(() => {
    if (!selectedOffer) return;

    const calculateTimeLeft = () => {
      const endDate = new Date(selectedOffer.end_date);
      const now = new Date();
      const difference = endDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ expired: true });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [selectedOffer]);

  const handleOfferClick = (offer, index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOffer(offer);
      setCurrentIndex(index);
      setIsTransitioning(false);

      // Reset the auto-cycle timer when user manually selects an offer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Restart the auto-cycle after 5 seconds of inactivity
      timeoutRef.current = setTimeout(() => {
        if (offers.length > 1) {
          intervalRef.current = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % offers.length;
                setSelectedOffer(offers[newIndex]);
                setIsTransitioning(false);
                return newIndex;
              });
            }, 300);
          }, 5000);
        }
      }, 5000);
    }, 300);
  };

  // Redirect function
  const handleRedirect = () => {
    if (!selectedOffer) return;

    const searchParams = new URLSearchParams();

    if (selectedOffer.discount_type === "product" && selectedOffer.product) {
      navigate(`/products/${selectedOffer.product.id}`);
    } else if (selectedOffer.discount_type === "universal") {
      navigate("/products");
    } else if (
      selectedOffer.discount_type === "category" &&
      selectedOffer.category.id
    ) {
      searchParams.set("category", selectedOffer.category.id);
      searchParams.set("page", "1"); // Always start from page 1
      navigate(`/products?${searchParams.toString()}`);
    }
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="w-full min-h-[80vh] bg-[#FFF7ED] p-4 md:p-10">
      <div className="w-full py-3 px-4 md:px-6">
        <div className="h-5 w-24 bg-gray-300 rounded-md animate-pulse mb-2"></div>
        <div className="h-7 w-80 bg-gray-300 rounded-md animate-pulse"></div>
      </div>

      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="w-full lg:w-[70%] flex flex-col md:flex-row p-3 md:p-6 min-h-[50vh] bg-white rounded-lg border border-[#FED7AA]">
          <div className="w-full md:w-[150px] bg-gray-200 rounded-t-lg md:rounded-l-lg md:rounded-tr-none h-auto md:h-full flex items-center justify-center p-4 md:p-0">
            <div className="h-12 w-12 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          <div className="bg-white p-3 md:p-6 h-full w-full">
            <div className="h-7 w-64 bg-gray-200 rounded-md animate-pulse mb-3"></div>
            <div className="h-4 w-80 bg-gray-200 rounded-md animate-pulse mb-6"></div>

            <div className="flex gap-3 mt-4 items-start">
              <div className="flex-shrink-0">
                <div className="w-[65px] h-[65px] rounded-lg bg-gray-200 animate-pulse"></div>
              </div>
              <div className="w-full">
                <div className="h-5 w-44 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>

            <div className="mt-6">
              <div className="h-4 w-56 bg-gray-200 rounded-md animate-pulse mb-4"></div>

              <div className="flex mt-4 gap-2 md:gap-3 items-center justify-center md:justify-start">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[50px] md:w-[60px] h-[60px] md:h-[70px] bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            <div className="mt-6 h-12 w-40 bg-gray-200 rounded-full animate-pulse"></div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <div className="h-3 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-3 w-8 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full bg-gray-300 animate-pulse"
                  style={{ width: `30%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[30%] p-3 md:p-6 min-h-[50vh] bg-white rounded-lg border border-[#FED7AA]">
          <div className="h-7 w-32 bg-gray-200 rounded-md animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#FED7AA]">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-3 w-48 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!offers || offers.length === 0) {
    return null;
  }

  // Get the first product for display
  const getDisplayProduct = (offer) => {
    if (offer.discount_type === "product") {
      return offer.product;
    } else if (offer.discount_type === "universal") {
      return offer.universal?.sample_products?.[0];
    } else if (offer.discount_type === "category") {
      return offer.category?.sample_products?.[0];
    }
    return null;
  };

  const displayProduct = selectedOffer
    ? getDisplayProduct(selectedOffer)
    : null;

  // Get the first size for the display product
  const firstSize =
    displayProduct && displayProduct.sizes && displayProduct.sizes.length > 0
      ? displayProduct.sizes[0]
      : null;

  // Format dates for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Calculate progress percentage for the time bar
  const calculateProgress = () => {
    if (!selectedOffer) return 0;

    try {
      const startDate = new Date(selectedOffer.start_date);
      const endDate = new Date(selectedOffer.end_date);
      const totalDuration = endDate - startDate;
      const elapsed = new Date() - startDate;
      return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    } catch (error) {
      return 0;
    }
  };

  const progressPercentage = calculateProgress();

  return (
    <div className="w-full min-h-[80vh] bg-[#FFF7ED] p-4 md:p-10">
      <div className="w-full py-3 px-4 md:px-6">
        <h5 className="text-[#DC2626] font-extrabold text-sm md:text-base">
          🔥Hot Deals
        </h5>
        <h1 className="text-lg mt-2 sm:text-2xl md:text-3xl tracking-wide italic font-delius text-[#7C2D12] font-extrabold">
          Limited-time discounts — grab them before they're gone
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div
          className={`w-full lg:w-[70%] flex flex-col md:flex-row min-h-[50vh] bg-white rounded-lg border border-[#FED7AA] shadow-[0_6px_16px_rgba(220,38,38,0.15)] hover:shadow-[0_10px_22px_rgba(249,115,22,0.25)] hover:bg-gradient-to-br hover:from-white hover:to-[#FFF5F0] transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 transform scale-95"
              : "opacity-100 transform scale-100"
          } transition-opacity duration-300 ease-in-out`}
        >
          <div className="w-full md:w-[150px] bg-gradient-to-b from-[#F97316] to-[#DC2626] rounded-t-lg md:rounded-l-lg md:rounded-tr-none text-white h-auto md:h-full tracking-wide text-2xl md:text-3xl flex items-center justify-center leading-relaxed flex-col text-center p-4 md:p-0">
            <span>{selectedOffer?.percentage}%</span>
            <span>OFF</span>
          </div>

          <div className="bg-white p-3 md:p-6 h-full w-full">
            {/* Make this area clickable */}
            <div
              className="cursor-pointer"
              onClick={handleRedirect}
              title="View details"
            >
              <h1 className="text-xl md:text-2xl font-bold text-[#7C2D12] underline hover:text-[#DC2626]">
                {selectedOffer?.name}
              </h1>
              <p className="text-sm text-[#9A3412] mt-1">
                {selectedOffer?.description || "Special discount offer"}
              </p>

              {displayProduct ? (
                <div className="flex gap-3 mt-4 items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        displayProduct.images &&
                        displayProduct.images.length > 0
                          ? displayProduct.images.find((img) => img.is_primary)
                              ?.image_url || displayProduct.images[0]?.image_url
                          : "https://via.placeholder.com/65"
                      }
                      alt={displayProduct.name}
                      className="w-[65px] h-[65px] rounded-lg object-cover border border-[#FDBA74] transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[#7C2D12]">
                      {displayProduct.name}
                    </p>
                    <div className="flex gap-3 mt-1 items-center">
                      {firstSize ? (
                        <>
                          {parseFloat(firstSize.discounted_price) <
                          parseFloat(firstSize.price) ? (
                            <>
                              <span className="text-[#DC2626] font-bold">
                                ₹
                                {parseFloat(firstSize.discounted_price).toFixed(
                                  2
                                )}
                              </span>
                              <span className="italic line-through text-[#9CA3AF]">
                                ₹{parseFloat(firstSize.price).toFixed(2)}
                              </span>
                              <span className="ml-2 bg-[#F97316] text-white text-xs font-bold px-2 py-1 rounded-full">
                                {selectedOffer?.percentage}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-[#DC2626] font-bold">
                              ₹{parseFloat(firstSize.price).toFixed(2)}
                            </span>
                          )}
                        </>
                      ) : displayProduct?.base_price ? (
                        <>
                          {parseFloat(displayProduct.discounted_price) <
                          parseFloat(displayProduct.base_price) ? (
                            <>
                              <span className="text-[#DC2626] font-bold">
                                ₹
                                {parseFloat(
                                  displayProduct.discounted_price
                                ).toFixed(2)}
                              </span>
                              <span className="italic line-through text-[#9CA3AF]">
                                ₹
                                {parseFloat(displayProduct.base_price).toFixed(
                                  2
                                )}
                              </span>
                              <span className="ml-2 bg-[#F97316] text-white text-xs font-bold px-2 py-1 rounded-full">
                                {selectedOffer?.percentage}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-[#DC2626] font-bold">
                              ₹
                              {parseFloat(displayProduct.base_price).toFixed(2)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[#DC2626] font-bold">
                          Price not available
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9A3412] mt-1">
                      {selectedOffer.discount_type === "universal"
                        ? `Applies to ${
                            selectedOffer.universal?.products_count || 0
                          } products`
                        : selectedOffer.discount_type === "category"
                        ? `Applies to all ${
                            selectedOffer.category?.name || ""
                          } products`
                        : "Special product discount"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-[#9A3412]">
                  <p>No product information available</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="text-sm text-[#9A3412]">
                Valid: {formatDate(selectedOffer?.start_date)} -{" "}
                {formatDate(selectedOffer?.end_date)}
              </p>

              <div className="flex mt-4 gap-2 md:gap-3 items-center justify-center md:justify-start">
                {timeLeft.expired ? (
                  <p className="text-[#DC2626] font-semibold">
                    Offer has ended
                  </p>
                ) : Object.keys(timeLeft).length > 0 ? (
                  <>
                    <div className="w-[50px] md:w-[60px] flex-col rounded-lg flex items-center justify-center h-[60px] md:h-[70px] bg-gradient-to-b from-[#F97316] to-[#DC2626] text-white p-2 animate-pulse">
                      <span className="font-bold text-lg">
                        {String(timeLeft.days || 0).padStart(2, "0")}
                      </span>
                      <span className="text-xs">Days</span>
                    </div>
                    <div
                      className="w-[50px] md:w-[60px] flex-col rounded-lg flex items-center justify-center h-[60px] md:h-[70px] bg-gradient-to-b from-[#F97316] to-[#DC2626] text-white p-2 animate-pulse"
                      style={{ animationDelay: "0.1s" }}
                    >
                      <span className="font-bold text-lg">
                        {String(timeLeft.hours || 0).padStart(2, "0")}
                      </span>
                      <span className="text-xs">Hours</span>
                    </div>
                    <div
                      className="w-[50px] md:w-[60px] flex-col rounded-lg flex items-center justify-center h-[60px] md:h-[70px] bg-gradient-to-b from-[#F97316] to-[#DC2626] text-white p-2 animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <span className="font-bold text-lg">
                        {String(timeLeft.minutes || 0).padStart(2, "0")}
                      </span>
                      <span className="text-xs">Min</span>
                    </div>
                    <div
                      className="w-[50px] md:w-[60px] flex-col rounded-lg flex items-center justify-center h-[60px] md:h-[70px] bg-gradient-to-b from-[#F97316] to-[#DC2626] text-white p-2 animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <span className="font-bold text-lg">
                        {String(timeLeft.seconds || 0).padStart(2, "0")}
                      </span>
                      <span className="text-xs">Sec</span>
                    </div>
                  </>
                ) : (
                  <p className="text-[#DC2626] font-semibold">
                    Calculating time...
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleRedirect}
              className="mt-6 p-3 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white rounded-full shadow-[0_4px_12px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.45)] hover:bg-gradient-to-r hover:from-[#DC2626] hover:to-[#F97316] transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
            >
              Shop Now
            </button>

            <div className="mt-4">
              <div className="text-xs text-[#9A3412] flex justify-between mb-1">
                <span>Offer ends in:</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full h-2 bg-[#FECACA] rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-[#F97316] to-[#DC2626] transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[30%] p-3 md:p-6 min-h-[50vh] bg-white rounded-lg border border-[#FED7AA] shadow-[0_6px_16px_rgba(220,38,38,0.15)]">
          <h2 className="text-xl font-bold text-[#7C2D12] mb-4">
            Other Offers
          </h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedOffer?.id === offer.id
                    ? "border-[#F97316] bg-[#FFEDE9]"
                    : "border-[#FED7AA] hover:border-[#F97316]"
                }`}
                onClick={() => handleOfferClick(offer, index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[#7C2D12]">{offer.name}</h3>
                  <span className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {offer.percentage}% OFF
                  </span>
                </div>
                <p className="text-sm text-[#9A3412] mt-1">
                  {offer.description || "Special discount offer"}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-2">
                  Valid until: {formatDate(offer.end_date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
