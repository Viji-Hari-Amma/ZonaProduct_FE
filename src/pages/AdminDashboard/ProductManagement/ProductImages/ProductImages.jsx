import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaStar, FaImage, FaUpload } from "react-icons/fa";
import {
  deleteProductImage,
  getProductImages,
  setPrimaryImage,
  uploadProductImage,
} from "../../../../services/productApi/productImagesApi/productImagesApi";

const ProductImages = ({ productId, onSectionComplete }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, [productId]);

  const fetchImages = async () => {
    try {
      const response = await getProductImages(productId);
      setImages(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch images");
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("image", file);
        await uploadProductImage(productId, formData);
      }
      toast.success("Images uploaded successfully");
      setSelectedFiles([]);
      fetchImages();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload images");
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    setDeletingId(imageId);
    try {
      await deleteProductImage(productId, imageId);
      toast.success("Image deleted successfully");
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrimary = async (imageId) => {
    setSettingPrimaryId(imageId);
    try {
      await setPrimaryImage(productId, imageId);
      toast.success("Primary image updated successfully");
      fetchImages();
    } catch (error) {
      toast.error("Failed to set primary image");
    } finally {
      setSettingPrimaryId(null);
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Manage Product Images
        </h3>
        <p className="text-sm text-gray-600">
          Upload and manage product images. Set one as primary.
        </p>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-orange-200 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <FaImage className="mx-auto text-4xl text-orange-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {selectedFiles.length > 0
            ? `${selectedFiles.length} files selected`
            : "Select images to upload"}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Click to browse or drag and drop
        </p>

        <button
          type="button"
          onClick={handleChooseFiles}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center mx-auto"
        >
          <FaPlus className="mr-2" />
          Choose Files
        </button>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Selected files: {selectedFiles.map((f) => f.name).join(", ")}
            </p>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              <FaUpload className="mr-2" />
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} Image(s)`}
            </button>
          </div>
        )}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative bg-white border border-orange-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={image.image_url}
              alt="Product"
              className="w-full h-48 object-cover"
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex space-x-2">
                {!image.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    disabled={settingPrimaryId === image.id}
                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    title="Set as primary"
                  >
                    {settingPrimaryId === image.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaStar />
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={deletingId === image.id}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                  title="Delete image"
                >
                  {deletingId === image.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            </div>

            {/* Status Badge */}
            {image.is_primary && (
              <div className="absolute top-2 left-2">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <FaStar className="mr-1" />
                  Primary
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
          <p>No images uploaded yet</p>
          <p className="text-sm">Upload images using the section above</p>
        </div>
      )}

      {/* Next Section Button */}
      {images.length > 0 && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onSectionComplete}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
          >
            Continue to Ingredients
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
