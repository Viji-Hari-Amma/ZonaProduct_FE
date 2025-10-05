// pages/FAQ.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiMail,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";
import FAQ_API from "../../services/FAQ_Api/FAQ_Api";
import { aboutService } from "../../services/AboutPageApi/about";

export const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(null);
  const [contactDetails, setContactDetails] = useState(null);

  // Fetch FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await FAQ_API.list();
        const commonFaqs = response.data.filter(
          (faq) => faq.faq_type === "common" && faq.is_active
        );
        setFaqs(commonFaqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        toast.error("Failed to load FAQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  // Fetch Contact Details
  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await aboutService.getContactDetails();
        setContactDetails(response.data?.data);
      } catch (error) {
        console.error("Error fetching contact details:", error);
      }
    };
    fetchContactDetails();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ✅ Mobile-safe copy with fallback
  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
      } else {
        // Fallback for older browsers or mobile
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (success) toast.success("Copied to clipboard!");
        else throw new Error("Copy failed");
      }
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy. Try manually!");
    }
  };

  // ✅ Handle helpful vote
  const markHelpful = async (faqId, isHelpful) => {
    try {
      setVoting(faqId);
      await FAQ_API.markHelpful(faqId, { is_helpful: isHelpful });
      toast.success(
        isHelpful ? "Thanks for your feedback!" : "Feedback noted!"
      );

      // Update local state counts
      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === faqId
            ? {
                ...faq,
                helpful_count: isHelpful
                  ? (faq.helpful_count || 0) + 1
                  : faq.helpful_count,
                not_helpful_count: !isHelpful
                  ? (faq.not_helpful_count || 0) + 1
                  : faq.not_helpful_count,
              }
            : faq
        )
      );
    } catch (err) {
      console.error("Error marking helpful:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setVoting(null);
    }
  };

  // Search filter
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-body-bg py-8 pt-[11vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-deep-brown mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-warm-brown text-lg max-w-2xl mx-auto">
            Find quick answers to common questions about our products and
            services.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 border border-FDBA74 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange bg-white shadow-sm"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warm-brown">
              🔍
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-warm-brown">Loading FAQs...</p>
          ) : filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => (
              <div
                key={item.id}
                className="bg-white border border-soft-orange rounded-xl shadow-red-glow overflow-hidden transition-all duration-300 hover:shadow-red-glow-hover"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-section-alt/50 transition-colors duration-200"
                >
                  <span className="font-medium text-deep-brown text-lg pr-4">
                    {item.question}
                  </span>
                  {openIndex === index ? (
                    <FiChevronUp className="w-5 h-5 text-primary-orange flex-shrink-0" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-primary-orange flex-shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 py-4 bg-section-alt/30 animate-fadeIn">
                    <p className="text-warm-brown leading-relaxed mb-4">
                      {item.answer}
                    </p>

                    {/* ✅ Helpful section */}
                    <div className="flex items-center justify-end space-x-4 text-sm text-warm-brown">
                      <span>Was this helpful?</span>
                      <button
                        onClick={() => markHelpful(item.id, true)}
                        disabled={voting === item.id}
                        className="flex items-center text-green-600 hover:scale-110 transition-transform"
                      >
                        <FiThumbsUp className="mr-1" />{" "}
                        {item.helpful_count ?? 0}
                      </button>
                      <button
                        onClick={() => markHelpful(item.id, false)}
                        disabled={voting === item.id}
                        className="flex items-center text-red-500 hover:scale-110 transition-transform"
                      >
                        <FiThumbsDown className="mr-1" />{" "}
                        {item.not_helpful_count ?? 0}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-warm-brown">
              No FAQs found for your search.
            </p>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-white border border-soft-orange rounded-xl shadow-red-glow p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-gradient rounded-full flex items-center justify-center">
            <FiMail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-deep-brown mb-2">
            Still need help?
          </h3>
          <p className="text-warm-brown mb-4">
            Our support team is here to assist you.
          </p>

          {contactDetails ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => copyToClipboard(contactDetails?.email)}
                className="bg-primary-gradient text-white px-6 py-3 rounded-lg shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300 flex items-center"
              >
                <FiMail className="w-4 h-4 mr-2" />
                {contactDetails?.email}
                <FiCopy className="w-4 h-4 ml-2" />
              </button>
              <button className="border border-primary-orange text-primary-orange px-6 py-3 rounded-lg hover:bg-primary-orange hover:text-blue-700 transition-all duration-300">
                Call Support: {contactDetails?.phone_number}
              </button>
            </div>
          ) : (
            <p className="text-warm-brown">Loading contact details...</p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
