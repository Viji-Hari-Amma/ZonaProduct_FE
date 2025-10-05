// components/admin/faq/FAQStats.jsx
import React from 'react';
import { FaQuestionCircle, FaProductHunt, FaChartLine, FaEye } from 'react-icons/fa';

const FAQStats = ({ faqs }) => {
  const stats = {
    total: faqs.length,
    common: faqs.filter(faq => faq.faq_type === 'common').length,
    product: faqs.filter(faq => faq.faq_type === 'product').length,
    active: faqs.filter(faq => faq.is_active).length,
    totalHelpful: faqs.reduce((sum, faq) => sum + faq.helpful_count, 0),
    avgHelpfulRatio: faqs.length > 0 
      ? faqs.reduce((sum, faq) => sum + faq.helpful_ratio, 0) / faqs.length 
      : 0
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-lg border border-[#FED7AA] p-6 hover:shadow-xl transition-all duration-200 hover:translate-y-[-2px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#9CA3AF] text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-[#7C2D12] mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={FaQuestionCircle}
        label="Total FAQs"
        value={stats.total}
        color="bg-gradient-to-r from-[#F97316] to-[#DC2626]"
      />
      <StatCard
        icon={FaProductHunt}
        label="Common Issues"
        value={stats.common}
        color="bg-gradient-to-r from-blue-500 to-blue-600"
      />
      <StatCard
        icon={FaEye}
        label="Active FAQs"
        value={stats.active}
        color="bg-gradient-to-r from-green-500 to-green-600"
      />
      <StatCard
        icon={FaChartLine}
        label="Avg Helpful Ratio"
        value={`${Math.round(stats.avgHelpfulRatio * 100)}%`}
        color="bg-gradient-to-r from-purple-500 to-purple-600"
      />
    </div>
  );
};

export default FAQStats;