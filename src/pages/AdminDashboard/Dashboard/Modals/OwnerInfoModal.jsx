import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaTimes,
  FaUpload,
  FaUser,
  FaQuoteLeft,
  FaCalendarAlt,
  FaSave,
  FaUndo,
  FaCamera,
  FaCertificate,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { aboutService } from "../../../../services/AboutPageApi/about";
import { toast } from "react-toastify";

const OwnerInfoModal = ({ isOpen, onClose, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({
    owner_name: "",
    owner_message: "",
    founding_date: "",
    show_owner_image: true,
    owner_image: null,
    certificate_image: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [ownerImagePreview, setOwnerImagePreview] = useState("");
  const [certificateImagePreview, setCertificateImagePreview] = useState("");
  const [characterCount, setCharacterCount] = useState(0);

  // Initialize form with initialData when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        owner_name: initialData.owner_name || "",
        owner_message: initialData.owner_message || "",
        founding_date: initialData.founding_date
          ? initialData.founding_date.split("T")[0]
          : "",
        show_owner_image: initialData.show_owner_image ?? true,
        owner_image: null,
        certificate_image: null,
      });
      setOwnerImagePreview(initialData.owner_image_url || "");
      setCertificateImagePreview(initialData.certificate_image_url || "");
      setCharacterCount(initialData.owner_message?.length || 0);
    }
  }, [initialData, isOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Update character count for owner_message
    if (name === "owner_message") {
      setCharacterCount(value.length);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Image size should be less than 5MB",
        }));
        return;
      }

      // Set the file in formData
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      if (fieldName === "owner_image") {
        setOwnerImagePreview(previewUrl);
      } else if (fieldName === "certificate_image") {
        setCertificateImagePreview(previewUrl);
      }

      // Clear image error
      if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      }
    }
  };

  // Remove selected image
  const removeImage = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));

    if (fieldName === "owner_image") {
      setOwnerImagePreview(initialData?.owner_image_url || "");
    } else if (fieldName === "certificate_image") {
      setCertificateImagePreview(initialData?.certificate_image_url || "");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.owner_name.trim()) {
      newErrors.owner_name = "Owner name is required";
    }

    if (!formData.founding_date) {
      newErrors.founding_date = "Founding date is required";
    }

    if (formData.owner_message && formData.owner_message.length > 500) {
      newErrors.owner_message = "Message should not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form to initial values
  const resetForm = () => {
    if (initialData) {
      setFormData({
        owner_name: initialData.owner_name || "",
        owner_message: initialData.owner_message || "",
        founding_date: initialData.founding_date
          ? initialData.founding_date.split("T")[0]
          : "",
        show_owner_image: initialData.show_owner_image ?? true,
        owner_image: null,
        certificate_image: null,
      });
      setOwnerImagePreview(initialData.owner_image_url || "");
      setCertificateImagePreview(initialData.certificate_image_url || "");
      setCharacterCount(initialData.owner_message?.length || 0);
    } else {
      setFormData({
        owner_name: "",
        owner_message: "",
        founding_date: "",
        show_owner_image: true,
        owner_image: null,
        certificate_image: null,
      });
      setOwnerImagePreview("");
      setCertificateImagePreview("");
      setCharacterCount(0);
    }
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("owner_name", formData.owner_name);
      submitData.append("owner_message", formData.owner_message);
      submitData.append("founding_date", formData.founding_date);
      submitData.append("show_owner_image", formData.show_owner_image);

      if (formData.owner_image instanceof File) {
        submitData.append("owner_image", formData.owner_image);
      }

      if (formData.certificate_image instanceof File) {
        submitData.append("certificate_image", formData.certificate_image);
      }

      const response = await aboutService.updateOwnerDetail(submitData);

      toast.success("Owner information updated successfully!");
      onUpdate(response.data); // parent will handle refresh
      onClose();
    } catch (error) {
      console.error("Error updating owner details:", error);
      toast.error("Failed to update owner information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we have new image files
  const hasNewOwnerImage =
    formData.owner_image && formData.owner_image instanceof File;
  const hasNewCertificateImage =
    formData.certificate_image && formData.certificate_image instanceof File;

  // Theme configuration
  const theme = {
    primaryGradient: "linear-gradient(90deg, #F97316, #DC2626)",
    cardBorder: "#FED7AA",
    cardShadow: "0 6px 16px rgba(220, 38, 38, 0.15)",
    primaryOrange: "#F97316",
    error: "#DC2626",
    inputBorder: "#FDBA74",
    focusedInput: "#F97316",
    mutedText: "#9CA3AF",
    heading: "#7C2D12",
    bodyText: "#1E293B",
    secondaryText: "#9A3412",
    sectionAlt: "#FFEDE9",
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:shadow-[0_10px_22px_rgba(249,115,22,0.25)]"
              style={{
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: theme.cardShadow,
              }}
            >
              <div
                className="p-6 text-white"
                style={{ background: theme.primaryGradient }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center">
                      <FaUser className="mr-3" />
                      Edit Owner Information
                    </h3>
                    <p className="opacity-90 mt-1">
                      Update founder details, certificates and visibility
                      settings
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="hover:opacity-70 transition-opacity p-2 rounded-full hover:bg-white/10"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
                encType="multipart/form-data"
              >
                {/* Owner Name Field */}
                <div className="space-y-2">
                  <label
                    className="flex items-center text-sm font-semibold mb-2"
                    style={{ color: theme.heading }}
                  >
                    <FaUser
                      className="mr-2"
                      style={{ color: theme.primaryOrange }}
                    />
                    Owner Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="owner_name"
                      value={formData.owner_name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.owner_name
                          ? "border-red-300 focus:ring-red-200 bg-red-50"
                          : "border-gray-300 focus:ring-orange-200"
                      }`}
                      style={{
                        borderColor: errors.owner_name
                          ? theme.error
                          : theme.inputBorder,
                      }}
                      placeholder="Enter owner's full name"
                    />
                    <FaUser
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: theme.mutedText }}
                    />
                  </div>
                  {errors.owner_name && (
                    <p className="text-red-500 text-sm flex items-center">
                      ⚠️ {errors.owner_name}
                    </p>
                  )}
                </div>

                {/* Owner Message Field */}
                <div className="space-y-2">
                  <label
                    className="flex items-center text-sm font-semibold mb-2"
                    style={{ color: theme.heading }}
                  >
                    <FaQuoteLeft
                      className="mr-2"
                      style={{ color: theme.primaryOrange }}
                    />
                    Owner Message
                    <span
                      className="ml-auto text-xs"
                      style={{ color: theme.mutedText }}
                    >
                      {characterCount}/500
                    </span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="owner_message"
                      value={formData.owner_message}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                        errors.owner_message
                          ? "border-red-300 focus:ring-red-200 bg-red-50"
                          : "border-gray-300 focus:ring-orange-200"
                      }`}
                      style={{
                        borderColor: errors.owner_message
                          ? theme.error
                          : theme.inputBorder,
                      }}
                      placeholder="Share the owner's vision or message..."
                    />
                    <FaQuoteLeft
                      className="absolute left-3 top-3"
                      style={{ color: theme.mutedText }}
                    />
                  </div>
                  {errors.owner_message && (
                    <p className="text-red-500 text-sm flex items-center">
                      ⚠️ {errors.owner_message}
                    </p>
                  )}
                </div>

                {/* Founding Date Field */}
                <div className="space-y-2">
                  <label
                    className="flex items-center text-sm font-semibold mb-2"
                    style={{ color: theme.heading }}
                  >
                    <FaCalendarAlt
                      className="mr-2"
                      style={{ color: theme.primaryOrange }}
                    />
                    Founding Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="founding_date"
                      value={formData.founding_date}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.founding_date
                          ? "border-red-300 focus:ring-red-200 bg-red-50"
                          : "border-gray-300 focus:ring-orange-200"
                      }`}
                      style={{
                        borderColor: errors.founding_date
                          ? theme.error
                          : theme.inputBorder,
                      }}
                    />
                    <FaCalendarAlt
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: theme.mutedText }}
                    />
                  </div>
                  {errors.founding_date && (
                    <p className="text-red-500 text-sm flex items-center">
                      ⚠️ {errors.founding_date}
                    </p>
                  )}
                </div>

                {/* Show Owner Image Toggle */}
                <div className="space-y-2">
                  <label
                    className="flex items-center text-sm font-semibold mb-2"
                    style={{ color: theme.heading }}
                  >
                    {formData.show_owner_image ? (
                      <FaEye
                        className="mr-2"
                        style={{ color: theme.primaryOrange }}
                      />
                    ) : (
                      <FaEyeSlash
                        className="mr-2"
                        style={{ color: theme.mutedText }}
                      />
                    )}
                    Display Owner Image on Website
                  </label>
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="show_owner_image"
                        checked={formData.show_owner_image}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                          formData.show_owner_image
                            ? "bg-orange-500 peer-checked:bg-orange-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 bg-white border rounded-full h-5 w-5 transition-transform duration-300 ease-in-out ${
                            formData.show_owner_image
                              ? "transform translate-x-5"
                              : ""
                          }`}
                        />
                      </div>
                      <span
                        className="ml-3 text-sm font-medium"
                        style={{ color: theme.bodyText }}
                      >
                        {formData.show_owner_image ? "Visible" : "Hidden"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Owner Image Upload Field */}
                <div className="space-y-3">
                  <label
                    className="flex items-center text-sm font-semibold mb-2"
                    style={{ color: theme.heading }}
                  >
                    <FaCamera
                      className="mr-2"
                      style={{ color: theme.primaryOrange }}
                    />
                    Owner Image
                  </label>

                  <div
                    className="flex items-center space-x-6 p-4 border-2 border-dashed rounded-lg transition-colors hover:border-orange-400"
                    style={{ borderColor: theme.inputBorder }}
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden">
                        {ownerImagePreview ? (
                          <img
                            src={ownerImagePreview}
                            alt="Owner"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: theme.sectionAlt }}
                          >
                            <FaUser
                              className="text-2xl"
                              style={{ color: theme.mutedText }}
                            />
                          </div>
                        )}
                        <div
                          className="w-full h-full hidden items-center justify-center"
                          style={{ background: theme.sectionAlt }}
                        >
                          <FaUser
                            className="text-2xl"
                            style={{ color: theme.mutedText }}
                          />
                        </div>
                      </div>
                      {ownerImagePreview && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div
                            className="p-3 rounded-full text-white"
                            style={{ background: theme.primaryGradient }}
                          >
                            <FaUpload />
                          </div>
                          <div>
                            <span
                              className="font-medium hover:text-orange-600 transition-colors"
                              style={{ color: theme.bodyText }}
                            >
                              {hasNewOwnerImage
                                ? "Change Image"
                                : "Upload Image"}
                            </span>
                            <p
                              className="text-xs mt-1"
                              style={{ color: theme.mutedText }}
                            >
                              PNG, JPG, JPEG up to 5MB
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "owner_image")}
                        />
                      </label>

                      {ownerImagePreview && (
                        <div className="flex items-center space-x-2 text-xs">
                          <span style={{ color: theme.secondaryText }}>
                            {hasNewOwnerImage
                              ? "New image selected"
                              : "Existing image"}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImage("owner_image")}
                            className="px-2 py-1 rounded text-white hover:opacity-80 transition-opacity"
                            style={{
                              background: theme.error,
                              fontSize: "10px",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {errors.owner_image && (
                    <p className="text-red-500 text-sm flex items-center">
                      ⚠️ {errors.owner_image}
                    </p>
                  )}
                </div>

                {/* Certificate Image Upload Field */}
                <div className="space-y-3">
                  <label
                    className="flex items-center text-sm font-semibold mb-2"
                    style={{ color: theme.heading }}
                  >
                    <FaCertificate
                      className="mr-2"
                      style={{ color: theme.primaryOrange }}
                    />
                    Certificate Image
                  </label>

                  <div
                    className="flex items-center space-x-6 p-4 border-2 border-dashed rounded-lg transition-colors hover:border-orange-400"
                    style={{ borderColor: theme.inputBorder }}
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-lg border-2 border-white shadow-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        {certificateImagePreview ? (
                          <img
                            src={certificateImagePreview}
                            alt="Certificate"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: theme.sectionAlt }}
                          >
                            <FaCertificate
                              className="text-2xl"
                              style={{ color: theme.mutedText }}
                            />
                          </div>
                        )}
                        <div
                          className="w-full h-full hidden items-center justify-center"
                          style={{ background: theme.sectionAlt }}
                        >
                          <FaCertificate
                            className="text-2xl"
                            style={{ color: theme.mutedText }}
                          />
                        </div>
                      </div>
                      {certificateImagePreview && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div
                            className="p-3 rounded-full text-white"
                            style={{ background: theme.primaryGradient }}
                          >
                            <FaUpload />
                          </div>
                          <div>
                            <span
                              className="font-medium hover:text-orange-600 transition-colors"
                              style={{ color: theme.bodyText }}
                            >
                              {hasNewCertificateImage
                                ? "Change Certificate"
                                : "Upload Certificate"}
                            </span>
                            <p
                              className="text-xs mt-1"
                              style={{ color: theme.mutedText }}
                            >
                              PNG, JPG, JPEG up to 5MB
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageChange(e, "certificate_image")
                          }
                        />
                      </label>

                      {certificateImagePreview && (
                        <div className="flex items-center space-x-2 text-xs">
                          <span style={{ color: theme.secondaryText }}>
                            {hasNewCertificateImage
                              ? "New certificate selected"
                              : "Existing certificate"}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImage("certificate_image")}
                            className="px-2 py-1 rounded text-white hover:opacity-80 transition-opacity"
                            style={{
                              background: theme.error,
                              fontSize: "10px",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {errors.certificate_image && (
                    <p className="text-red-500 text-sm flex items-center">
                      ⚠️ {errors.certificate_image}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div
                  className="flex justify-between items-center pt-6 border-t"
                  style={{ borderColor: theme.cardBorder }}
                >
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
                    style={{
                      color: theme.secondaryText,
                      borderColor: theme.inputBorder,
                    }}
                  >
                    <FaUndo className="mr-2" />
                    Reset
                  </button>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="px-6 py-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
                      style={{
                        color: theme.bodyText,
                        borderColor: theme.inputBorder,
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-8 py-3 text-white rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300 hover:scale-105"
                      style={{
                        background: theme.primaryGradient,
                        boxShadow: "0 4px 12px rgba(220,38,38,0.35)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          Update Information
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OwnerInfoModal;
