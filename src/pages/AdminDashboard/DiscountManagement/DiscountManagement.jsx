import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaSync, FaBell } from "react-icons/fa";
import { useDiscounts } from "../../../hooks/useDiscounts";
import { LoadingButton } from "./LoadingButton/LoadingButton";
import { DiscountStats } from "./Stats/DiscountStats";
import { DiscountList } from "./DiscountList/DiscountList";
import { DiscountForm } from "./Form/DiscountForm";
import { DeleteConfirmation } from "./Modal/DeleteConfirmation";

const DiscountManagement = () => {
  const {
    discounts,
    stats,
    loading,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    toggleActive,
    sendNotification,
    refreshDiscounts,
  } = useDiscounts();

  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [deletingDiscount, setDeletingDiscount] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreateDiscount = async (data) => {
    setActionLoading(true);
    const success = await createDiscount(data);
    setActionLoading(false);
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdateDiscount = async (data) => {
    setActionLoading(true);
    const success = await updateDiscount(editingDiscount.id, data);
    setActionLoading(false);
    if (success) {
      setEditingDiscount(null);
    }
  };

  const handleDeleteDiscount = async (id) => {

    setActionLoading(true);
    const success = await deleteDiscount(id);
    setActionLoading(false);

    if (success) {
      setDeletingDiscount(null);
    } else {
      console.error("Failed to delete discount");
    }
  };

  const handleToggleActive = async (id) => {
    await toggleActive(id);
  };

  const handleSendNotification = async (id) => {
    await sendNotification(id);
  };

  const handleSendAllPending = async () => {
    try {
      // This would call your send-pending-notifications endpoint
      toast.info("Sending pending notifications...");
      // Implement based on your API
    } catch (error) {
      toast.error("Failed to send notifications");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-brown-800 mb-2">
              Discount Management
            </h1>
            <p className="text-brown-600">
              Create and manage product discounts and promotions
            </p>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <LoadingButton
              onClick={handleSendAllPending}
              className="bg-gradient-to-r from-purple-500 to-indigo-600"
            >
              <FaBell className="mr-2" />
              Send All Notifications
            </LoadingButton>

            <button
              onClick={refreshDiscounts}
              disabled={loading}
              className="px-4 py-3 border border-orange-300 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors disabled:opacity-50"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
            </button>

            <LoadingButton
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600"
            >
              <FaPlus className="mr-2" />
              New Discount
            </LoadingButton>
          </div>
        </div>

        {/* Statistics */}
        <DiscountStats stats={stats} />

        {/* Discounts List */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-brown-800 mb-6">
            All Discounts ({discounts.length})
          </h2>
          <DiscountList
            discounts={discounts}
            onEdit={setEditingDiscount}
            onDelete={setDeletingDiscount}
            onToggleActive={handleToggleActive}
            onSendNotification={handleSendNotification}
            loading={loading}
          />
        </div>

        {/* Modals */}
        {showForm && (
          <DiscountForm
            onSave={handleCreateDiscount}
            onCancel={() => setShowForm(false)}
            loading={actionLoading}
          />
        )}

        {editingDiscount && (
          <DiscountForm
            discount={editingDiscount}
            onSave={handleUpdateDiscount}
            onCancel={() => setEditingDiscount(null)}
            loading={actionLoading}
          />
        )}

        {deletingDiscount && (
          <DeleteConfirmation
            discount={deletingDiscount}
            onConfirm={handleDeleteDiscount}
            onCancel={() => setDeletingDiscount(null)}
            loading={actionLoading}
          />
        )}
      </div>
    </div>
  );
};

export default DiscountManagement;
