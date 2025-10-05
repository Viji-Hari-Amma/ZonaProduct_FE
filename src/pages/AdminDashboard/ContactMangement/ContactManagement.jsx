// ContactManagement.jsx
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getContacts,
  deleteContactMessage,
  toggleArchiveContact,
  toggleReadStatusContact,
  bulkArchiveContacts,
  bulkReadStatusContacts,
} from "../../../services/contactApi/contactApi";
import StatsCards from "./Cards/StatsCards";
import Controls from "./Controls/Controls";
import MessagesTable from "./Table/MessagesTable";
import Pagination from "./Pagination/Pagination";
import MessageDetailModal from "./Modal/MessageDetailModal";
import DeleteConfirmationModal from "./Modal/DeleteConfirmationModal";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("-created_at");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [stats, setStats] = useState([]);
  // Memoized fetch function to prevent unnecessary re-renders
  const fetchContacts = useCallback(
    async (page = 1, filters = {}) => {
      setLoading(true);
      try {
        const params = {
          page: page,
          status: filters.activeTab || activeTab === "all" ? "" : activeTab,
          search: filters.searchTerm || searchTerm || "",
          sort: filters.sortBy || sortBy,
          page_size: itemsPerPage,
        };


        const response = await getContacts(params);
        const statusResponse = await getContacts();
        setStats(statusResponse.data.results);
        // Handle both paginated and non-paginated responses
        if (response.data && response.data.results) {
          // Django REST framework pagination format

          setContacts(response.data.results);
          setTotalCount(response.data.count);
          setTotalPages(Math.ceil(response.data.count / itemsPerPage));
        } else if (response.data && Array.isArray(response.data)) {
          // Non-paginated response
          setContacts(response.data);
          setTotalCount(response.data.length);
          setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        } else {
          // Fallback
          setContacts([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } catch (error) {
        toast.error("Failed to load contacts");
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    },
    [activeTab, searchTerm, sortBy, itemsPerPage]
  );

  // Single useEffect for initial load and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(1);
    }, 300); // Debounce to prevent rapid calls

    return () => clearTimeout(timer);
  }, [activeTab, searchTerm, sortBy, fetchContacts]);

  // Separate useEffect for page changes only
  useEffect(() => {
    if (currentPage > 1) {
      fetchContacts(currentPage);
    }
  }, [currentPage, fetchContacts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, sortBy]);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedContacts([]);
  }, [contacts]);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedContacts(contacts.map((contact) => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Single contact actions with immediate UI update + API call
  const handleToggleRead = async (contactId, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              is_read: newStatus,
              status: newStatus ? "read" : "unread",
            }
          : contact
      )
    );

    try {
      await toggleReadStatusContact(contactId, { is_read: newStatus });
      toast.success(`Message marked as ${newStatus ? "read" : "unread"}`);
    } catch (error) {
      // Revert on error
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === contactId
            ? {
                ...contact,
                is_read: currentStatus,
                status: currentStatus ? "read" : "unread",
              }
            : contact
        )
      );
      toast.error("Failed to update read status");
    }
  };

  const handleToggleArchive = async (contactId, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              is_archived: newStatus,
              status: newStatus ? "archived" : "unread",
            }
          : contact
      )
    );

    try {
      await toggleArchiveContact(contactId, { is_archived: newStatus });
      toast.success(`Message ${newStatus ? "archived" : "unarchived"}`);
    } catch (error) {
      // Revert on error
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === contactId
            ? {
                ...contact,
                is_archived: currentStatus,
                status: currentStatus ? "archived" : "unread",
              }
            : contact
        )
      );
      toast.error("Failed to update archive status");
    }
  };

  const handleDeleteClick = (contactId = null) => {
    setContactToDelete(contactId);
    setShowDeleteModal(true);
  };

  const handleDelete = async (contactId) => {
    try {
      await deleteContactMessage(contactId);
      // Refresh the data after deletion
      fetchContacts(currentPage);
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
      throw error;
    }
  };

  const handleViewMessage = (contact) => {
    setSelectedMessage(contact);
    setShowModal(true);
    // Mark as read when viewing if not already read
    if (!contact.is_read) {
      handleToggleRead(contact.id, contact.is_read);
    }
  };

  // Bulk actions
  const handleBulkArchive = async () => {
    if (selectedContacts.length === 0) {
      toast.warning("Please select messages to archive");
      return;
    }

    try {
      await bulkArchiveContacts({
        contact_ids: selectedContacts,
        is_archived: true,
      });
      fetchContacts(currentPage); // Refresh data
      setSelectedContacts([]);
      toast.success("Messages archived successfully");
    } catch (error) {
      toast.error("Failed to archive messages");
    }
  };

  const handleBulkRead = async (readStatus) => {
    if (selectedContacts.length === 0) {
      toast.warning("Please select messages to update");
      return;
    }

    try {
      await bulkReadStatusContacts({
        contact_ids: selectedContacts,
        is_read: readStatus,
      });
      fetchContacts(currentPage); // Refresh data
      setSelectedContacts([]);
      toast.success(`Messages marked as ${readStatus ? "read" : "unread"}`);
    } catch (error) {
      toast.error("Failed to update read status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) {
      toast.warning("Please select messages to delete");
      return;
    }
    setContactToDelete(selectedContacts);
    setShowDeleteModal(true);
  };

  // Tab configuration
  const tabs = [
    { key: "all", label: "All Messages" },
    { key: "unread", label: "Unread" },
    { key: "read", label: "Read" },
    { key: "archived", label: "Archived" },
  ];

  if (loading && contacts.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7C2D12] mb-2">
          Contact Messages
        </h1>
        <p className="text-[#9A3412]">
          Manage and respond to customer inquiries
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards contacts={stats} />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg border border-[#FED7AA] mb-6">
        <div className="flex border-b border-[#FED7AA]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white"
                  : "text-[#7C2D12] hover:bg-[#FFEDE9]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <Controls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedContacts={selectedContacts}
        onBulkRead={handleBulkRead}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
      />

      {/* Messages Table */}
      <MessagesTable
        contacts={contacts}
        selectedContacts={selectedContacts}
        onSelectAll={handleSelectAll}
        onSelectContact={handleSelectContact}
        onViewMessage={handleViewMessage}
        onToggleRead={handleToggleRead}
        onToggleArchive={handleToggleArchive}
        onDeleteClick={handleDeleteClick}
        loading={loading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          indexOfFirstItem={(currentPage - 1) * itemsPerPage + 1}
          indexOfLastItem={Math.min(currentPage * itemsPerPage, totalCount)}
          totalCount={totalCount}
        />
      )}

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <MessageDetailModal
          selectedMessage={selectedMessage}
          onClose={() => setShowModal(false)}
          onToggleRead={handleToggleRead}
          onToggleArchive={handleToggleArchive}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          contactToDelete={contactToDelete}
          selectedContactsCount={
            Array.isArray(contactToDelete) ? contactToDelete.length : 1
          }
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setContactToDelete(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setContactToDelete(null);
            if (Array.isArray(contactToDelete)) {
              setSelectedContacts([]);
            }
          }}
        />
      )}
    </div>
  );
};

export default ContactManagement;
