import { useState, useEffect } from "react";
import {
  FaEdit,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaSpinner,
} from "react-icons/fa";
import ContactInfoModal from "../Modals/ContactInfoModal";
import { aboutService } from "../../../../services/AboutPageApi/about";

const ContactInfoCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactData, setContactData] = useState({
    email: "",
    phone_number: "",
    address: "",
    website_url: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contact information data
  const fetchContactInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aboutService.getContactDetails();
      setContactData(response.data.data || {
        email: "",
        phone_number: "",
        address: "",
        website_url: "",
      });
    } catch (err) {
      setError("Failed to load contact information");
      console.error("Error fetching contact info:", err);
      // Set default empty state on error
      setContactData({
        email: "",
        phone_number: "",
        address: "",
        website_url: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const handleUpdate = (data) => {
    setContactData(data);
    // Optionally refetch data to ensure consistency
    fetchContactInfo();
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
            onClick={fetchContactInfo}
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
            Contact Information
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-gradient text-white px-4 py-2 rounded-lg shadow-button hover:shadow-button-hover transition-all duration-300 hover:scale-105 flex items-center"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-orange bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
              <FaEnvelope className="text-primary-orange" />
            </div>
            <div>
              <p className="text-secondary-text text-sm">Email</p>
              <p className="font-medium">{contactData.email || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-red bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
              <FaPhone className="text-primary-red" />
            </div>
            <div>
              <p className="text-secondary-text text-sm">Phone</p>
              <p className="font-medium">{contactData.phone_number || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
              <FaMapMarkerAlt className="text-green-500" />
            </div>
            <div>
              <p className="text-secondary-text text-sm">Address</p>
              <p className="font-medium">{contactData.address || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
              <FaGlobe className="text-blue-500" />
            </div>
            <div>
              <p className="text-secondary-text text-sm">Website</p>
              {contactData.website_url ? (
                <a
                  href={contactData.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-orange hover:underline"
                >
                  {contactData.website_url}
                </a>
              ) : (
                <p className="font-medium text-muted-text">Not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ContactInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdate}
        initialData={contactData}
      />
    </>
  );
};

export default ContactInfoCard;
