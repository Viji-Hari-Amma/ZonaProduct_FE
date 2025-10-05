import { useState, useEffect } from "react";
import { FaBuilding, FaEdit, FaTrophy, FaUsers } from "react-icons/fa";
import CompanyStatsModal from "../Modals/CompanyStatsModal";
import { aboutService } from "../../../../services/AboutPageApi/about";

const CompanyStatsCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statsData, setStatsData] = useState({
    team_size: 0,
    clients_count: 0,
    offices_count: 0,
    milestones: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch company statistics data
  const fetchCompanyStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aboutService.getCompanyStatus();
      setStatsData(response.data.data || {
        team_size: 0,
        clients_count: 0,
        offices_count: 0,
        milestones: [],
      });
    } catch (err) {
      setError("Failed to load company statistics");
      console.error("Error fetching company stats:", err);
      // Set default empty state on error
      setStatsData({
        team_size: 0,
        clients_count: 0,
        offices_count: 0,
        milestones: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyStats();
  }, []);

  const handleUpdate = (data) => {
    setStatsData(data);
    // Optionally refetch data to ensure consistency
    fetchCompanyStats();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-card border border-card-border p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">{error}</div>
          <button
            onClick={fetchCompanyStats}
            className="bg-primary-gradient text-white px-4 py-2 rounded-lg hover:shadow-button-hover transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-card border border-card-border p-6 transition-all duration-300 hover:shadow-card-hover">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-divider">
          <h3 className="text-lg font-semibold text-heading">
            Company Statistics
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-gradient text-white px-4 py-2 rounded-lg shadow-button hover:shadow-button-hover transition-all duration-300 hover:scale-105 flex items-center"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <FaUsers className="text-primary-orange text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-heading">
              {statsData.team_size}+
            </div>
            <div className="text-sm text-secondary-text">Team Size</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <FaUsers className="text-primary-red text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-heading">
              {statsData.clients_count}+
            </div>
            <div className="text-sm text-secondary-text">Clients</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <FaBuilding className="text-blue-500 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-heading">
              {statsData.offices_count}
            </div>
            <div className="text-sm text-secondary-text">Offices</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-heading mb-3 flex items-center">
            <FaTrophy className="text-yellow-500 mr-2" />
            Milestones
          </h4>
          <div className="space-y-2">
            {statsData.milestones && statsData.milestones.length > 0 ? (
              statsData.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span className="font-medium text-primary-orange">
                    {milestone.year}
                  </span>
                  <span className="text-sm text-secondary-text text-right">
                    {milestone.event}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-text py-4">
                No milestones available
              </p>
            )}
          </div>
        </div>
      </div>

      <CompanyStatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdate}
        initialData={statsData}
      />
    </>
  );
};

export default CompanyStatsCard;
