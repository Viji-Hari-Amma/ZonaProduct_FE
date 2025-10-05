export const LoadingButton = ({ 
  children, 
  loading, 
  disabled, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`
        relative flex items-center justify-center   /* This ensures content is centered */
        bg-gradient-to-r from-orange-500 to-red-600 
        text-white px-6 py-3 rounded-lg font-semibold
        shadow-lg shadow-red-600/25
        hover:shadow-xl hover:shadow-red-600/35
        transform hover:scale-105
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:transform-none disabled:shadow-none
        ${className}
      `}
    >
      {loading ? (
        // FIXED: Show only spinner when loading, centered properly
        <svg
          className="animate-spin h-5 w-5 text-white"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4
               zm2 5.291A7.962 7.962 0 014 12H0
               c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        // FIXED: Show children when not loading
        <span className="flex items-center">
          {children}
        </span>
      )}
    </button>
  );
};