// SearchBar.js
import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes, FaShoppingBag, FaClock, FaCheckCircle, FaBan, FaCreditCard, FaSort, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const SearchBar = ({ orders, onOrderSelect, placeholder = "Search all orders...", onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "date-desc", // date-desc, date-asc, price-desc, price-asc, name-asc, name-desc
    status: "all", // all, pending, confirmed, shipped, delivered, cancelled
    paymentStatus: "all" // all, pending, completed
  });
  
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOrders([]);
      setIsDropdownOpen(false);
      return;
    }

    const filtered = orders.filter(order => {
      const query = searchQuery.toLowerCase();
      
      // Search in order ID
      if (order.id.toLowerCase().includes(query)) return true;
      
      // Search in product names
      if (order.items && order.items.some(item => 
        item.product?.name?.toLowerCase().includes(query)
      )) return true;

      // Search in product flavors
      if (order.items && order.items.some(item => 
        item.product?.flavour?.toLowerCase().includes(query)
      )) return true;

      // Search in order status
      if (order.status?.toLowerCase().includes(query)) return true;

      return false;
    });

    // Apply sorting to search results
    const sortedResults = applySorting(filtered, filters.sortBy);
    setFilteredOrders(sortedResults);
    setIsDropdownOpen(sortedResults.length > 0);
  }, [searchQuery, orders, filters]);

  const applySorting = (ordersToSort, sortBy) => {
    const sorted = [...ordersToSort];
    
    switch (sortBy) {
      case "date-desc":
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case "date-asc":
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case "price-desc":
        return sorted.sort((a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount));
      case "price-asc":
        return sorted.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
      case "name-asc":
        return sorted.sort((a, b) => {
          const aName = a.items?.[0]?.product?.name || '';
          const bName = b.items?.[0]?.product?.name || '';
          return aName.localeCompare(bName);
        });
      case "name-desc":
        return sorted.sort((a, b) => {
          const aName = a.items?.[0]?.product?.name || '';
          const bName = b.items?.[0]?.product?.name || '';
          return bName.localeCompare(aName);
        });
      default:
        return sorted;
    }
  };

  const handleOrderSelect = (order) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    onOrderSelect(order);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredOrders([]);
    setIsDropdownOpen(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const getPrimaryProductImage = (order) => {
    const firstItem = order.items?.[0];
    return firstItem?.product?.images?.find(img => img.is_primary)?.image_url ||
           firstItem?.product?.images?.[0]?.image_url;
  };

  const getProductNames = (order) => {
    if (!order.items || order.items.length === 0) return "No items";
    const names = order.items.map(item => item.product?.name).filter(Boolean);
    return names.length > 2 ? `${names.slice(0, 2).join(", ")} +${names.length - 2} more` : names.join(", ");
  };

  const getTabIcon = (order) => {
    if (order.status === "Cancelled") return <FaBan className="text-red-500" />;
    if (order.status === "Delivered") return <FaCheckCircle className="text-green-500" />;
    if (order.payment_status === "pending" && order.status !== "Cancelled") return <FaCreditCard className="text-orange-500" />;
    return <FaClock className="text-blue-500" />;
  };

  const getTabName = (order) => {
    if (order.status === "Cancelled") return "Cancelled";
    if (order.status === "Delivered") return "History";
    if (order.payment_status === "pending" && order.status !== "Cancelled") return "Pending Payment";
    return "Current";
  };

  const formatOrderDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSortIcon = () => {
    switch (filters.sortBy) {
      case "date-desc":
      case "price-desc":
      case "name-desc":
        return <FaSortAmountDown className="text-orange-500" />;
      case "date-asc":
      case "price-asc":
      case "name-asc":
        return <FaSortAmountUp className="text-orange-500" />;
      default:
        return <FaSort className="text-gray-400" />;
    }
  };

  return (
    <div className="relative mb-6 max-w-375:mb-3" ref={searchRef}>
      <div className="flex gap-4 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setIsDropdownOpen(filteredOrders.length > 0)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 max-w-375:py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm text-lg"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FaTimes className="text-gray-400 hover:text-gray-600 text-lg" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        {/* <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${
            showFilters 
              ? "bg-orange-500 text-white border-orange-500" 
              : "bg-white text-gray-700 border-orange-300 hover:bg-orange-50"
          }`}
        >
          <FaFilter />
          <span className="hidden sm:inline">Filters</span>
          {getSortIcon()}
        </button> */}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-orange-200 rounded-lg p-4 mb-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({...filters, sortBy: e.target.value})}
                className="w-full p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="date-desc">Date: Newest First</option>
                <option value="date-asc">Date: Oldest First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="name-asc">Product Name: A-Z</option>
                <option value="name-desc">Product Name: Z-A</option>
              </select>
            </div>

            {/* Order Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({...filters, status: e.target.value})}
                className="w-full p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange({...filters, paymentStatus: e.target.value})}
                className="w-full p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Results */}
      {isDropdownOpen && filteredOrders.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-orange-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-orange-100 bg-orange-50">
            <p className="text-sm font-semibold text-orange-700">
              Found {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleOrderSelect(order)}
              className="p-4 hover:bg-orange-50 cursor-pointer border-b border-orange-100 last:border-b-0 transition-colors duration-200"
            >
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={getPrimaryProductImage(order)}
                    alt="Product"
                    className="w-14 h-14 rounded-lg object-cover border-2 border-orange-200 shadow-sm"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/56x56?text=No+Img";
                    }}
                  />
                </div>
                
                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FaShoppingBag className="text-orange-500 text-sm" />
                      <p className="text-base font-bold text-gray-900">
                        Order # {order.id.substring(0, 10)}...
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTabIcon(order)}
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {getTabName(order)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {getProductNames(order)}
                  </p>
                  
                  {order.items?.[0]?.product?.flavour && (
                    <p className="text-xs text-orange-600 font-medium mb-2">
                      Flavour: {order.items[0].product.flavour}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        order.status === "Cancelled" ? "bg-red-100 text-red-800" :
                        order.status === "Delivered" ? "bg-green-100 text-green-800" :
                        order.status === "Shipped" ? "bg-purple-100 text-purple-800" :
                        order.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                      
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        order.payment_status === "completed" ? "bg-green-100 text-green-800" :
                        order.payment_status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        Payment: {order.payment_status || "unknown"}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-600">
                        ₹{order.total_amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatOrderDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {order.refund_status && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs font-semibold text-blue-700">
                        Refund: {order.refund_status.status} - {order.refund_status.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDropdownOpen && filteredOrders.length === 0 && searchQuery.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-orange-200 rounded-lg shadow-lg p-6 text-center">
          <FaSearch className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No orders found</p>
          <p className="text-sm text-gray-400 mt-1">Try searching by order ID, product name, or flavor</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;