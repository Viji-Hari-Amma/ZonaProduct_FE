import React from 'react';
import { FaTimes, FaEdit, FaStar, FaBox } from 'react-icons/fa';

const ProductDetailModal = ({ product, onClose, onEdit }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Product Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[70vh] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Product Images */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {product.images && product.images.length > 0 ? (
                    product.images.map((image, index) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.image_url}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        {image.is_primary && (
                          <span className="absolute top-1 left-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                            Primary
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      <FaBox className="mx-auto text-4xl mb-2" />
                      No images available
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flavour:</span>
                    <span className="font-medium">{product.flavour || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Featured:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.is_featured 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.is_featured ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Stock Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock Count:</span>
                    <span className={`font-medium ${
                      product.stock_count === 0 
                        ? 'text-red-600' 
                        : product.stock_count < 10 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    }`}>
                      {product.stock_count}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.availability_status 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.availability_status ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Details */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {product.description || 'No description available'}
                </p>
              </div>

              {/* Sizes and Pricing */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Sizes & Pricing</h3>
                  <div className="space-y-2">
                    {product.sizes.map((size) => (
                      <div key={size.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{size.label}{size.unit ? ` ${size.unit}` : ''}</span>
                          {size.weight_grams > 0 && (
                            <span className="text-sm text-gray-500 ml-2">
                              ({size.weight_grams}g)
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-orange-600">₹{size.price}</div>
                          {size.delivery_charge > 0 && (
                            <div className="text-sm text-gray-500">
                              Delivery: ₹{size.delivery_charge}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient) => (
                      <span
                        key={ingredient.id}
                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                      >
                        {ingredient.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Reviews Summary</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-orange-600">
                    {product.average_rating || 0}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <FaStar className="text-yellow-400 mr-1" />
                      <FaStar className="text-yellow-400 mr-1" />
                      <FaStar className="text-yellow-400 mr-1" />
                      <FaStar className="text-yellow-400" />
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.reviews_count || 0} reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center"
            >
              <FaEdit className="mr-2" />
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;