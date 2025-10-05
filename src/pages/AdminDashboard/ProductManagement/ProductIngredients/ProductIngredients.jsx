import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import {
  bulkAddIngredients,
  deleteIngredient,
  listIngredients,
} from "../../../../services/productApi/productIngredientsApi/productIngredientsApi";

const ProductIngredients = ({ productId, onSectionComplete }) => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchIngredients();
  }, [productId]);

  const fetchIngredients = async () => {
    try {
      const response = await listIngredients(productId);
      setIngredients(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch ingredients");
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients((prev) => [
        ...prev,
        {
          id: Date.now(), // Temporary ID
          name: newIngredient.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveIngredients = async () => {
    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    setLoading(true);
    try {
      // FIX: Send proper format - array of objects with 'name' property
      const ingredientsData = ingredients.map((ing) => ({
        name: ing.name,
      }));


      await bulkAddIngredients(productId, ingredientsData);
      toast.success("Ingredients saved successfully");
      fetchIngredients(); // Refresh to get actual IDs
      onSectionComplete(); // Move to next section
    } catch (error) {
      console.error("Error saving ingredients:", error);
      toast.error("Failed to save ingredients");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIngredient = async (ingredientId) => {
    setDeletingId(ingredientId);
    try {
      await deleteIngredient(productId, ingredientId);
      toast.success("Ingredient deleted successfully");
      fetchIngredients();
    } catch (error) {
      toast.error("Failed to delete ingredient");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Manage Ingredients
        </h3>
        <p className="text-sm text-gray-600">
          Add and manage the ingredients for this product
        </p>
      </div>

      {/* Add New Ingredient */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6">
        <div className="md:col-span-4">
          <input
            type="text"
            placeholder="Enter ingredient name"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddIngredient()}
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {ingredients.map((ingredient, index) => (
          <div
            key={ingredient.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
          >
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => {
                const updated = [...ingredients];
                updated[index].name = e.target.value;
                setIngredients(updated);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() =>
                ingredient.id > 1000
                  ? handleRemoveIngredient(index)
                  : handleDeleteIngredient(ingredient.id)
              }
              disabled={deletingId === ingredient.id}
              className="text-red-500 hover:text-red-700 p-2 transition-colors disabled:opacity-50"
            >
              {deletingId === ingredient.id ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaTrash />
              )}
            </button>
          </div>
        ))}
      </div>

      {ingredients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No ingredients added yet. Start by adding ingredients above.
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onSectionComplete}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={handleSaveIngredients}
          disabled={loading || ingredients.length === 0}
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
              Save Ingredients & Continue
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductIngredients;
