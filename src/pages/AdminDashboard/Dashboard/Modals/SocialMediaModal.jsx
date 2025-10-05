import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaTimes,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { aboutService } from "../../../../services/AboutPageApi/about";

const SocialMediaModal = ({ isOpen, onClose, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialFields, setSocialFields] = useState([]);

  // Define icon mapping
  const iconMap = {
    facebook_url: { icon: FaFacebook, color: "text-blue-600", name: "Facebook" },
    linkedin_url: { icon: FaLinkedin, color: "text-blue-800", name: "LinkedIn" },
    instagram_url: { icon: FaInstagram, color: "text-pink-600", name: "Instagram" },
    twitter_url: { icon: FaTwitter, color: "text-blue-400", name: "Twitter" },
    youtube_url: { icon: FaYoutube, color: "text-red-600", name: "YouTube" },
  };

  // Generate social fields dynamically from API response
  const generateSocialFields = (data) => {
    if (!data) return [];
    
    return Object.keys(data)
      .filter(key => key.includes('_url') && key !== 'id' && key !== 'created_at' && key !== 'updated_at')
      .map(key => ({
        key,
        label: `${iconMap[key]?.name || key.replace('_url', '')} URL`,
        icon: iconMap[key]?.icon || FaTimes,
        placeholder: `https://${key.replace('_url', '')}.com/yourprofile`,
        color: iconMap[key]?.color || "text-gray-600"
      }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      const fields = generateSocialFields(initialData);
      setSocialFields(fields);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate URLs
      const socialFields = Object.keys(formData).filter(key => key.includes('_url'));
      for (const field of socialFields) {
        const url = formData[field];
        if (url && url.trim() !== "") {
          try {
            new URL(url);
          } catch (error) {
            const fieldName = iconMap[field]?.name || field.replace('_url', '');
            toast.error(`Invalid URL for ${fieldName}`);
            setIsLoading(false);
            return;
          }
        }
      }

      // Prepare data for API - only include URL fields
      const apiData = {};
      socialFields.forEach(field => {
        apiData[field] = formData[field] || "";
      });

      const response = await aboutService.updateSocialLinks(apiData);
      
      if (response.data && response.data.data) {
        onUpdate(response.data.data);
        toast.success("Social media links updated successfully!");
        onClose();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update social media links");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        {/* Background Overlay */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        {/* Centered Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-heading">
                  Edit Social Media Links
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {socialFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-secondary-text mb-1 flex items-center">
                        <Icon className={`mr-2 ${field.color}`} />
                        {field.label}
                      </label>
                      <input
                        type="url"
                        name={field.key}
                        value={formData[field.key] || ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focused-input"
                      />
                    </div>
                  );
                })}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-secondary-text border border-input-border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary-gradient text-white rounded-lg shadow-button hover:shadow-button-hover disabled:opacity-50 transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? "Updating..." : "Update Links"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SocialMediaModal;
