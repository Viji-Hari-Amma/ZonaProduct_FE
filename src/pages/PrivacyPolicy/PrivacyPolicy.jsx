// pages/PrivacyPolicy.js
import React, { useEffect, useState } from "react";
// import { toast } from 'react-toastify';
import { FiShield, FiUser, FiCreditCard } from "react-icons/fi";
import { toast } from "react-toastify";
import { aboutService } from "../../services/AboutPageApi/about";

export const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("information-collection");
  const [contactInfo, setContactInfo] = useState({});

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await aboutService.getContactDetails();
        const contactInfo = response.data?.data || {};
        setContactInfo(contactInfo);
      } catch (error) {
        toast.error("No Contact Information Available");
      }
    };
    fetchContactInfo();
  }, []);

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <FiUser className="w-5 h-5" />,
      content: `
        <h3 class="text-lg font-semibold mb-3">Personal Information</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Name, email address, phone number for account creation</li>
          <li>Delivery addresses for order fulfillment</li>
          <li>Payment information (securely processed via UPI/payment gateways)</li>
          <li>Communication preferences</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Usage Data</h3>
        <ul class="list-disc list-inside space-y-2">
          <li>Order history and preferences</li>
          <li>Website interaction data (cookies)</li>
          <li>Device and browser information</li>
          <li>IP address for security purposes</li>
        </ul>
      `,
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: <FiShield className="w-5 h-5" />,
      content: `
        <h3 class="text-lg font-semibold mb-3">Primary Uses</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Process and deliver your orders</li>
          <li>Manage your account and preferences</li>
          <li>Provide customer support</li>
          <li>Send order updates and tracking information</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Improvement & Marketing</h3>
        <ul class="list-disc list-inside space-y-2">
          <li>Personalize your shopping experience</li>
          <li>Improve our products and services</li>
          <li>Send promotional offers (with your consent)</li>
          <li>Conduct market research and analysis</li>
        </ul>
      `,
    },
    {
      id: "data-protection",
      title: "Data Protection",
      icon: <FiShield className="w-5 h-5" />,
      content: `
        <h3 class="text-lg font-semibold mb-3">Security Measures</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>SSL encryption for all data transfers</li>
          <li>Secure payment gateway integration</li>
          <li>Regular security audits and monitoring</li>
          <li>Limited employee access to personal data</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Data Retention</h3>
        <p class="mb-3">We retain your personal information only as long as necessary:</p>
        <ul class="list-disc list-inside space-y-2">
          <li>Order data: 5 years for tax and legal purposes</li>
          <li>Account information: Until account deletion request</li>
          <li>Marketing preferences: Until consent withdrawal</li>
        </ul>
      `,
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: <FiCreditCard className="w-5 h-5" />,
      content: `
        <h3 class="text-lg font-semibold mb-3">Types of Cookies Used</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li><strong>Essential Cookies:</strong> Required for website functionality</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
          <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Cookie Management</h3>
        <p>You can control cookie settings through your browser. However, disabling essential cookies may affect website functionality.</p>
      `,
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: <FiUser className="w-5 h-5" />,
      content: `
        <h3 class="text-lg font-semibold mb-3">Data Subject Rights</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li><strong>Access:</strong> Request copies of your personal data</li>
          <li><strong>Rectification:</strong> Correct inaccurate information</li>
          <li><strong>Erasure:</strong> Request deletion of your data</li>
          <li><strong>Restriction:</strong> Limit how we use your data</li>
          <li><strong>Portability:</strong> Receive your data in usable format</li>
          <li><strong>Objection:</strong> Object to certain data processing</li>
        </ul>
        
        <p class="text-sm text-warm-brown">To exercise any of these rights, contact us at privacy@spicedelight.com</p>
      `,
    },
  ];

  //   const handleAccept = () => {
  //     toast.success('Privacy preferences saved successfully!');
  //   };

  return (
    <div className="min-h-screen bg-body-bg py-8 pt-[11vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-gradient rounded-full flex items-center justify-center shadow-lg">
            <FiShield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-deep-brown mb-4">
            Privacy Policy
          </h1>
          <p className="text-warm-brown text-lg max-w-3xl mx-auto">
            Last updated: December 2024. We are committed to protecting your
            privacy and ensuring the security of your personal information.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-red-glow border border-soft-orange sticky top-8">
              <div className="p-6 border-b border-FECACA">
                <h3 className="font-semibold text-deep-brown">
                  Policy Sections
                </h3>
              </div>
              <nav className="p-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-200 flex items-center ${
                      activeSection === section.id
                        ? "bg-primary-gradient text-white shadow-button"
                        : "text-warm-brown hover:bg-section-alt"
                    }`}
                  >
                    {section.icon}
                    <span className="ml-3 font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-red-glow border border-soft-orange overflow-hidden">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`transition-all duration-300 ${
                    activeSection === section.id ? "block" : "hidden"
                  }`}
                >
                  <div className="bg-section-alt px-8 py-6 border-b border-FECACA">
                    <h2 className="text-2xl font-bold text-deep-brown flex items-center">
                      {section.icon}
                      <span className="ml-3">{section.title}</span>
                    </h2>
                  </div>
                  <div
                    className="p-8 text-warm-brown leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>

            {/* Policy Acceptance */}
            {/* <div className="mt-8 bg-white rounded-xl shadow-red-glow border border-soft-orange p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-deep-brown text-lg">
                    Privacy Preferences
                  </h3>
                  <p className="text-warm-brown text-sm">
                    By using our website, you agree to our Privacy Policy
                  </p>
                </div>
                <button
                  onClick={handleAccept}
                  className="bg-primary-gradient text-white px-8 py-3 rounded-lg shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Accept & Continue
                </button>
              </div>
            </div> */}

            {/* Contact Information */}
            <div className="mt-6 text-center">
              <p className="text-warm-brown">
                Questions about our privacy practices? Contact us at{" "}
                <a
                  href="mailto:privacy@spicedelight.com"
                  className="text-primary-orange hover:underline text-blue-600"
                >
                  {contactInfo.email }
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
