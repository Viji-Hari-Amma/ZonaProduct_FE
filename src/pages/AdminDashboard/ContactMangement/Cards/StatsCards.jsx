import { FaEnvelope, FaEnvelopeOpen, FaArchive } from "react-icons/fa";

const StatsCards = ({ contacts }) => {
  const stats = [
    {
      label: "Total Messages",
      value: contacts.length,
      icon: FaEnvelope,
      bgColor: "bg-[#FFEDE9]",
      iconColor: "text-[#DC2626]",
    },
    {
      label: "Unread",
      value: contacts.filter((c) => c.status === "unread").length,
      icon: FaEnvelope,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      label: "Read",
      value: contacts.filter((c) => c.status === "read").length,
      icon: FaEnvelopeOpen,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Archived",
      value: contacts.filter((c) => c.status === "archived").length,
      icon: FaArchive,
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-lg border border-[#FED7AA]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#9A3412]">{stat.label}</p>
              <p className="text-2xl font-bold text-[#7C2D12]">{stat.value}</p>
            </div>
            <div className={`p-3 ${stat.bgColor} rounded-full`}>
              <stat.icon className={stat.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;