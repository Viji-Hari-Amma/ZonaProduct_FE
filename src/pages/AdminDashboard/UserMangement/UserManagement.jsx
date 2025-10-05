// components/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  listProfiles,
  deleteProfile,
  notifyInactiveUsers,
} from "../../../services/profileApi/profileApi";
import { changeUserStatus } from "../../../services/AuthService/AuthService";
import SearchBox from "./Search_and_filter/SearchBox";
import StatsCards from "./Card/StatsCards";
import Filters from "./Search_and_filter/Filters";
import UserCard from "./Card/UserCard";
import EditUserModal from "./Modal/EditUserModal";
import DeleteConfirmationModal from "./Modal/DeleteConfirmationModal";
import NotificationModal from "./Modal/NotificationModal";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedUsersForNotification, setSelectedUsersForNotification] =
    useState([]);

  // Enhanced pagination state
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  // Filter state for server-side filtering
  const [filters, setFilters] = useState({
    is_active: null,
    requires_action: null,
    is_superuser: null,
    is_staff: null,
    search: "",
  });

  // Build query parameters from filters
  const buildQueryParams = (page = 1, customFilters = null) => {
    const params = new URLSearchParams();
    const currentFilters = customFilters || filters;

    // Add pagination
    params.append("page", page);
    params.append("page_size", pagination.pageSize);

    // Add filters - only add non-null, non-empty values
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (key === "search" && value) {
          params.append(key, value);
        } else if (key !== "search") {
          params.append(key, value.toString()); // ✅ ensures false is kept
        }
      }
    });

    return params.toString();
  };

  // Map activeTab to API filters - FIXED: Don't trigger fetchUsers immediately
  useEffect(() => {
    const newFilters = { ...filters };

    switch (activeTab) {
      case "active":
        newFilters.is_active = true;
        newFilters.requires_action = null;
        newFilters.is_superuser = null;
        newFilters.is_staff = null;
        break;
      case "inactive":
        newFilters.is_active = false;
        newFilters.requires_action = null;
        newFilters.is_superuser = null;
        newFilters.is_staff = null;
        break;
      case "requires_action":
        newFilters.requires_action = true;
        newFilters.is_active = null;
        newFilters.is_superuser = null;
        newFilters.is_staff = null;
        break;
      case "superusers":
        newFilters.is_superuser = true;
        newFilters.is_active = null;
        newFilters.requires_action = null;
        newFilters.is_staff = null;
        break;
      case "staff":
        newFilters.is_staff = true;
        newFilters.is_superuser = false;
        newFilters.is_active = null;
        newFilters.requires_action = null;
        break;
      default:
        // "all" tab - clear specific filters
        newFilters.is_active = null;
        newFilters.requires_action = null;
        newFilters.is_superuser = null;
        newFilters.is_staff = null;
        break;
    }

    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  }, [activeTab]); // Only depend on activeTab

  // Update search filter when searchTerm changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchTerm,
      }));
      // Reset to first page when search changes
      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Fetch users when filters or pagination changes - FIXED: Proper dependency handling
  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.currentPage, pagination.pageSize]);

  const fetchUsers = async (url = null) => {
    try {
      setLoading(true);
      let queryParams = "";

      if (url) {
        // Extract query params from URL
        const urlObj = new URL(url);
        queryParams = urlObj.search;
      } else {
        // Build query params from current state
        queryParams = buildQueryParams(pagination.currentPage);
      }

      const fullUrl = queryParams
        ? `/Profile/admin/profiles/?${queryParams}`
        : "/Profile/admin/profiles/";
      const response = await listProfiles(fullUrl);

      // Handle paginated response
      const usersData = response.data.results || [];
      const paginationData = response.data;

      // Calculate total pages
      const totalPages = Math.ceil(paginationData.count / pagination.pageSize);

      // Extract current page from URL or response
      let currentPage = 1;
      if (url) {
        const urlParams = new URLSearchParams(new URL(url).search);
        currentPage = parseInt(urlParams.get("page")) || 1;
      } else {
        // Use the current page we requested
        currentPage = pagination.currentPage;
      }

      setPagination((prev) => ({
        ...prev,
        count: paginationData.count,
        next: paginationData.next,
        previous: paginationData.previous,
        currentPage: currentPage,
        totalPages: totalPages,
      }));

      // Ensure each user has the required permission fields with default values
      const usersWithPermissions = usersData.map((user) => ({
        ...user,
        is_staff: user.is_staff || false,
        is_superuser: user.is_superuser || false,
        requires_action: user.requires_action || user.inactive_days > 30,
      }));
      setUsers(usersWithPermissions);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
    // Don't call fetchUsers here - the useEffect will handle it
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // The useEffect for activeTab will handle resetting pagination and filters
  };

  // Rest of your functions remain the same...
  const handleEditUser = async (userData) => {
    try {
      await changeUserStatus(editingUser.user_id, userData);
      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers(); // Refresh the list to get updated data
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to activate user";
      toast.error(errorMessage);
      console.error("Error updating user:", error);
    }
  };

  const handleSetUserActive = async (user) => {
    try {
      await changeUserStatus(user.user_id, { is_active: true });
      toast.success("User activated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to activate user");
      console.error("Error activating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteProfile(userToDelete.user_id);
      toast.success("User deleted successfully");
      setUserToDelete(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  const handleSendNotification = async (
    sendToAll = false,
    specificUserIds = []
  ) => {
    try {
      const payload = sendToAll
        ? { send_to_all: true }
        : { user_ids: specificUserIds };

      const response = await notifyInactiveUsers(payload);
      toast.success(response.data.message || "Notifications sent successfully");
      setShowNotificationModal(false);
      setSelectedUsersForNotification([]);
    } catch (error) {
      toast.error("Failed to send notifications");
      console.error("Error sending notifications:", error);
    }
  };

  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    requiresAction: 0,
    superusers: 0,
    staffMembers: 0,
    avgInactivity: 0,
  });

  // Fetch stats from API once (ignores filters)
  const fetchGlobalStats = async () => {
    try {
      const response = await listProfiles("/Profile/admin/profiles/");
      const allUsers = response.data.results;

      const totalUsers = response.data.count;
      const activeUsers = allUsers.filter((u) => u.is_active).length;
      const requiresAction = allUsers.filter((u) => u.requires_action).length;
      const superusers = allUsers.filter((u) => u.is_superuser).length;
      const staffMembers = allUsers.filter(
        (u) => u.is_staff && !u.is_superuser
      ).length;
      const avgInactivity =
        allUsers.length > 0
          ? Math.round(
              allUsers.reduce((sum, u) => sum + u.inactive_days, 0) /
                allUsers.length
            )
          : 0;

      setGlobalStats({
        totalUsers,
        activeUsers,
        requiresAction,
        superusers,
        staffMembers,
        avgInactivity,
      });
    } catch (err) {
      console.error("Failed to fetch global stats", err);
    }
  };

  // Call once on mount
  useEffect(() => {
    fetchGlobalStats();
  }, []);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, maxVisiblePages - 1);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - (maxVisiblePages - 2));
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  const stats = globalStats;
  const usersRequiringAction = users.filter((user) => user.requires_action);

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#7C2D12] mb-2">
              User Management
            </h1>
            {usersRequiringAction.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-[#9A3412]">
                  {usersRequiringAction.length} users require action
                </span>
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Send Notifications
                </button>
              </div>
            )}
          </div>
          <SearchBox searchTerm={searchTerm} setSearchTerm={handleSearch} />
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <Filters activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Users Grid */}
        <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => setEditingUser(user)}
              onDelete={() => setUserToDelete(user)}
              onSetActive={() => handleSetUserActive(user)}
            />
          ))}
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-[#9A3412] text-lg">No users found</div>
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchTerm("");
                setFilters({
                  is_active: null,
                  requires_action: null,
                  is_superuser: null,
                  is_staff: null,
                  search: "",
                });
              }}
              className="mt-4 px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C]"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Enhanced Pagination */}
        <div className="mt-8">
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              {/* Results Info */}
              <div className="text-[#7C2D12] text-sm">
                Showing {users.length} of {pagination.count} users
              </div>

              {/* Page Navigation */}
              <div className="flex items-center space-x-2">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    pagination.currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#F97316] text-white hover:bg-[#EA580C]"
                  }`}
                >
                  First
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.previous}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    !pagination.previous
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#F97316] text-white hover:bg-[#EA580C]"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {generatePageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === "number" ? handlePageChange(page) : null
                      }
                      disabled={page === "..."}
                      className={`px-3 py-2 rounded-lg text-sm min-w-[40px] ${
                        page === "..."
                          ? "bg-transparent text-[#7C2D12] cursor-default"
                          : page === pagination.currentPage
                          ? "bg-[#DC2626] text-white font-bold"
                          : "bg-[#F97316] text-white hover:bg-[#EA580C]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.next}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    !pagination.next
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#F97316] text-white hover:bg-[#EA580C]"
                  }`}
                >
                  Next
                </button>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    pagination.currentPage === pagination.totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#F97316] text-white hover:bg-[#EA580C]"
                  }`}
                >
                  Last
                </button>
              </div>
            </div>
          )}

          {/* Page Size Selector - Always Visible */}
          <div className="flex items-center justify-end space-x-2 mt-4">
            <span className="text-[#7C2D12] text-sm">Show:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                setPagination((prev) => ({
                  ...prev,
                  pageSize: parseInt(e.target.value),
                  currentPage: 1,
                }));
              }}
              className="border border-[#F97316] rounded-lg px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-[#7C2D12] text-sm">per page</span>
          </div>

          {/* Current Page Info */}
          <div className="text-center mt-4 text-[#9A3412] text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>

        {/* Modals */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onSave={handleEditUser}
            onClose={() => setEditingUser(null)}
          />
        )}

        {userToDelete && (
          <DeleteConfirmationModal
            user={userToDelete}
            onConfirm={handleDeleteUser}
            onCancel={() => setUserToDelete(null)}
          />
        )}

        {showNotificationModal && (
          <NotificationModal
            users={usersRequiringAction}
            onSendAll={() => handleSendNotification(true)}
            onSendSpecific={(userIds) => handleSendNotification(false, userIds)}
            onClose={() => setShowNotificationModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;
