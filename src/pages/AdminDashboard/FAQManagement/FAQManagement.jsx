// components/admin/faq/FAQManagement.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FAQ_API from "../../../services/FAQ_Api/FAQ_Api";
import FAQStats from "./Stats/FAQStats";
import FAQFilters from "./Filters/FAQFilters";
import FAQBulkActions from "./BulkActions/FAQBulkActions";
import FAQTable from "./Tables/FAQTable";
import FAQForm from "./Forms/FAQForm";

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaqs, setSelectedFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [stats, setStats] = useState([]);
  const [filters, setFilters] = useState({
    faq_type: "",
    product_id: "",
    is_active: "",
    search: "",
  });

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.faq_type) params.faq_type = filters.faq_type;
      if (filters.product_id) params.product_id = filters.product_id;
      if (filters.is_active !== "") params.is_active = filters.is_active;
      if (filters.search) params.search = filters.search;

      const response = await FAQ_API.list(params);
      const statsResponse = await FAQ_API.list();
      setStats(statsResponse.data);
      setFaqs(response.data.results || response.data);
    } catch (error) {
      toast.error("Failed to fetch FAQs");
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [filters]);

  // Create FAQ
  const handleCreateFaq = async (faqData) => {
    try {
      await FAQ_API.create(faqData);
      toast.success("FAQ created successfully!");
      setShowForm(false);
      fetchFaqs();
    } catch (error) {
      toast.error("Failed to create FAQ");
      throw error;
    }
  };

  // Update FAQ
  const handleUpdateFaq = async (faqData) => {
    try {
      await FAQ_API.update(editingFaq.id, faqData);
      toast.success("FAQ updated successfully!");
      setShowForm(false);
      setEditingFaq(null);
      fetchFaqs();
    } catch (error) {
      toast.error("Failed to update FAQ");
      throw error;
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (faqId) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await FAQ_API.delete(faqId);
      toast.success("FAQ deleted successfully!");
      fetchFaqs();
    } catch (error) {
      toast.error("Failed to delete FAQ");
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedFaqs.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedFaqs.length} FAQ(s)?`
      )
    )
      return;

    try {
      await FAQ_API.bulkDelete(selectedFaqs);
      toast.success(`${selectedFaqs.length} FAQ(s) deleted successfully!`);
      setSelectedFaqs([]);
      fetchFaqs();
    } catch (error) {
      toast.error("Failed to delete FAQs");
    }
  };

  // Reorder FAQ
  const handleReorder = async (faqId, newOrder) => {
    try {
      await FAQ_API.reorder(faqId, { new_order: newOrder });
      toast.success("FAQ reordered successfully!");
      fetchFaqs();
    } catch (error) {
      toast.error("Failed to reorder FAQ");
    }
  };

  // Toggle FAQ status
  const handleToggleStatus = async (faqId, currentStatus) => {
    try {
      await FAQ_API.patch(faqId, { is_active: !currentStatus });
      toast.success(`FAQ ${!currentStatus ? "activated" : "deactivated"}!`);
      fetchFaqs();
    } catch (error) {
      toast.error("Failed to update FAQ status");
    }
  };

  // Edit FAQ
  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setShowForm(true);
  };

  // Add new FAQ
  const handleAddNew = () => {
    setEditingFaq(null);
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFaq(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#7C2D12] mb-2">
            FAQ Management
          </h1>
          <p className="text-[#9A3412]">
            Manage frequently asked questions and their ordering
          </p>
        </div>

        {/* Stats */}
        <FAQStats faqs={stats} />

        {/* Filters */}
        <FAQFilters
          filters={filters}
          setFilters={setFilters}
          onRefresh={fetchFaqs}
        />

        {/* Bulk Actions */}
        <FAQBulkActions
          selectedCount={selectedFaqs.length}
          onBulkDelete={handleBulkDelete}
          onAddNew={handleAddNew}
        />

        {/* FAQ Table */}
        <FAQTable
          faqs={faqs}
          loading={loading}
          selectedFaqs={selectedFaqs}
          onSelectFaqs={setSelectedFaqs}
          onEdit={handleEdit}
          onDelete={handleDeleteFaq}
          onReorder={handleReorder}
          onToggleStatus={handleToggleStatus}
          onRefresh={fetchFaqs}
        />

        {/* FAQ Form Modal */}
        {showForm && (
          <FAQForm
            faq={editingFaq}
            onSubmit={editingFaq ? handleUpdateFaq : handleCreateFaq}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
};

export default FAQManagement;
