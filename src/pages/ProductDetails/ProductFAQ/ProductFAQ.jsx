import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FAQ_API from "../../../services/FAQ_Api/FAQ_Api";

const ProductFAQ = ({ productId }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [votingInProgress, setVotingInProgress] = useState({});

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await FAQ_API.byProduct(productId);
        setFaqs(response.data || []);
      } catch (error) {
        console.error("Error loading FAQs:", error);
        toast.error("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchFAQs();
    }
  }, [productId]);

  const handleMarkHelpful = async (faqId, isHelpful) => {
    try {
      setVotingInProgress(prev => ({ ...prev, [faqId]: true }));
      
      await FAQ_API.markHelpful(faqId, { is_helpful: isHelpful });
      
      // Update local state to reflect the vote
      setFaqs(prevFaqs => 
        prevFaqs.map(faq => {
          if (faq.id === faqId) {
            return {
              ...faq,
              helpful_count: isHelpful ? faq.helpful_count + 1 : faq.helpful_count,
              not_helpful_count: !isHelpful ? faq.not_helpful_count + 1 : faq.not_helpful_count,
              helpful_ratio: isHelpful ? 
                ((faq.helpful_count + 1) / ((faq.helpful_count + 1) + faq.not_helpful_count)) * 100 :
                (faq.helpful_count / (faq.helpful_count + (faq.not_helpful_count + 1))) * 100
            };
          }
          return faq;
        })
      );

      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error marking FAQ as helpful:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setVotingInProgress(prev => ({ ...prev, [faqId]: false }));
    }
  };

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-[#FED7AA] p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return null; // Return null to hide the component when no FAQs
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-[#FED7AA] p-6 max-w-375:p-2">
      <h2 className="text-2xl font-bold text-[#7C2D12] mb-6 max-w-375:text-xl max-w-375:text-center max-w-375:mb-4">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-[#FED7AA] rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-4 py-4 max-w-375:p-3 text-left bg-orange-50 hover:bg-orange-100 transition-colors duration-200 flex justify-between items-center"
              onClick={() => toggleFaq(faq.id)}
            >
              <span className="font-semibold text-[#7C2D12] text-lg">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-[#9A3412] transition-transform duration-200 ${
                  expandedFaq === faq.id ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {expandedFaq === faq.id && (
              <div className="px-4 py-4 max-w-375:p-3 bg-white">
                <p className="text-gray-700 mb-4 leading-relaxed max-w-375:text-justify">{faq.answer}</p>
                
                {/* Helpful Feedback Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    Was this helpful?
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMarkHelpful(faq.id, true)}
                      disabled={votingInProgress[faq.id]}
                      className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                        votingInProgress[faq.id]
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {votingInProgress[faq.id] ? "..." : "Yes"}
                    </button>
                    <button
                      onClick={() => handleMarkHelpful(faq.id, false)}
                      disabled={votingInProgress[faq.id]}
                      className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                        votingInProgress[faq.id]
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {votingInProgress[faq.id] ? "..." : "No"}
                    </button>
                  </div>
                </div>
                
                {/* Helpful Stats */}
                {(faq.helpful_count > 0 || faq.not_helpful_count > 0) && (
                  <div className="mt-2 text-xs text-gray-500">
                    {faq.helpful_count} found this helpful • {faq.not_helpful_count} did not
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFAQ;