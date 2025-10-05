import { useEffect, useState } from "react";
import { FaEdit, FaCertificate, FaEye, FaEyeSlash } from "react-icons/fa";
import { aboutService } from "../../../../services/AboutPageApi/about";
import { toast } from "react-toastify";
import OwnerInfoModal from "../Modals/OwnerInfoModal";

const OwnerInfoCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch owner details
  const fetchOwner = async () => {
    try {
      const res = await aboutService.getOwnerDetail();
      if (res.data?.status === "success") {
        setOwnerData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching owner details:", error);
      toast.error("Failed to load owner details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  // Update handler
  const handleUpdate = (updatedData) => {
    setOwnerData(updatedData);
    fetchOwner(); // Refresh data from server to get updated image URLs
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  if (!ownerData) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 text-center">
        No owner data found
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-card border border-card-border p-6 transition-all duration-300 hover:shadow-card-hover">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-divider">
          <h3 className="text-lg font-semibold text-heading">
            Owner Information
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-gradient text-white px-4 py-2 rounded-lg shadow-button hover:shadow-button-hover transition-all duration-300 hover:scale-105 flex items-center"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-dashed border-divider">
            <span className="text-secondary-text">Name:</span>
            <span className="font-medium">{ownerData.owner_name}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-dashed border-divider">
            <span className="text-secondary-text">Message:</span>
            <span className="font-medium text-right max-w-xs">
              {ownerData.owner_message || "No message provided"}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-dashed border-divider">
            <span className="text-secondary-text">Since:</span>
            <span className="font-medium">
              {ownerData.founding_date
                ? new Date(ownerData.founding_date).getFullYear()
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-dashed border-divider">
            <span className="text-secondary-text flex items-center">
              <FaEye className="mr-2" />
              Show Owner Image:
            </span>
            <span className="font-medium flex items-center">
              {ownerData.show_owner_image ? (
                <>
                  <FaEye className="text-green-500 mr-1" />
                  Yes
                </>
              ) : (
                <>
                  <FaEyeSlash className="text-red-500 mr-1" />
                  No
                </>
              )}
            </span>
          </div>

          <div className="flex">
            {/* Owner Image Display */}
            {ownerData.show_owner_image && ownerData.owner_image_url && (
              <div className="py-3 border-b border-dashed border-divider w-full">
                <h4 className="text-sm font-medium text-secondary-text mb-2">
                  Owner Image
                </h4>
                <div className="flex justify-center items-center h-full w-full">
                  <img
                    src={ownerData.owner_image_url}
                    alt={ownerData.owner_name}
                    className="h-28 w-28 object-cover rounded-full border-2 border-primary shadow-md"
                  />
                </div>
              </div>
            )}

            {/* Certificate Image Display */}
            {ownerData.certificate_image_url && (
              <div className="py-3 w-full">
                <h4 className="text-sm font-medium text-secondary-text mb-2 flex items-center">
                  <FaCertificate className="mr-2" />
                  Certificate
                </h4>
                <div className="flex justify-center items-center h-full w-full">
                  <img
                    src={ownerData.certificate_image_url}
                    alt="Certificate"
                    className="h-40 w-auto object-contain border rounded-lg shadow-md max-w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <OwnerInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdate}
        initialData={ownerData}
      />
    </>
  );
};

export default OwnerInfoCard;
