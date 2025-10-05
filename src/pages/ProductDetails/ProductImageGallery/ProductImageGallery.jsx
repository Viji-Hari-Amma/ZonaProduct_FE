import React, { useState } from "react";
import ImageWithSpinner from "../../../components/Loader/ImageWithSpinner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Arrow icons

const ProductImageGallery = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(
    images?.findIndex((img) => img.is_primary) ?? 0
  );

  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative h-96 max-w-375:h-80 rounded-xl overflow-hidden border border-[#FED7AA] shadow-md group">
        <ImageWithSpinner
          src={images[selectedIndex]?.image_url}
          alt={productName}
          className="w-full h-full object-contain"
        />

        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaChevronLeft />
          </button>
        )}

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto py-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                selectedIndex === index
                  ? "border-[#F97316] shadow-md"
                  : "border-[#FED7AA]"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <ImageWithSpinner
                src={image.image_url}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-contain"
                spinnerClass="bg-white"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
