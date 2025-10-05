import React from "react";
import { FaTimes, FaPaperPlane, FaCheck, FaTimesCircle, FaClock, FaEnvelope } from "react-icons/fa";

const ReminderHistoryModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReminderTypeLabel = (type) => {
    const types = {
      payment_mode_missing: "Payment Mode Missing",
      payment_pending: "Payment Pending",
      payment_confirmation: "Payment Confirmation",
      cod_confirmation: "COD Confirmation",
      order_confirmation: "Order Confirmation"
    };
    return types[type] || type;
  };

  const getStatusIcon = (success) => {
    if (success) {
      return <FaCheck className="text-green-500" />;
    } else {
      return <FaTimesCircle className="text-red-500" />;
    }
  };

  const getStatusBadge = (success) => {
    if (success) {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaPaperPlane className="text-xl" />
            <div>
              <h2 className="text-xl font-bold">Reminder History</h2>
              <p className="text-blue-100 text-sm">
                Order: #{order.id?.substring(0, 8)}... | 
                Customer: {order.user?.full_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 text-xl font-bold transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Reminder Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {order.reminder_info?.total_reminders_sent || 0}
                </div>
                <div className="text-sm text-gray-600">Total Sent</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {order.reminder_info?.successful_reminders || 0}
                </div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">
                  {order.reminder_info?.success_rate || 0}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {order.reminder_info?.is_eligible_for_reminders ? "Yes" : "No"}
                </div>
                <div className="text-sm text-gray-600">Eligible</div>
              </div>
            </div>
          </div>

          {/* Reminder History List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Reminder History ({order.reminder_history?.length || 0})
            </h3>

            {order.reminder_history && order.reminder_history.length > 0 ? (
              order.reminder_history.map((reminder, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getStatusBadge(reminder.success)}`}>
                        {getStatusIcon(reminder.success)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {getReminderTypeLabel(reminder.reminder_type)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(reminder.sent_at)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reminder.success)}`}>
                      {reminder.success ? "Delivered" : "Failed"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Message:</span>
                      <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg">
                        {reminder.custom_message || "No custom message"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Channel:</span>
                        <span className="ml-2 text-gray-600">
                          {reminder.channel || "Email"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Recipient:</span>
                        <span className="ml-2 text-gray-600">
                          {reminder.recipient_email || order.contact_info?.email}
                        </span>
                      </div>
                    </div>

                    {reminder.error_message && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <span className="text-sm font-medium text-red-700">Error:</span>
                        <p className="text-red-600 text-sm mt-1">{reminder.error_message}</p>
                      </div>
                    )}

                    {reminder.response_data && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <span className="text-sm font-medium text-green-700">Response:</span>
                        <pre className="text-green-600 text-sm mt-1 whitespace-pre-wrap">
                          {JSON.stringify(reminder.response_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FaPaperPlane className="text-4xl text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  No Reminders Sent
                </h4>
                <p className="text-gray-500">
                  No reminder history found for this order.
                </p>
              </div>
            )}
          </div>

          {/* Next Reminder Information */}
          {order.reminder_info?.next_reminder_allowed_at && (
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-orange-500" />
                <h4 className="font-semibold text-orange-800">Next Reminder</h4>
              </div>
              <p className="text-orange-700">
                Next reminder can be sent after:{" "}
                <span className="font-medium">
                  {formatDate(order.reminder_info.next_reminder_allowed_at)}
                </span>
              </p>
            </div>
          )}

          {/* Suggested Reminder */}
          {order.reminder_info?.suggested_reminder_type && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaEnvelope className="text-blue-500" />
                <h4 className="font-semibold text-blue-800">Suggested Reminder</h4>
              </div>
              <p className="text-blue-700">
                Type: <span className="font-medium">{getReminderTypeLabel(order.reminder_info.suggested_reminder_type)}</span>
              </p>
              {order.reminder_info.can_send_reminder && (
                <p className="text-green-600 text-sm mt-1">
                  ✓ Ready to send next reminder
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderHistoryModal;