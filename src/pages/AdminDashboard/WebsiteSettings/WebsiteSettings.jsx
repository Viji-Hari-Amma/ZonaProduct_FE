import React, { useState } from "react";
import {
  FiSliders,
  FiImage,
  FiStar,
  FiMenu,
  FiX,
  FiSettings,
} from "react-icons/fi";
import CarouselManagement from "./CarouselSettings/CarouselManagement";
import ReviewSettings from "./ReviewSettings/ReviewSettings";
import LogoManagement from "./LogoSettings/LogoManagement";

const WebSettings = () => {
  const [activeSection, setActiveSection] = useState("carousel");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    {
      id: "carousel",
      name: "Carousel Settings",
      icon: FiImage,
      description: "Manage homepage banners and sliders",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "logo",
      name: "Logo Settings",
      icon: FiSliders,
      description: "Update and manage website logos",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "review-settings",
      name: "Review Settings",
      icon: FiStar,
      description: "Configure review system preferences",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "carousel":
        return <CarouselManagement />;
      case "logo":
        return <LogoManagement />;
      case "review-settings":
        return <ReviewSettings />;
      default:
        return <CarouselManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-gradient-to-r from-[#F97316] to-[#DC2626] p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <FiSettings className="text-white" size={24} />
          <h1 className="text-white text-xl font-bold">Website Settings</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 transform hover:scale-110"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex bg-green-600 h-[90vh]">
        {/* Sidebar */}
        <div
          className={`
            ${mobileMenuOpen ? "block" : "hidden"} 
            lg:block w-full lg:w-80 bg-gradient-to-b from-[#F97316] to-[#DC2626] text-white p-6 lg:p-8
            fixed h-screen z-40 shadow-xl
          `}
        >
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                <FiSettings className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Website Settings</h1>
                <p className="text-[#FFE5E0] text-sm opacity-90">
                  Manage your website appearance
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 text-left group ${
                    isActive
                      ? "bg-white text-[#DC2626] shadow-2xl transform scale-105"
                      : "text-[#FFE5E0] hover:bg-white hover:bg-opacity-15 hover:text-white hover:translate-x-2 hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${section.color} text-white`
                        : "bg-white bg-opacity-10 group-hover:bg-opacity-20"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-white" : ""} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`font-semibold block transition-all duration-300 ${
                        isActive ? "text-[#7C2D12]" : "group-hover:text-white"
                      }`}
                    >
                      {section.name}
                    </span>
                    <span
                      className={`text-xs mt-1 transition-all duration-300 ${
                        isActive
                          ? "text-[#9A3412]"
                          : "text-[#FECACA] group-hover:text-white"
                      }`}
                    >
                      {section.description}
                    </span>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="w-2 h-2 bg-gradient-to-r from-[#F97316] to-[#DC2626] rounded-full mt-2"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t border-white border-opacity-20 pt-4">
              <p className="text-[#FFE5E0] text-xs text-center opacity-75">
                Website Control Panel
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen bg-gradient-to-br from-[#FFF7ED] to-[#FFEDE9] lg:ml-80">
          {renderSection()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default WebSettings;
