import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiImage,
  FiSave,
  FiX,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { toast } from "react-toastify";
import {
  getCarouselData,
  createCarousel,
  updateCarousel,
  deleteCarousel,
} from "../../../../services/HomePage/HomePageAPI";
import CarouselDeleteModal from "./Model/CarouselDeleteModal";

const CarouselManagement = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    button_text: "",
    button_link: "",
    order: 0,
    is_active: true,
    image: null,
  });

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  const fetchCarouselItems = async () => {
    try {
      setLoading(true);
      const response = await getCarouselData();

      // SAFELY extract carousel data from different response structures
      let itemsData = [];

      if (response && response.data !== undefined) {
        // Case 1: { status: "success", data: [], message: "" }
        itemsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        // Case 2: Direct array response
        itemsData = response;
      } else if (response && Array.isArray(response.results)) {
        // Case 3: { results: [] }
        itemsData = response.results;
      }

      setCarouselItems(itemsData);
    } catch (error) {
      toast.error("Failed to fetch carousel items");
      console.error("Error:", error);
      setCarouselItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(editingItem ? "updating" : "creating");

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === "image" && formData[key] === null) {
            // Skip image if it's null (when editing and not changing image)
            return;
          }
          submitData.append(key, formData[key]);
        }
      });

      if (editingItem) {
        await updateCarousel(editingItem.id, submitData);
        toast.success("Carousel item updated successfully!");
      } else {
        await createCarousel(submitData);
        toast.success("Carousel item created successfully!");
      }

      setShowForm(false);
      setEditingItem(null);
      setFormData({
        title: "",
        description: "",
        button_text: "",
        button_link: "",
        order: 0,
        is_active: true,
        image: null,
      });
      fetchCarouselItems();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${editingItem ? "update" : "create"} carousel item`;
      toast.error(errorMessage);
      console.error("Error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      button_text: item.button_text,
      button_link: item.button_link,
      order: item.order,
      is_active: item.is_active,
      image: null, // Don't pre-fill image for edit
    });
    setShowForm(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setActionLoading(`delete-${itemToDelete.id}`);
      await deleteCarousel(itemToDelete.id);
      toast.success("Carousel item deleted successfully!");
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchCarouselItems();
    } catch (error) {
      toast.error("Failed to delete carousel item");
      console.error("Error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      setActionLoading(`toggle-${item.id}`);
      await updateCarousel(item.id, { is_active: !item.is_active });
      toast.success(
        `Carousel item ${!item.is_active ? "activated" : "deactivated"}!`
      );
      fetchCarouselItems();
    } catch (error) {
      toast.error("Failed to update carousel item");
      console.error("Error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      button_text: "",
      button_link: "",
      order: 0,
      is_active: true,
      image: null,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#7C2D12] mb-2 flex items-center gap-3">
          <FiImage className="text-[#F97316]" />
          Carousel Management
        </h1>
        <p className="text-[#9A3412]">
          Manage homepage banner carousel items (
          {Array.isArray(carouselItems) ? carouselItems.length : 0} items)
        </p>
      </div>

      {/* Add New Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white rounded-lg hover:from-[#DC2626] hover:to-[#F97316] transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.45)]"
        >
          <FiPlus size={20} />
          Add New Carousel Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#FED7AA] animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#7C2D12]">
                {editingItem ? "Edit Carousel Item" : "Add New Carousel Item"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-[#FFEDE9] rounded-lg transition-colors duration-200"
              >
                <FiX size={20} className="text-[#7C2D12]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200"
                    min="0"
                    placeholder="Auto-assign if 0"
                  />
                  <p className="text-sm text-[#9A3412] mt-1">
                    Leave as 0 to auto-assign the next available order
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) =>
                      setFormData({ ...formData, button_text: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) =>
                      setFormData({ ...formData, button_link: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                  Image {!editingItem && "*"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200"
                  required={!editingItem}
                />
                {editingItem && (
                  <p className="text-sm text-[#9A3412] mt-1">
                    Leave empty to keep current image
                  </p>
                )}

                {/* Show current image when editing */}
                {editingItem && editingItem.image_url && (
                  <div className="mt-3">
                    <p className="text-sm text-[#7C2D12] mb-2">
                      Current Image:
                    </p>
                    <img
                      src={editingItem.image_url}
                      alt="Current carousel"
                      className="w-32 h-32 object-cover rounded-lg border border-[#FED7AA]"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-[#F97316] border-[#FDBA74] rounded focus:ring-[#F97316] focus:ring-2"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-[#7C2D12]"
                >
                  Active (visible on website)
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#FECACA]">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 px-6 py-3 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] transition-all duration-200 hover:scale-105"
                >
                  <FiX size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white rounded-lg hover:from-[#DC2626] hover:to-[#F97316] disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.45)]"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingItem ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      {editingItem ? "Update Item" : "Create Item"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Carousel Items Grid */}
      <div className="grid gap-6">
        {!carouselItems || carouselItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-[0_6px_16px_rgba(220,38,38,0.15)] border border-[#FED7AA]">
            <FiImage className="mx-auto text-4xl text-[#9CA3AF] mb-4" />
            <h3 className="text-xl font-semibold text-[#7C2D12] mb-2">
              No carousel items found
            </h3>
            <p className="text-[#9A3412]">
              Get started by adding your first carousel item
            </p>
          </div>
        ) : (
          carouselItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 shadow-[0_6px_16px_rgba(220,38,38,0.15)] border border-[#FED7AA] hover:shadow-[0_10px_22px_rgba(249,115,22,0.25)] transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="lg:w-1/3">
                  <img
                    src={item.image_url || "/placeholder-image.jpg"}
                    alt={item.title}
                    className="w-full h-48 lg:h-40 object-cover rounded-lg border border-[#FED7AA]"
                  />
                </div>

                {/* Content */}
                <div className="lg:w-2/3">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[#7C2D12] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[#9A3412] text-sm mb-2">
                        Order: {item.order} |{" "}
                        {item.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        disabled={actionLoading === `toggle-${item.id}`}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          item.is_active
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {actionLoading === `toggle-${item.id}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : item.is_active ? (
                          <FiEye size={16} />
                        ) : (
                          <FiEyeOff size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[#1E293B] mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {(item.button_text || item.button_link) && (
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-[#FFEDE9] text-[#7C2D12] rounded-full text-sm border border-[#FED7AA]">
                        Button: {item.button_text} → {item.button_link}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(59,130,246,0.35)]"
                    >
                      <FiEdit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      disabled={actionLoading === `delete-${item.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(220,38,38,0.35)]"
                    >
                      {actionLoading === `delete-${item.id}` ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FiTrash2 size={16} />
                      )}
                      {actionLoading === `delete-${item.id}`
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <CarouselDeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedItem={itemToDelete}
        actionLoading={actionLoading}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default CarouselManagement;
