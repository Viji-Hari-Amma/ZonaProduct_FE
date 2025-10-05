// pages/TermsConditions.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FiFileText,
  FiShoppingCart,
  FiUser,
  FiAlertTriangle,
} from "react-icons/fi";

export const TermsAndConditions = () => {
  const [acceptedSections, setAcceptedSections] = useState(new Set());

  const sections = [
    {
      id: "account-terms",
      title: "Account Terms",
      icon: <FiUser className="w-5 h-5" />,
      mandatory: true,
      content: `
        <h3 class="text-lg font-semibold mb-3">Eligibility</h3>
        <p class="mb-4">You must be at least 18 years old and competent to enter into a binding contract to use our services. By creating an account, you represent that you meet these requirements.</p>
        
        <h3 class="text-lg font-semibold mb-3">Account Security</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          <li>All activities under your account are your responsibility</li>
          <li>Notify us immediately of any unauthorized access</li>
          <li>We reserve the right to suspend accounts violating these terms</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Account Information</h3>
        <p>You agree to provide accurate, current, and complete information during registration and to update it as needed.</p>
      `,
    },
    {
      id: "ordering-payment",
      title: "Ordering & Payment",
      icon: <FiShoppingCart className="w-5 h-5" />,
      mandatory: true,
      content: `
        <h3 class="text-lg font-semibold mb-3">Order Process</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Order confirmation does not constitute acceptance</li>
          <li>We reserve the right to cancel orders before shipment</li>
          <li>Prices are subject to change without notice</li>
          <li>All orders are subject to product availability</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Payment Terms</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>We accept UPI, Credit/Debit Cards, Net Banking, and COD</li>
          <li>Payment must be completed before order processing</li>
          <li>COD orders require cash payment upon delivery</li>
          <li>Failed payments may result in order cancellation</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Pricing & Taxes</h3>
        <p>All prices are in Indian Rupees (₹) and include applicable taxes. Shipping charges are additional unless otherwise specified.</p>
      `,
    },
    {
      id: "shipping-delivery",
      title: "Shipping & Delivery",
      icon: <FiShoppingCart className="w-5 h-5" />,
      mandatory: false,
      content: `
        <h3 class="text-lg font-semibold mb-3">Delivery Areas</h3>
        <p class="mb-4">We currently ship to all major cities and towns across India. Delivery timelines may vary based on location and courier service availability.</p>
        
        <h3 class="text-lg font-semibold mb-3">Delivery Attempts</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Three delivery attempts will be made</li>
          <li>Failed deliveries may incur additional charges</li>
          <li>Unclaimed orders will be returned and refunded</li>
          <li>Delivery delays due to external factors are not our responsibility</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Risk of Loss</h3>
        <p>All items purchased from us are made pursuant to a shipment contract. The risk of loss and title for such items pass to you upon our delivery to the carrier.</p>
      `,
    },
    {
      id: "returns-refunds",
      title: "Returns & Refunds",
      icon: <FiAlertTriangle className="w-5 h-5" />,
      mandatory: false,
      content: `
        <h3 class="text-lg font-semibold mb-3">Return Policy</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Returns accepted within 7 days of delivery</li>
          <li>Products must be unopened and in original condition</li>
          <li>Return shipping costs may apply for non-defective items</li>
          <li>Food safety regulations may limit certain returns</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Refund Process</h3>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Refunds processed within 3-4 working days after return approval</li>
          <li>Refunds issued to original payment method</li>
          <li>COD refunds via bank transfer or wallet</li>
          <li>Partial refunds for partial returns</li>
        </ul>
      `,
    },
    {
      id: "product-information",
      title: "Product Information",
      icon: <FiFileText className="w-5 h-5" />,
      mandatory: false,
      content: `
        <h3 class="text-lg font-semibold mb-3">Product Descriptions</h3>
        <p class="mb-4">We attempt to be as accurate as possible in product descriptions. However, we do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free.</p>
        
        <h3 class="text-lg font-semibold mb-3">Allergen Information</h3>
        <p class="mb-4">We provide detailed allergen information for all products. Customers with food allergies should review this information carefully before purchasing.</p>
        
        <h3 class="text-lg font-semibold mb-3">Shelf Life</h3>
        <p>All products are marked with manufacturing dates and best-before dates. We recommend consuming products before the best-before date for optimal quality.</p>
      `,
    },
  ];

  const toggleSection = (sectionId) => {
    const newAccepted = new Set(acceptedSections);
    if (newAccepted.has(sectionId)) {
      newAccepted.delete(sectionId);
    } else {
      newAccepted.add(sectionId);
    }
    setAcceptedSections(newAccepted);
  };

  const acceptAll = () => {
    const allSectionIds = new Set(sections.map((section) => section.id));
    setAcceptedSections(allSectionIds);
    toast.success("All terms and conditions accepted!");
  };

  const handleAccept = () => {
    const mandatorySections = sections
      .filter((s) => s.mandatory)
      .map((s) => s.id);
    const missingMandatory = mandatorySections.filter(
      (id) => !acceptedSections.has(id)
    );

    if (missingMandatory.length > 0) {
      toast.error("Please accept all mandatory terms and conditions");
      return;
    }

    toast.success("Terms and conditions accepted successfully!");
  };

  const allMandatoryAccepted = sections
    .filter((s) => s.mandatory)
    .every((s) => acceptedSections.has(s.id));

  return (
    <div className="min-h-screen bg-body-bg py-8 pt-[11vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-gradient rounded-full flex items-center justify-center shadow-lg">
            <FiFileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-deep-brown mb-4">
            Terms & Conditions
          </h1>
          <p className="text-warm-brown text-lg max-w-3xl mx-auto">
            Please read these terms carefully before using our services. By
            accessing or using our platform, you agree to be bound by these
            terms.
          </p>
        </div>

        {/* Acceptance Progress */}
        <div className="bg-white rounded-xl shadow-red-glow border border-soft-orange p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-deep-brown text-lg">
                Acceptance Progress
              </h3>
              <p className="text-warm-brown text-sm">
                {acceptedSections.size} of {sections.length} sections accepted
              </p>
            </div>
            <button
              onClick={acceptAll}
              className="bg-primary-orange text-white px-4 py-2 rounded-lg hover:bg-primary-red transition-colors duration-300"
            >
              Accept All
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-gradient h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(acceptedSections.size / sections.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-red-glow border border-soft-orange overflow-hidden transition-all duration-300 hover:shadow-red-glow-hover"
            >
              <div className="bg-section-alt px-6 py-4 border-b border-FECACA">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {section.icon}
                    <h2 className="text-xl font-bold text-deep-brown ml-3">
                      {section.title}
                    </h2>
                    {section.mandatory && (
                      <span className="ml-3 bg-primary-red text-white px-2 py-1 rounded text-xs font-medium">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      acceptedSections.has(section.id)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {acceptedSections.has(section.id) ? "Accepted" : "Accept"}
                  </button>
                </div>
              </div>

              <div
                className="p-6 text-warm-brown leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>

        {/* Final Acceptance */}
        <div className="mt-12 bg-white rounded-xl shadow-red-glow border border-soft-orange p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-gradient rounded-full flex items-center justify-center">
            <FiFileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-deep-brown mb-2">
            Agreement Confirmation
          </h3>
          <p className="text-warm-brown mb-6 max-w-2xl mx-auto">
            By clicking "I Agree", you acknowledge that you have read,
            understood, and agree to be bound by all the terms and conditions
            outlined above.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleAccept}
              disabled={!allMandatoryAccepted}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                allMandatoryAccepted
                  ? "bg-primary-gradient text-white shadow-button hover:shadow-button-hover hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              I Agree to All Terms
            </button>
            <button className="border border-primary-orange text-primary-orange px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-orange hover:text-white transition-all duration-300">
              Download Terms (PDF)
            </button>
          </div>

          {!allMandatoryAccepted && (
            <p className="text-red-600 mt-4 text-sm">
              * Please accept all mandatory terms and conditions to continue
            </p>
          )}
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-warm-brown text-sm">
          <p>Last updated: December 2024</p>
          <p className="mt-2">
            For questions about these terms, contact us at{" "}
            <a
              href="mailto:legal@spicedelight.com"
              className="text-primary-orange hover:underline"
            >
              legal@spicedelight.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
