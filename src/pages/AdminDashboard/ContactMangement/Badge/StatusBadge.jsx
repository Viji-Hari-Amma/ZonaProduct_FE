const StatusBadge = ({ status }) => {
  const statusConfig = {
    unread: {
      color: "bg-red-100 text-red-800 border-red-200",
      text: "Unread",
    },
    read: {
      color: "bg-green-100 text-green-800 border-green-200",
      text: "Read",
    },
    archived: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      text: "Archived",
    },
  };

  const config = statusConfig[status] || statusConfig.unread;

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${config.color}`}
    >
      {config.text}
    </span>
  );
};

export default StatusBadge;