import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { aboutService } from "../../../../services/AboutPageApi/about";

const CompanyStatsModal = ({ isOpen, onClose, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({
    team_size: 0,
    clients_count: 0,
    offices_count: 0,
    milestones: [],
  });
  const [newMilestone, setNewMilestone] = useState({ year: "", event: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("count") || name.includes("size")
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = formData.milestones.map((milestone, i) =>
      i === index
        ? {
            ...milestone,
            [field]: field === "year" ? parseInt(value) || "" : value,
          }
        : milestone
    );
    setFormData((prev) => ({ ...prev, milestones: updatedMilestones }));
  };

  const addMilestone = () => {
    if (newMilestone.year && newMilestone.event) {
      setFormData((prev) => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone],
      }));
      setNewMilestone({ year: "", event: "" });
    } else {
      toast.warning("Please fill both year and event for the milestone");
    }
  };

  const removeMilestone = (index) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate milestones
      const validMilestones = formData.milestones.filter(
        (m) => m.year && m.event
      );

      const submitData = {
        ...formData,
        milestones: validMilestones,
      };

      const response = await aboutService.updateCompanyStatus(submitData);
      onUpdate(response.data.data);
      toast.success("Company statistics updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update company statistics");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        {/* Background Overlay */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        {/* Centered Modal */}
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
            <Dialog.Panel className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl transition-all">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-heading">
                  Edit Company Statistics
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">
                      Team Size
                    </label>
                    <input
                      type="number"
                      name="team_size"
                      value={formData.team_size}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focused-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">
                      Clients Count
                    </label>
                    <input
                      type="number"
                      name="clients_count"
                      value={formData.clients_count}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focused-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">
                      Offices Count
                    </label>
                    <input
                      type="number"
                      name="offices_count"
                      value={formData.offices_count}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focused-input"
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <label className="block text-sm font-medium text-secondary-text mb-3">
                    Milestones
                  </label>

                  {/* Add New Milestone */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        placeholder="Year (e.g., 2020)"
                        value={newMilestone.year}
                        onChange={(e) =>
                          setNewMilestone((prev) => ({
                            ...prev,
                            year: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focused-input"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Event description"
                        value={newMilestone.event}
                        onChange={(e) =>
                          setNewMilestone((prev) => ({
                            ...prev,
                            event: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focused-input"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  {/* Existing Milestones */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                      >
                        <input
                          type="number"
                          value={milestone.year}
                          onChange={(e) =>
                            handleMilestoneChange(index, "year", e.target.value)
                          }
                          className="w-20 px-2 py-1 border border-input-border rounded focus:outline-none focus:ring-1 focus:ring-focused-input"
                        />
                        <input
                          type="text"
                          value={milestone.event}
                          onChange={(e) =>
                            handleMilestoneChange(
                              index,
                              "event",
                              e.target.value
                            )
                          }
                          className="flex-1 px-2 py-1 border border-input-border rounded focus:outline-none focus:ring-1 focus:ring-focused-input"
                        />
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}

                    {formData.milestones.length === 0 && (
                      <p className="text-center text-muted-text py-4">
                        No milestones added yet
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-divider">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-secondary-text border border-input-border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary-gradient text-white rounded-lg shadow-button hover:shadow-button-hover disabled:opacity-50 transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? "Updating..." : "Update Statistics"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CompanyStatsModal;
