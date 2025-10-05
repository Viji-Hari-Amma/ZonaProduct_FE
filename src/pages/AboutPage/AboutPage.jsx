import React, { useState, useEffect } from "react";
import {
  FaAward,
  FaStar,
  FaLeaf,
  FaSeedling,
  FaUsers,
  FaGlobeAmericas,
  FaBuilding,
  FaCertificate,
  FaEye,
  FaEyeSlash,
  FaBullseye,
  FaRocket,
  FaCalendarAlt,
} from "react-icons/fa";
import { aboutService } from "../../services/AboutPageApi/about";

const AboutSection = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const [ownerResponse, statsResponse] = await Promise.all([
        aboutService.getOwnerDetail(),
        aboutService.getCompanyStatus(),
      ]);

      setOwnerData(ownerResponse.data.data);
      setStatsData(statsResponse.data.data);
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <section
      id="about"
      className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full mb-4">
            <FaLeaf className="text-orange-600 mr-2" />
            <span className="text-sm font-semibold text-orange-700">
              Since{" "}
              {ownerData?.founding_date
                ? new Date(ownerData.founding_date).getFullYear()
                : "2015"}
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-orange-600">Zona Products</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Leading manufacturers of premium Indian masalas, peanut butter,
            cashew butter, and other quality food products
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Owner Info & Image */}
          <div className="space-y-6">
            {/* Owner Information Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
              <div className="flex items-start space-x-4">
                {ownerData?.show_owner_image && ownerData?.owner_image_url && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={ownerData.owner_image_url}
                        alt={ownerData.owner_name}
                        className="w-24 h-24 object-cover rounded-xl border-2 border-orange-200"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <FaEye className="text-white text-xs" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {!ownerData?.show_owner_image && (
                      <FaEyeSlash className="text-gray-400 text-sm" />
                    )}
                    <h3 className="text-xl font-bold text-gray-900">
                      {ownerData?.owner_name || "Hari Haran"}
                    </h3>
                  </div>
                  <p className="text-orange-600 font-medium mb-3">
                    Founder & CEO
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {ownerData?.owner_message ||
                      "Dedicated to bringing you the finest quality food products with authentic taste and unmatched purity."}
                  </p>
                </div>
              </div>

              {ownerData?.certificate_image_url && (
                <div className="mt-4 pt-4 border-t border-orange-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FaCertificate className="text-orange-500 mr-2" />
                    Quality Certification
                  </h4>
                  <div className="flex justify-center">
                    <img
                      src={ownerData.certificate_image_url}
                      alt="Quality Certificate"
                      className="max-w-full h-auto max-h-32 rounded-lg border shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Products Highlight */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Our Products
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "Indian Masalas",
                    icon: "🌶️",
                    color: "bg-red-100 text-red-600",
                  },
                  {
                    name: "Peanut Butter",
                    icon: "🥜",
                    color: "bg-amber-100 text-amber-600",
                  },
                  {
                    name: "Cashew Butter",
                    icon: "🌰",
                    color: "bg-yellow-100 text-yellow-600",
                  },
                  {
                    name: "Spice Blends",
                    icon: "🧂",
                    color: "bg-orange-100 text-orange-600",
                  },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="text-center p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${product.color} flex items-center justify-center mx-auto mb-2 text-xl`}
                    >
                      {product.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {product.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Company Info */}
          <div className="space-y-6">
            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <FaBullseye className="text-white text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-justify">
                  To become the most trusted brand in food manufacturing,
                  delivering authentic Indian flavors and healthy food products
                  to households worldwide while maintaining the highest quality
                  standards.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <FaRocket className="text-white text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-justify">
                  To create nutritious, delicious, and authentic food products
                  using traditional recipes combined with modern technology,
                  ensuring every product meets international quality standards
                  and customer expectations.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Our Achievements
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: FaUsers,
                    value: statsData?.team_size || 25,
                    label: "Team Members",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: FaGlobeAmericas,
                    value: `${statsData?.clients_count || 1000}+`,
                    label: "Happy Clients",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: FaBuilding,
                    value: statsData?.offices_count || 2,
                    label: "Our Offices",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: FaAward,
                    value: "12+",
                    label: "Years Excellence",
                    color: "from-orange-500 to-red-500",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
                    >
                      <stat.icon className="text-white text-lg" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-xs font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Section - Only show if milestones exist */}
        {statsData?.milestones && statsData.milestones.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 mb-12">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-12 text-center">
                Our <span className="text-orange-600">Journey</span>
              </h3>

              {/* Alternating Timeline */}
              <div className="relative">
                {/* Central Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-200 via-amber-200 to-yellow-200"></div>

                {/* Milestones Container */}
                <div className="space-y-12">
                  {statsData.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`relative flex ${
                        index % 2 === 0 ? "justify-start" : "justify-end"
                      }`}
                    >
                      {/* Milestone Card */}
                      <div
                        className={`w-full md:w-5/12 relative ${
                          index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                        }`}
                      >
                        {/* Content Card */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                          {/* Year Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold text-orange-700 bg-orange-100 px-4 py-2 rounded-full shadow-sm">
                              {milestone.year}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                Milestone {index + 1}
                              </span>
                            </div>
                          </div>

                          {/* Event Description */}
                          <p className="text-gray-800 font-semibold text-lg leading-relaxed">
                            {milestone.event}
                          </p>

                          {/* Decorative Elements */}
                          <div className="absolute top-4 -left-2 w-4 h-4 bg-orange-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                          <div className="absolute bottom-4 -right-2 w-6 h-6 bg-amber-300 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        </div>

                        {/* Connecting Line to Center */}
                        <div
                          className={`hidden md:block absolute top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-orange-300 ${
                            index % 2 === 0 ? "right-0" : "left-0"
                          }`}
                        ></div>
                      </div>

                      {/* Central Timeline Dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <FaCalendarAlt className="text-white text-xs" />
                        </div>

                        {/* Progress Indicator */}
                        {index < statsData.milestones.length - 1 && (
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-amber-200 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timeline Header Decoration */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  {/* <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-white" />
                    <span className="text-sm font-semibold">Our Journey</span>
                  </div> */}
                </div>

                {/* Timeline Footer Summary */}
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full px-6 py-3 border border-green-200 shadow-sm">
                    <FaAward className="text-green-500 text-xl" />
                    <span className="text-gray-700 font-semibold">
                      {statsData.milestones.length} Milestones • Since{" "}
                      {statsData.milestones[0]?.year}
                    </span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Company Story */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 text-center">
              Our <span className="text-orange-600">Story</span>
            </h3>

            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-lg mb-6 leading-relaxed text-justify max-w-375:text-[16px]">
                Zona Products is a leading manufacturer and exporter of premium
                food products including authentic Indian masalas, peanut butter,
                cashew butter, and various spice blends. We take pride in
                bringing the rich flavors and health benefits of traditional
                Indian cuisine to the global market.
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <FaStar className="text-orange-500 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Quality Assurance
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        With advanced infrastructure and unique processing
                        technology, we ensure 100% quality and authentic taste
                        in all our products.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <FaLeaf className="text-orange-500 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Natural Ingredients
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        We use only the finest natural ingredients, carefully
                        sourced and processed to preserve their nutritional
                        value and flavor.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <FaGlobeAmericas className="text-orange-500 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Global Reach
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Our products meet international standards, ensuring
                        quality that customers trust and enjoy worldwide.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <FaSeedling className="text-orange-500 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Health Focus
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        All our products are crafted with health in mind - rich
                        in protein, vitamins, and natural goodness for your
                        well-being.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg max-w-375:text-[16px] leading-relaxed border-t border-orange-100 pt-6 text-center">
                With years of experience in procuring raw materials and food
                processing, we adhere to the highest hygienic conditions and
                international standards, consistently meeting our customers'
                requirements across the globe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
