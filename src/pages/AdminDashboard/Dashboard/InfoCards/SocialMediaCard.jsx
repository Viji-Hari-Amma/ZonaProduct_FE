import React, { useState, useEffect } from 'react';
import { FaEdit, FaFacebook, FaLinkedin, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import SocialMediaModal from '../Modals/SocialMediaModal';
import { aboutService } from '../../../../services/AboutPageApi/about';

const SocialMediaCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [socialData, setSocialData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping
  const iconMap = {
    facebook_url: { icon: FaFacebook, color: 'text-blue-600', name: 'Facebook' },
    linkedin_url: { icon: FaLinkedin, color: 'text-blue-800', name: 'LinkedIn' },
    instagram_url: { icon: FaInstagram, color: 'text-pink-600', name: 'Instagram' },
    twitter_url: { icon: FaTwitter, color: 'text-blue-400', name: 'Twitter' },
    youtube_url: { icon: FaYoutube, color: 'text-red-600', name: 'YouTube' }
  };

  // Fetch social media data
  const fetchSocialMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aboutService.getSocialLinks();
      
      if (response.data && response.data.data) {
        setSocialData(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to load social media links");
      console.error("Error fetching social media:", err);
      setSocialData({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const handleUpdate = (updatedData) => {
    setSocialData(updatedData);
  };

  const getDisplayUrl = (url) => {
    if (!url || url.trim() === "") return 'Not configured';
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  // Get social media fields from data
  const getSocialFields = () => {
    if (!socialData) return [];
    
    return Object.keys(socialData)
      .filter(key => key.includes('_url') && key !== 'id' && key !== 'created_at' && key !== 'updated_at')
      .map(key => ({
        key,
        ...iconMap[key]
      }));
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
            onClick={fetchSocialMedia}
            className="bg-primary-gradient text-white px-4 py-2 rounded-lg hover:shadow-button-hover transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const socialFields = getSocialFields();

  return (
    <>
      <div className="bg-white rounded-xl shadow-card border border-card-border p-6 transition-all duration-300 hover:shadow-card-hover">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-divider">
          <h3 className="text-lg font-semibold text-heading">Social Media Links</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-gradient text-white px-4 py-2 rounded-lg shadow-button hover:shadow-button-hover transition-all duration-300 hover:scale-105 flex items-center"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
        </div>
        
        <div className="space-y-4">
          {socialFields.length > 0 ? (
            socialFields.map((platform) => {
              const Icon = platform.icon;
              const url = socialData[platform.key];
              const hasUrl = url && url.trim() !== "";
              
              return (
                <div key={platform.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Icon className={`text-xl mr-3 ${platform.color}`} />
                    <span className="font-medium text-secondary-text">
                      {platform.name}
                    </span>
                  </div>
                  {hasUrl ? (
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm truncate max-w-[150px] text-primary-orange hover:underline"
                      title={url}
                    >
                      {getDisplayUrl(url)}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-text">Not configured</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-muted-text">
              No social media links found
            </div>
          )}
        </div>
      </div>

      <SocialMediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdate}
        initialData={socialData}
      />
    </>
  );
};

export default SocialMediaCard;
