import ChartsSection from "./ChartsSection/ChartsSection";
import InfoCards from "./InfoCards/InfoCards";
import StatsGrid from "./StatsGrid/StatsGrid";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-heading mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <StatsGrid />

      {/* Charts */}
      <ChartsSection />

      {/* Info Cards */}
      <InfoCards />
    </div>
  );
};

export default Dashboard;
