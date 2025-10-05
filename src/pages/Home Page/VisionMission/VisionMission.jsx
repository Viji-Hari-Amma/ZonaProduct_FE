import React from 'react';
import { FaEye, FaBullseye, FaRocket, FaHeart } from 'react-icons/fa';

const VisionMission = () => {
  return (
    <section className="py-16 bg-[#FFF7ED]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#7C2D12] mb-4">
            Our Vision & Mission
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#F97316] to-[#DC2626] mx-auto mb-6"></div>
          <p className="text-[#9A3412] max-w-2xl mx-auto">
            Driving culinary excellence with passion and purpose
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FED7AA] hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-[#F97316] to-[#DC2626] rounded-full mr-4">
                <FaEye className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#7C2D12]">Our Vision</h3>
            </div>
            <p className="text-[#1E293B] mb-6 leading-relaxed">
              To become the world's most trusted and innovative food e-commerce platform, 
              connecting food lovers with exceptional culinary experiences while promoting 
              sustainable and healthy eating habits worldwide.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaRocket className="text-[#F97316] mr-3" />
                <span className="text-[#9A3412]">Global culinary innovation leader</span>
              </div>
              <div className="flex items-center">
                <FaHeart className="text-[#DC2626] mr-3" />
                <span className="text-[#9A3412]">Sustainable food ecosystem</span>
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FED7AA] hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-[#DC2626] to-[#F97316] rounded-full mr-4">
                <FaBullseye className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#7C2D12]">Our Mission</h3>
            </div>
            <p className="text-[#1E293B] mb-6 leading-relaxed">
              To deliver exceptional food products with uncompromising quality, 
              while fostering community, supporting local producers, and making 
              gourmet experiences accessible to everyone.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#F97316] rounded-full mr-3"></div>
                <span className="text-[#9A3412]">Quality assurance guarantee</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#DC2626] rounded-full mr-3"></div>
                <span className="text-[#9A3412]">Support local communities</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#F97316] rounded-full mr-3"></div>
                <span className="text-[#9A3412]">24/7 customer satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Quality First", desc: "Never compromise on quality", color: "from-[#F97316] to-[#F97316]" },
            { title: "Customer Love", desc: "Exceptional experiences always", color: "from-[#DC2626] to-[#DC2626]" },
            { title: "Innovation", desc: "Always improving, always growing", color: "from-[#F97316] to-[#DC2626]" }
          ].map((value, index) => (
            <div key={index} className="text-center p-6">
              <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <h4 className="text-lg font-semibold text-[#7C2D12] mb-2">{value.title}</h4>
              <p className="text-[#9A3412] text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionMission;