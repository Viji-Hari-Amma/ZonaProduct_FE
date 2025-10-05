import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaCheck,
  FaTimes,
  FaUpload,
  FaImage,
} from "react-icons/fa";
import {
  getUPISettings,
  uploadUpi,
  updateUpi,
  deleteUpi,
} from "../../../../services/paymentApi/paymentApi";
import DeleteConfirmationModal from "../Model/DeleteConfirmationModal";

const UPISettingsManager = () => {
  const [upiSettings, setUpiSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUpi, setEditingUpi] = useState(null);
  const [formData, setFormData] = useState({
    upi_id: "",
    qr_image: null,
    is_active: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchUPISettings = async () => {
    setLoading(true);
    try {
      const response = await getUPISettings();
      setUpiSettings(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch UPI settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUPISettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.upi_id) {
      toast.error("Please enter UPI ID");
      return;
    }

    setActionLoading("save");
    try {
      if (editingUpi) {
        await updateUpi(editingUpi.id, formData);
        toast.success("UPI setting updated successfully");
      } else {
        await uploadUpi(formData.upi_id, formData.qr_image, formData.is_active);
        toast.success("UPI setting created successfully");
      }
      setShowForm(false);
      setEditingUpi(null);
      setFormData({ upi_id: "", qr_image: null, is_active: false });
      setImagePreview(null);
      fetchUPISettings();
    } catch (error) {
      toast.error(`Failed to ${editingUpi ? "update" : "create"} UPI setting`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (upi) => {
    setEditingUpi(upi);
    setFormData({
      upi_id: upi.upi_id,
      qr_image: null,
      is_active: upi.is_active,
    });
    setImagePreview(upi.qr_image_url);
    setShowForm(true);
  };

  const handleDelete = async (upiId) => {
    setActionLoading(`delete-${upiId}`);
    try {
      await deleteUpi(upiId);
      toast.success("UPI setting deleted successfully");
      setDeleteConfirm(null);
      fetchUPISettings();
    } catch (error) {
      toast.error("Failed to delete UPI setting");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetActive = async (upiId) => {
    setActionLoading(`activate-${upiId}`);
    try {
      // Deactivate all others first
      for (const upi of upiSettings) {
        if (upi.is_active) {
          await updateUpi(upi.id, { ...upi, is_active: false });
        }
      }
      // Activate selected one
      const upiToActivate = upiSettings.find((u) => u.id === upiId);
      await updateUpi(upiId, { ...upiToActivate, is_active: true });
      toast.success("UPI setting activated successfully");
      fetchUPISettings();
    } catch (error) {
      toast.error("Failed to activate UPI setting");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, qr_image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUpi(null);
    setFormData({ upi_id: "", qr_image: null, is_active: false });
    setImagePreview(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">UPI Settings</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        >
          <FaPlus className="mr-2" />
          Add UPI
        </button>
      </div>

      {/* UPI Settings Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] mt-5">
          {upiSettings.map((upi) => (
            <div
              key={upi.id}
              className={`bg-white border-2 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                upi.is_active
                  ? "border-orange-500 ring-4 ring-orange-200"
                  : "border-orange-200 hover:border-orange-300"
              }`}
            >
              {/* QR Code */}
              <div className="mb-4 flex justify-center">
                {upi.qr_image_url ? (
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => setPreviewImage(upi.qr_image_url)}
                  >
                    <img
                      src={upi.qr_image_url}
                      alt="QR Code"
                      className="h-40 w-40 object-contain border-2 border-orange-200 rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                        Click to view
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 w-40 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center">
                    <FaImage className="text-4xl text-orange-400 mb-2" />
                    <span className="text-orange-600 text-sm text-center">
                      No QR Code
                    </span>
                  </div>
                )}
              </div>

              {/* UPI Info */}
              <div className="space-y-3 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    UPI ID
                  </p>
                  <p className="font-mono font-bold text-gray-800 text-lg bg-orange-50 py-2 px-3 rounded-lg border border-orange-200">
                    {upi.upi_id}
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2">
                  {upi.is_active ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                      <FaCheck className="mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
                      <FaTimes className="mr-1" />
                      Inactive
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Created:{" "}
                  {new Date(upi.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-center space-x-2">
                {!upi.is_active && (
                  <button
                    onClick={() => handleSetActive(upi.id)}
                    disabled={actionLoading === `activate-${upi.id}`}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {actionLoading === `activate-${upi.id}` ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <FaStar className="mr-2" />
                    )}
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => handleEdit(upi)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(upi)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {upiSettings.length === 0 && !loading && (
        <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-dashed border-orange-300">
          <FaImage className="mx-auto text-6xl text-orange-400 mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            No UPI Settings
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Add your first UPI setting to start accepting online payments
            through UPI
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center mx-auto"
          >
            <FaPlus className="mr-3 text-lg" />
            Add Your First UPI
          </button>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8">
              <h3 className="text-2xl font-bold">
                {editingUpi ? "Edit UPI Setting" : "Add New UPI Setting"}
              </h3>
              <p className="text-orange-100 mt-2">
                {editingUpi
                  ? "Update your UPI details"
                  : "Add new UPI for accepting payments"}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto"
            >
              {/* UPI ID */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  UPI ID *
                </label>
                <input
                  type="text"
                  value={formData.upi_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, upi_id: e.target.value }))
                  }
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 text-lg border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter your UPI ID in the format: name@bankname
                </p>
              </div>

              {/* QR Code Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  QR Code Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 flex justify-center">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="QR Preview"
                        className="h-48 w-48 object-contain border-4 border-orange-200 rounded-2xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, qr_image: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div className="border-3 border-dashed border-orange-300 rounded-2xl p-8 text-center bg-gradient-to-br from-orange-50 to-red-50 transition-all duration-300 hover:border-orange-400 hover:shadow-lg">
                  <input
                    id="qr-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="qr-upload" className="cursor-pointer block">
                    <FaUpload className="mx-auto text-5xl text-orange-400 mb-4" />
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                      {imagePreview ? "Change QR Code" : "Upload QR Code"}
                    </p>
                    <p className="text-gray-600 mb-4">
                      Click to browse or drag and drop your QR code image
                    </p>
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center">
                      <FaImage className="mr-3" />
                      Choose Image
                    </div>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Recommended: Square PNG image with white background, minimum
                  300x300 pixels
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 text-orange-500 bg-white border-orange-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label
                  htmlFor="is_active"
                  className="ml-3 text-lg font-medium text-gray-800"
                >
                  Set as active UPI for payments
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-orange-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "save"}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-2xl flex items-center"
                >
                  {actionLoading === "save" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      {editingUpi ? "Updating..." : "Creating..."}
                    </>
                  ) : editingUpi ? (
                    "Update UPI"
                  ) : (
                    "Create UPI"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm?.id)}
        title="Delete UPI Setting"
        message={`Are you sure you want to delete the UPI setting "${deleteConfirm?.upi_id}"? This action cannot be undone.`}
        loading={actionLoading === `delete-${deleteConfirm?.id}`}
      />
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 cursor-pointer"
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] object-contain rounded-xl shadow-2xl border-4 border-white"
          />
        </div>
      )}
    </div>
  );
};

export default UPISettingsManager;
