import React, { memo, useState, useEffect } from "react";

export const WishlistButton = memo(
  ({
    productId,
    isWishlisted,
    onWishlistToggle,
    disabled = false,
    size = "default",
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [localWishlistState, setLocalWishlistState] = useState(isWishlisted);

    // Update local state when prop changes
    useEffect(() => {
      setLocalWishlistState(isWishlisted);
    }, [isWishlisted]);

    const handleClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled || isLoading) return;

      setIsLoading(true);
      try {
        await onWishlistToggle(productId);
        // Update local state immediately for better UX
        setLocalWishlistState(!localWishlistState);
      } catch (error) {
        // Revert local state on error
        setLocalWishlistState(localWishlistState);
      } finally {
        setIsLoading(false);
      }
    };

    // Size variants
    const sizeClasses = {
      small: "w-7 h-7",
      default: "w-9 h-9",
      large: "w-11 h-11",
    };

    const iconSizes = {
      small: "w-3 h-3",
      default: "w-4 h-4",
      large: "w-5 h-5",
    };

    const baseClasses = `absolute top-3 right-3 ${sizeClasses[size]} rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:scale-110`;

    const stateClasses = localWishlistState
      ? "bg-[#DC2626] text-white hover:bg-[#B91C1C] hover:shadow-lg"
      : "bg-white/90 backdrop-blur-sm border border-red-200 hover:border-red-300 hover:bg-white hover:shadow-lg";

    const disabledClasses =
      disabled || isLoading
        ? "opacity-50 cursor-not-allowed hover:scale-100"
        : "";

    return (
      <div
        className={`${baseClasses} ${stateClasses} ${disabledClasses}`}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={
          localWishlistState ? "Remove from wishlist" : "Add to wishlist"
        }
        aria-disabled={disabled || isLoading}
      >
        {isLoading ? (
          // Loading spinner
          <svg
            className={`${iconSizes[size]} animate-spin text-current`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : localWishlistState ? (
          // Filled heart (in wishlist)
          <svg
            className={iconSizes[size]}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          // Outline heart (not in wishlist)
          <svg
            className={`${iconSizes[size]} text-red-400 hover:text-red-500 transition-colors`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
      </div>
    );
  }
);

WishlistButton.displayName = "WishlistButton";
