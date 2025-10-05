import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import {
  bulkAddSizes,
  deleteSize,
  getProductSizes,
} from "../../../../services/productApi/productSize/productSize";

const ProductSizes = ({ productId, onSectionComplete }) => {
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState({
    label: "",
    unit: "g",
    price: "",
    weight_grams: "",
    delivery_charge: "",
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const commonUnits = ["g", "kg", "ml", "L", "piece"];

  useEffect(() => {
    fetchSizes();
  }, [productId]);

  const fetchSizes = async () => {
    try {
      const response = await getProductSizes(productId);
      setSizes(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch sizes");
    }
  };

  const handleAddSize = () => {
    if (
      newSize.label.trim() &&
      newSize.price &&
      newSize.weight_grams &&
      newSize.delivery_charge
    ) {
      setSizes((prev) => [
        ...prev,
        {
          id: Date.now(), // Temporary ID
          label: newSize.label.trim(),
          unit: newSize.unit,
          price: parseFloat(newSize.price),
          weight_grams: parseInt(newSize.weight_grams),
          delivery_charge: parseFloat(newSize.delivery_charge),
          discounted_price: "0.00",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      setNewSize({
        label: "",
        unit: "g",
        price: "",
        weight_grams: "",
        delivery_charge: "",
      });
    }
  };

  const handleRemoveSize = (index) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSizes = async () => {
    if (sizes.length === 0) {
      toast.error("Please add at least one size");
      return;
    }

    setLoading(true);
    try {
      const sizesData = sizes.map((size) => ({
        label: size.label,
        unit: size.unit,
        price: size.price,
        weight_grams: size.weight_grams,
        delivery_charge: size.delivery_charge,
      }));

      await bulkAddSizes(productId, sizesData);
      toast.success("Sizes saved successfully");
      fetchSizes(); // Refresh to get actual IDs
      onSectionComplete(); // This will close the popup and complete the process
    } catch (error) {
      toast.error("Failed to save sizes");
      console.error("Error saving sizes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSize = async (sizeId) => {
    setDeletingId(sizeId);
    try {
      await deleteSize(productId, sizeId);
      toast.success("Size deleted successfully");
      fetchSizes();
    } catch (error) {
      toast.error("Failed to delete size");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Manage Product Sizes
        </h3>
        <p className="text-sm text-gray-600">
          Add different sizes, pricing, and delivery charges for this product
        </p>
      </div>

      {/* Add New Size */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-6">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Size (e.g., 100, 250, 1)"
            value={newSize.label}
            onChange={(e) =>
              setNewSize((prev) => ({ ...prev, label: e.target.value }))
            }
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <select
            value={newSize.unit}
            onChange={(e) =>
              setNewSize((prev) => ({ ...prev, unit: e.target.value }))
            }
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {commonUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <input
            type="number"
            placeholder="Price"
            value={newSize.price}
            onChange={(e) =>
              setNewSize((prev) => ({ ...prev, price: e.target.value }))
            }
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-3">
          <input
            type="number"
            placeholder="Weight (grams)"
            value={newSize.weight_grams}
            onChange={(e) =>
              setNewSize((prev) => ({ ...prev, weight_grams: e.target.value }))
            }
            min="0"
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <input
            type="number"
            placeholder="Delivery Charge"
            value={newSize.delivery_charge}
            onChange={(e) =>
              setNewSize((prev) => ({
                ...prev,
                delivery_charge: e.target.value,
              }))
            }
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-1">
          <button
            type="button"
            onClick={handleAddSize}
            className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Sizes List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {sizes.map((size, index) => (
          <div
            key={size.id}
            className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg border"
          >
            <div className="col-span-2">
              <input
                type="text"
                value={size.label}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[index].label = e.target.value;
                  setSizes(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-2">
              <select
                value={size.unit}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[index].unit = e.target.value;
                  setSizes(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              >
                {commonUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={size.price}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[index].price = e.target.value;
                  setSizes(updated);
                }}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-3">
              <input
                type="number"
                value={size.weight_grams}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[index].weight_grams = e.target.value;
                  setSizes(updated);
                }}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={size.delivery_charge}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[index].delivery_charge = e.target.value;
                  setSizes(updated);
                }}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-1">
              <button
                type="button"
                onClick={() =>
                  size.id > 1000
                    ? handleRemoveSize(index)
                    : handleDeleteSize(size.id)
                }
                disabled={deletingId === size.id}
                className="text-red-500 hover:text-red-700 p-2 transition-colors disabled:opacity-50 w-full"
              >
                {deletingId === size.id ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  <FaTrash />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {sizes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No sizes added yet. Start by adding sizes above.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end w-full pt-4 border-t border-gray-200">
        <button
          onClick={handleSaveSizes}
          disabled={loading || sizes.length === 0}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              Save Sizes & Complete
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductSizes;
