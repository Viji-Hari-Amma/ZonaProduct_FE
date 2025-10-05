import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaTruck, FaShieldAlt, FaAward } from 'react-icons/fa';

const CompanyDetails = () => {
  return (
    <section className="py-16 bg-[#FFEDE9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#7C2D12] mb-4">
            About Our Company
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#F97316] to-[#DC2626] mx-auto mb-6"></div>
          <p className="text-[#9A3412] max-w-2xl mx-auto">
            Serving food lovers since 2010 with passion and dedication
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FED7AA]">
              <h3 className="text-2xl font-bold text-[#7C2D12] mb-6">Our Story</h3>
              <p className="text-[#1E293B] mb-4 leading-relaxed">
                Founded in 2010, FoodExpress started as a small local grocery store with a big dream: 
                to revolutionize how people experience food shopping. Today, we serve millions of 
                customers worldwide with the same passion and commitment to quality.
              </p>
              <p className="text-[#1E293B] leading-relaxed">
                Our journey has been fueled by innovation, customer trust, and an unwavering 
                dedication to bringing the finest culinary products directly to your doorstep.
              </p>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "1M+", label: "Happy Customers" },
                { number: "50+", label: "Countries Served" },
                { number: "10K+", label: "Products" },
                { number: "12+", label: "Years Experience" }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md border border-[#FED7AA]">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#F97316] to-[#DC2626] bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-[#9A3412] text-sm mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Details */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FED7AA]">
              <h3 className="text-2xl font-bold text-[#7C2D12] mb-6">Get In Touch</h3>
              <div className="space-y-4">
                {[
                  { icon: FaMapMarkerAlt, text: "123 Food Street, Culinary District, Tasty City 12345", color: "#F97316" },
                  { icon: FaPhone, text: "+1 (555) 123-FOOD", color: "#DC2626" },
                  { icon: FaEnvelope, text: "hello@foodexpress.com", color: "#F97316" },
                  { icon: FaClock, text: "Mon-Sun: 24/7 Customer Support", color: "#DC2626" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="p-2 rounded-lg mr-4" style={{ backgroundColor: `${item.color}20` }}>
                      <item.icon className="text-xl" style={{ color: item.color }} />
                    </div>
                    <p className="text-[#1E293B] flex-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FaTruck, text: "Free Shipping", color: "#F97316" },
                { icon: FaShieldAlt, text: "Quality Guarantee", color: "#DC2626" },
                { icon: FaAward, text: "Award Winning", color: "#F97316" },
                { icon: FaClock, text: "Quick Delivery", color: "#DC2626" }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-md border border-[#FED7AA]">
                  <feature.icon 
                    className="text-2xl mx-auto mb-2" 
                    style={{ color: feature.color }} 
                  />
                  <div className="text-[#7C2D12] text-sm font-medium">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyDetails;