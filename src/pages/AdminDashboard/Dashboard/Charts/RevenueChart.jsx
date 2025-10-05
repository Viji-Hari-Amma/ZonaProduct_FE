import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { OrderSummary } from "../../../../services/orderApi/orderApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7"); // Default to 7 months

  const fetchData = async (selectedPeriod) => {
    try {
      setLoading(true);
      const response = await OrderSummary(selectedPeriod);
      setSummaryData(response.data.summary);
      setChartData(response.data.chart_data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card border border-card-border p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card border border-card-border p-6 transition-all duration-300 hover:shadow-card-hover">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-heading">Revenue & Orders</h3>
        <select
          className="border border-input-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-focused-input"
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <option value="3">Last 3 Months</option>
          <option value="6">Last 6 Months</option>
          <option value="7">Last 7 Months</option>
          <option value="12">Last 12 Months</option>
        </select>
      </div>

      {/* Summary Stats */}
      {summaryData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-lg font-semibold">
              ₹{summaryData.total_revenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-lg font-semibold">
              {summaryData.total_orders.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-lg font-semibold">
              ₹{summaryData.monthly_revenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Today</p>
            <p className="text-lg font-semibold">
              ₹{summaryData.today_revenue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="h-64">
        {chartData ? (
          <Line options={options} data={chartData} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
