import RevenueChart from "../Charts/RevenueChart";
import TopProductsChart from "../Charts/TopProductsChart";

const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-2">
        <RevenueChart />
      </div>
      <div className="lg:col-span-1">
        <TopProductsChart />
      </div>
    </div>
  );
};

export default ChartsSection;
