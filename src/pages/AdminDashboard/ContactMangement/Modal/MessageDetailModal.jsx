import { FaReply, FaEnvelope, FaEnvelopeOpen, FaArchive, FaTimes } from "react-icons/fa";
import StatusBadge from "../Badge/StatusBadge";

const MessageDetailModal = ({ 
  selectedMessage, 
  onClose, 
  onToggleRead, 
  onToggleArchive 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#F97316] to-[#DC2626] p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">
                {selectedMessage.subject}
              </h2>
              <p className="mt-2 opacity-90">{selectedMessage.full_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-[#9A3412]">
                Email
              </label>
              <p className="text-[#1E293B]">{selectedMessage.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9A3412]">
                Phone
              </label>
              <p className="text-[#1E293B]">
                {selectedMessage.phone_number}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9A3412]">
                Date
              </label>
              <p className="text-[#1E293B]">
                {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9A3412]">
                Status
              </label>
              <div className="mt-1">
                <StatusBadge status={selectedMessage.status} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#9A3412]">
              Message
            </label>
            <div className="mt-2 p-4 bg-[#FFEDE9] rounded-lg border border-[#FECACA]">
              <p className="text-[#1E293B] whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-[#FECACA]">
            <button
              onClick={() => {
                window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              <FaReply />
              Reply
            </button>
            <button
              onClick={() =>
                onToggleRead(
                  selectedMessage.id,
                  selectedMessage.is_read
                )
              }
              className="flex items-center gap-2 px-4 py-2 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] transition-colors"
            >
              {selectedMessage.is_read ? (
                <FaEnvelope />
              ) : (
                <FaEnvelopeOpen />
              )}
              {selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
            </button>
            <button
              onClick={() =>
                onToggleArchive(
                  selectedMessage.id,
                  selectedMessage.is_archived
                )
              }
              className="flex items-center gap-2 px-4 py-2 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] transition-colors"
            >
              <FaArchive />
              {selectedMessage.is_archived ? "Unarchive" : "Archive"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailModal;