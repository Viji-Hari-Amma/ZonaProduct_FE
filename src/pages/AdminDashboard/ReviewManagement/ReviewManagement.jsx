import React, { useState, useEffect } from "react";
import { FiPackage } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  approveReview,
  getAdminReviews,
  rejectReview,
  updateReview,
  deleteReview,
} from "../../../services/reviewApi/reviewApi";
import LoadingSpinner from "./Spinner/LoadingSpinner";
import ReviewFilters from "./Filters/ReviewFilters";
import ReviewItem from "./ReviewItem/ReviewItem";
import Pagination from "./Pagination/Pagination";
import ReviewDeleteModal from "./Model/ReviewDeleteModal";
import ReviewEditModal from "./Model/ReviewEditModal";


const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Filters and pagination
  const [filters, setFilters] = useState({
    search: "",
    is_approved: "all",
    rating: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  // Modals
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ rating: 0, comment: "" });

  // Fetch reviews with filters and pagination
  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);

      const params = {
        page,
        page_size: pagination.pageSize,
        ...(filters.search && { search: filters.search }),
        ...(filters.is_approved !== "all" && {
          is_approved: filters.is_approved === "approved",
        }),
        ...(filters.rating && { rating: filters.rating }),
      };

      const response = await getAdminReviews(params);

      // FIX: Handle undefined data safely
      const reviewsData = response.data || [];
      const totalCount = response.count || 0;

      setReviews(reviewsData);

      // Update pagination
      setPagination((prev) => ({
        ...prev,
        page,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / prev.pageSize),
      }));
    } catch (error) {
      toast.error("Failed to fetch reviews");
      console.error("Error fetching reviews:", error);
      setReviews([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      search: "",
      is_approved: "all",
      rating: "",
    });
  };

  const handleApprove = async (review) => {
    try {
      setActionLoading(`approve-${review.id}`);
      await approveReview(review.product.id, review.id);

      // Update local state
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, is_approved: true } : r))
      );
      toast.success("Review approved successfully!");
    } catch (error) {
      toast.error("Failed to approve review");
      console.error("Error approving review:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (review) => {
    try {
      setActionLoading(`reject-${review.id}`);
      await rejectReview(review.product.id, review.id);

      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, is_approved: false } : r))
      );
      toast.success("Review rejected successfully!");
    } catch (error) {
      toast.error("Failed to reject review");
      console.error("Error rejecting review:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;

    try {
      setActionLoading(`delete-${selectedReview.id}`);
      await deleteReview(selectedReview.product.id, selectedReview.id);

      setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));
      setShowDeleteModal(false);
      setSelectedReview(null);
      toast.success("Review deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete review");
      console.error("Error deleting review:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;

    try {
      setActionLoading(`edit-${selectedReview.id}`);
      await updateReview(
        selectedReview.product.id,
        selectedReview.id,
        editForm
      );

      setReviews((prev) =>
        prev.map((r) =>
          r.id === selectedReview.id ? { ...r, ...editForm } : r
        )
      );

      setShowEditModal(false);
      setSelectedReview(null);
      toast.success("Review updated successfully!");
    } catch (error) {
      toast.error("Failed to update review");
      console.error("Error updating review:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    fetchReviews(newPage);
  };

  if (loading && reviews.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#7C2D12] mb-2">
          Review Management
        </h1>
        <p className="text-[#9A3412]">
          Manage and moderate customer reviews ({pagination.totalCount} total
          reviews)
        </p>
      </div>

      {/* Filters */}
      <ReviewFilters
        filters={filters}
        setFilters={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Reviews Grid */}
      <div className="grid gap-4 lg:gap-6 mb-6">
        {!reviews || reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-8 lg:p-12 text-center shadow-[0_6px_16px_rgba(220,38,38,0.15)] border border-[#FED7AA]">
            <FiPackage className="mx-auto text-4xl text-[#9CA3AF] mb-4" />
            <h3 className="text-xl font-semibold text-[#7C2D12] mb-2">
              No reviews found
            </h3>
            <p className="text-[#9A3412]">
              {filters.search ||
              filters.is_approved !== "all" ||
              filters.rating ||
              filters.user_email
                ? "Try adjusting your search or filter criteria"
                : "No reviews have been submitted yet"}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              actionLoading={actionLoading}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}

      {/* Modals */}
      <ReviewDeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedReview={selectedReview}
        actionLoading={actionLoading}
        onConfirm={handleDeleteConfirm}
      />

      <ReviewEditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        selectedReview={selectedReview}
        editForm={editForm}
        setEditForm={setEditForm}
        actionLoading={actionLoading}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default ReviewManagement;
