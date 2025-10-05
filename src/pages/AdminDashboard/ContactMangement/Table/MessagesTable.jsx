// MessagesTable.jsx
import {
  FaEye,
  FaEnvelope,
  FaEnvelopeOpen,
  FaArchive,
  FaTrash,
} from "react-icons/fa";
import StatusBadge from "../Badge/StatusBadge";

const MessagesTable = ({
  contacts,
  selectedContacts,
  onSelectAll,
  onSelectContact,
  onViewMessage,
  onToggleRead,
  onToggleArchive,
  onDeleteClick,
  loading = false,
}) => {
  if (loading && contacts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-[#FED7AA] overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
          <span className="ml-3 text-[#7C2D12]">Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#FED7AA] overflow-hidden hover:shadow-xl transition-shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white">
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={
                    selectedContacts.length === contacts.length &&
                    contacts.length > 0
                  }
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-4 text-left">Sender</th>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-[#9A3412]"
                >
                  No messages found
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className={`border-b border-[#FECACA] hover:bg-[#FFF5F0] transition-colors ${
                    !contact.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => onSelectContact(contact.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#1E293B]">
                        {contact.full_name}
                      </p>
                      <p className="text-sm text-[#9A3412]">{contact.email}</p>
                      <p className="text-sm text-[#9CA3AF]">
                        {contact.phone_number}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1E293B]">
                      {contact.subject}
                    </p>
                    <p className="text-sm text-[#9A3412] truncate max-w-xs">
                      {contact.message}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={contact.status} />
                  </td>
                  <td className="px-6 py-4 text-[#9A3412]">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewMessage(contact)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Message"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() =>
                          onToggleRead(contact.id, contact.is_read)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          contact.is_read
                            ? "text-yellow-600 hover:bg-yellow-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={
                          contact.is_read ? "Mark as Unread" : "Mark as Read"
                        }
                      >
                        {contact.is_read ? <FaEnvelope /> : <FaEnvelopeOpen />}
                      </button>
                      <button
                        onClick={() =>
                          onToggleArchive(contact.id, contact.is_archived)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          contact.is_archived
                            ? "text-purple-600 hover:bg-purple-50"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        title={contact.is_archived ? "Unarchive" : "Archive"}
                      >
                        <FaArchive />
                      </button>
                      <button
                        onClick={() => onDeleteClick(contact.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagesTable;
