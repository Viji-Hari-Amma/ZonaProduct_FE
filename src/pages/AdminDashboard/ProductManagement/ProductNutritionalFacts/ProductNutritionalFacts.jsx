import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import {
  bulkAddNutritionalFacts,
  deleteNutritionalFact,
  listNutritionalFacts,
} from "../../../../services/productApi/productNutritionalFactsApi/productNutritionalFactsApi";

const ProductNutritionalFacts = ({ productId, onSectionComplete }) => {
  const [nutritionalFacts, setNutritionalFacts] = useState([]);
  const [newFact, setNewFact] = useState({
    component: "",
    value: "",
    unit: "",
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const commonComponents = [
    "Energy",
    "Protein",
    "Fat",
    "Carbohydrates",
    "Fiber",
    "Sugar",
    "Calcium",
    "Iron",
    "Sodium",
    "Cholesterol",
    "Vitamin A",
    "Vitamin C",
  ];

  const commonUnits = ["g", "mg", "kcal", "kJ", "%", "IU"];

  useEffect(() => {
    fetchNutritionalFacts();
  }, [productId]);

  const fetchNutritionalFacts = async () => {
    try {
      const response = await listNutritionalFacts(productId);
      setNutritionalFacts(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch nutritional facts");
    }
  };

  const handleAddFact = () => {
    if (
      newFact.component.trim() &&
      newFact.value.trim() &&
      newFact.unit.trim()
    ) {
      setNutritionalFacts((prev) => [
        ...prev,
        {
          id: Date.now(), // Temporary ID
          component: newFact.component.trim(),
          value: newFact.value.trim(),
          unit: newFact.unit.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      setNewFact({ component: "", value: "", unit: "" });
    }
  };

  const handleRemoveFact = (index) => {
    setNutritionalFacts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveFacts = async () => {
    if (nutritionalFacts.length === 0) {
      toast.error("Please add at least one nutritional fact");
      return;
    }

    setLoading(true);
    try {
      const factsData = nutritionalFacts.map((fact) => ({
        component: fact.component,
        value: fact.value,
        unit: fact.unit,
      }));


      await bulkAddNutritionalFacts(productId, {
        nutritional_facts: factsData,
      });
      toast.success("Nutritional facts saved successfully");
      fetchNutritionalFacts(); // Refresh to get actual IDs
      onSectionComplete(); // ADDED: Move to next section
    } catch (error) {
      toast.error("Failed to save nutritional facts");
      console.error("Error saving nutritional facts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFact = async (factId) => {
    setDeletingId(factId);
    try {
      await deleteNutritionalFact(productId, factId);
      toast.success("Nutritional fact deleted successfully");
      fetchNutritionalFacts();
    } catch (error) {
      toast.error("Failed to delete nutritional fact");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Manage Nutritional Facts
        </h3>
        <p className="text-sm text-gray-600">
          Add and manage nutritional information per 100g
        </p>
      </div>

      {/* Add New Nutritional Fact */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-6">
        <div className="md:col-span-3">
          <select
            value={newFact.component}
            onChange={(e) =>
              setNewFact((prev) => ({ ...prev, component: e.target.value }))
            }
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select Component</option>
            {commonComponents.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Value"
            value={newFact.value}
            onChange={(e) =>
              setNewFact((prev) => ({ ...prev, value: e.target.value }))
            }
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-1">
          <select
            value={newFact.unit}
            onChange={(e) =>
              setNewFact((prev) => ({ ...prev, unit: e.target.value }))
            }
            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Unit</option>
            {commonUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="button"
            onClick={handleAddFact}
            className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Nutritional Facts List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {nutritionalFacts.map((fact, index) => (
          <div
            key={fact.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
          >
            <select
              value={fact.component}
              onChange={(e) => {
                const updated = [...nutritionalFacts];
                updated[index].component = e.target.value;
                setNutritionalFacts(updated);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
            >
              {commonComponents.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={fact.value}
              onChange={(e) => {
                const updated = [...nutritionalFacts];
                updated[index].value = e.target.value;
                setNutritionalFacts(updated);
              }}
              className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
            />
            <select
              value={fact.unit}
              onChange={(e) => {
                const updated = [...nutritionalFacts];
                updated[index].unit = e.target.value;
                setNutritionalFacts(updated);
              }}
              className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
            >
              {commonUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                fact.id > 1000
                  ? handleRemoveFact(index)
                  : handleDeleteFact(fact.id)
              }
              disabled={deletingId === fact.id}
              className="text-red-500 hover:text-red-700 p-2 transition-colors disabled:opacity-50"
            >
              {deletingId === fact.id ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaTrash />
              )}
            </button>
          </div>
        ))}
      </div>

      {nutritionalFacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No nutritional facts added yet. Start by adding facts above.
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
          onClick={handleSaveFacts}
          disabled={loading || nutritionalFacts.length === 0}
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
              Save Facts & Continue
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductNutritionalFacts;
