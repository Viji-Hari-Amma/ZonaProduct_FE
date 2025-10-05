import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getTopProducts } from "../../../../services/productApi/productApi";

ChartJS.register(ArcElement, Tooltip, Legend);

const TopProductsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [period, setPeriod] = useState("this_month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallbackData, setIsFallbackData] = useState(false);

  const chartColors = [
    "#F97316",
    "#DC2626",
    "#F59E0B",
    "#10B981",
    "#8B5CF6",
    "#EF4444",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
  ];

  const fetchTopProducts = async (selectedPeriod, selectedStatus) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getTopProducts(selectedPeriod, selectedStatus);
      const data = response.data;

      setIsFallbackData(data.is_fallback_data || false);

      if (!data.top_products || data.top_products.length === 0) {
        setChartData(null);
        return;
      }

      const chartData = {
        labels: data.top_products.map((product) => product.product_name),
        datasets: [
          {
            data: data.top_products.map((product) => product.percentage),
            backgroundColor: chartColors.slice(0, data.top_products.length),
            borderWidth: 0,
          },
        ],
      };

      setChartData(chartData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching top products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts(period, statusFilter);
  }, [period, statusFilter]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { 
          boxWidth: 12, 
          padding: 15, 
          font: { 
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#4B5563'
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
    cutout: "60%",
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Top Products</h3>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-48"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600 font-medium">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">Top Products</h3>
          {isFallbackData && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Sample Data
            </span>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-2 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-400"
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered Only</option>
              <option value="confirmed">Confirmed+</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-2 pr-6 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-400"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="all_time">All Time</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      {error ? (
        <div className="h-64 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">Error loading data</p>
          <p className="text-gray-600 text-sm text-center mb-4">Please check your connection and try again</p>
          <button
            onClick={() => fetchTopProducts(period, statusFilter)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      ) : chartData && chartData.labels.length > 0 ? (
        <div className="relative">
          <div className="h-64">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          {isFallbackData && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Showing available products (no order data yet)
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">No product data available</p>
          <p className="text-gray-500 text-sm text-center">Create some orders to see analytics</p>
        </div>
      )}
    </div>
  );
};

export default TopProductsChart;