import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiImage,
  FiSave,
  FiX,
  FiCheck,
  FiStar,
} from "react-icons/fi";
import { toast } from "react-toastify";
import {
  getLogos,
  createLogo,
  updateLogo,
  deleteLogo,
  getActiveLogo,
} from "../../../../services/HomePage/HomePageAPI";

const LogoManagement = () => {
  const [logos, setLogos] = useState([]);
  const [activeLogo, setActiveLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLogo, setEditingLogo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    is_active: false,
  });

  useEffect(() => {
    fetchLogos();
    fetchActiveLogo();
  }, []);

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const response = await getLogos();

      // SAFELY extract logos data from different response structures
      let logosData = [];

      if (response && response.data !== undefined) {
        // Case 1: { status: "success", data: [], message: "" }
        logosData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        // Case 2: Direct array response
        logosData = response;
      } else if (response && Array.isArray(response.results)) {
        // Case 3: { results: [] }
        logosData = response.results;
      }

      setLogos(logosData);
    } catch (error) {
      toast.error("Failed to fetch logos");
      console.error("Error:", error);
      setLogos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveLogo = async () => {
    try {
      const response = await getActiveLogo();

      // SAFELY extract active logo data
      let activeLogoData = null;

      if (response && response.data !== undefined) {
        activeLogoData = response.data;
      } else if (response && typeof response === "object") {
        activeLogoData = response;
      }

      setActiveLogo(activeLogoData);
    } catch (error) {
      console.error("Error fetching active logo:", error);
      setActiveLogo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(editingLogo ? "updating" : "creating");

      const submitData = new FormData();
      submitData.append("name", formData.name);
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      submitData.append("is_active", formData.is_active);

      if (editingLogo) {
        await updateLogo(editingLogo.id, submitData);
        toast.success("Logo updated successfully!");
      } else {
        await createLogo(submitData);
        toast.success("Logo created successfully!");
      }

      setShowForm(false);
      setEditingLogo(null);
      setFormData({
        name: "",
        image: null,
        is_active: false,
      });
      fetchLogos();
      fetchActiveLogo();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${editingLogo ? "update" : "create"} logo`;
      toast.error(errorMessage);
      console.error("Error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (logo) => {
    setEditingLogo(logo);
    setFormData({
      name: logo.name,
      image: null, // Don't pre-fill image for edit
      is_active: logo.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this logo?")) return;

    try {
      setActionLoading(`delete-${id}`);
      await deleteLogo(id);
      toast.success("Logo deleted successfully!");
      fetchLogos();
      fetchActiveLogo();
    } catch (error) {
      toast.error("Failed to delete logo");
      console.error("Error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetActive = async (logo) => {
    try {
      setActionLoading(`activate-${logo.id}`);
      await updateLogo(logo.id, { is_active: true });
      toast.success("Logo set as active!");
      fetchLogos();
      fetchActiveLogo();
    } catch (error) {
      toast.error("Failed to activate logo");
      console.error("Error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingLogo(null);
    setFormData({
      name: "",
      image: null,
      is_active: false,
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
          Logo Management
        </h1>
        <p className="text-[#9A3412]">
          Manage website logos ({Array.isArray(logos) ? logos.length : 0} logos)
          {activeLogo && (
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Active: {activeLogo.name}
            </span>
          )}
        </p>
      </div>

      {/* Add New Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white rounded-lg hover:from-[#DC2626] hover:to-[#F97316] transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.45)]"
        >
          <FiPlus size={20} />
          Upload New Logo
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-[#FED7AA] animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#7C2D12]">
                {editingLogo ? "Edit Logo" : "Upload New Logo"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-[#FFEDE9] rounded-lg transition-colors duration-200"
              >
                <FiX size={20} className="text-[#7C2D12]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                  Logo Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Main Logo, Dark Version, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                  Logo Image {!editingLogo && "*"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200"
                  required={!editingLogo}
                />
                {editingLogo && (
                  <p className="text-sm text-[#9A3412] mt-1">
                    Leave empty to keep current image
                  </p>
                )}
                <p className="text-sm text-[#9A3412] mt-1">
                  Recommended: PNG with transparent background
                </p>

                {/* Show current image when editing */}
                {editingLogo && editingLogo.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-[#7C2D12] mb-2">Current Logo:</p>
                    <img
                      src={editingLogo.image_url}
                      alt="Current logo"
                      className="w-32 h-32 object-contain border border-[#FED7AA] rounded-lg"
                    />
                  </div>
                )}
              </div>

              {!editingLogo && (
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
                    Set as active logo immediately
                  </label>
                </div>
              )}

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
                      {editingLogo ? "Updating..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      {editingLogo ? "Update Logo" : "Upload Logo"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logos Grid */}
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] place-items-stretch">
        {!logos || !Array.isArray(logos) || logos.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center shadow-[0_6px_16px_rgba(220,38,38,0.15)] border border-[#FED7AA]">
            <FiImage className="mx-auto text-4xl text-[#9CA3AF] mb-4" />
            <h3 className="text-xl font-semibold text-[#7C2D12] mb-2">
              No logos found
            </h3>
            <p className="text-[#9A3412]">
              Upload your first logo to get started
            </p>
          </div>
        ) : (
          logos.map((logo) => (
            <div
              key={logo.id}
              className={`rounded-xl p-6 shadow-[0_6px_16px_rgba(220,38,38,0.15)] border transition-all duration-300 hover:shadow-[0_10px_22px_rgba(249,115,22,0.25)] hover:translate-y-[-4px] ${
                logo.is_active
                  ? "border-[#16A34A] ring-2 ring-[#16A34A] ring-opacity-20"
                  : "border-[#FED7AA]"
              }`}
            >
              {/* Logo Image */}
              <div className="mb-4 bg-[#FFEDE9] p-4 rounded-lg border border-[#FED7AA]">
                <img
                  src={logo.image_url || "/placeholder-logo.jpg"}
                  alt={logo.name}
                  className="w-full h-32 object-contain"
                />
              </div>

              {/* Logo Info */}
              <div className="text-center mb-4">
                <h3 className="font-semibold text-[#7C2D12] mb-1">
                  {logo.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      logo.is_active
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {logo.is_active ? (
                      <>
                        <FiStar size={12} className="fill-current" />
                        Active Logo
                      </>
                    ) : (
                      "Inactive"
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full items-center justify-center">
                {!logo.is_active && (
                  <button
                    onClick={() => handleSetActive(logo)}
                    disabled={actionLoading === `activate-${logo.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(34,197,94,0.35)]"
                  >
                    {actionLoading === `activate-${logo.id}` ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FiCheck size={16} />
                    )}
                    <span className="hidden sm:inline">
                      {actionLoading === `activate-${logo.id}`
                        ? "Activating..."
                        : "Set Active"}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => handleEdit(logo)}
                  disabled={actionLoading}
                  className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(59,130,246,0.35)]"
                >
                  <FiEdit size={16} />
                </button>

                <button
                  onClick={() => handleDelete(logo.id)}
                  disabled={actionLoading === `delete-${logo.id}`}
                  className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(220,38,38,0.35)]"
                >
                  {actionLoading === `delete-${logo.id}` ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FiTrash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogoManagement;
