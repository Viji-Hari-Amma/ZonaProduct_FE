import React, { useState, useEffect } from "react";
import { FiSave, FiRefreshCw, FiSettings } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  getReviewSettings,
  updateReviewSettings,
} from "../../../../services/reviewApi/reviewApi";

const ReviewSettings = () => {
  const [settings, setSettings] = useState({
    auto_approve_reviews: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReviewSettings();
  }, []);

  const fetchReviewSettings = async () => {
    try {
      setLoading(true);
      const response = await getReviewSettings();

      // Handle different response structures
      let settingsData = { auto_approve_reviews: false };

      if (response && response.auto_approve_reviews !== undefined) {
        // Direct response: { auto_approve_reviews: false }
        settingsData = { auto_approve_reviews: response.auto_approve_reviews };
      } else if (response && response.data !== undefined) {
        // Wrapped response: { data: { auto_approve_reviews: false } }
        settingsData = {
          auto_approve_reviews: response.data.auto_approve_reviews || false,
        };
      }

      setSettings(settingsData);
    } catch (error) {
      toast.error("Failed to fetch review settings");
      console.error("Error fetching review settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateReviewSettings({
        auto_approve_reviews: settings.auto_approve_reviews,
      });
      toast.success("Review settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update review settings");
      console.error("Error updating review settings:", error);
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#7C2D12] mb-2 flex items-center gap-3">
            <FiSettings className="text-[#F97316]" />
            Review Settings
          </h1>
          <p className="text-[#9A3412]">
            Configure how customer reviews are handled on your website
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-xl p-6 shadow-[0_6px_16px_rgba(220,38,38,0.15)] border border-[#FED7AA] hover:shadow-[0_10px_22px_rgba(249,115,22,0.25)] transition-all duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#7C2D12] mb-4">
              Review Approval Settings
            </h2>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 lg:p-6 border border-[#FED7AA] rounded-lg bg-[#FFEDE9] gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-[#7C2D12] text-lg">
                  Auto-approve Reviews
                </h3>
                <p className="text-sm text-[#9A3412] mt-2">
                  When enabled, customer reviews will be automatically approved
                  and visible without manual intervention. When disabled, all
                  reviews require admin approval before being published.
                </p>
              </div>

              <div className="flex-shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.auto_approve_reviews}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        auto_approve_reviews: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#F97316] peer-checked:to-[#DC2626]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6 mb-6">
            <h4 className="font-medium text-blue-800 mb-3 text-lg">
              How it works:
            </h4>
            <ul className="text-blue-700 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
                  •
                </span>
                <span>
                  <strong>Auto-approve OFF:</strong> All reviews require manual
                  approval before being visible to customers
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
                  •
                </span>
                <span>
                  <strong>Auto-approve ON:</strong> Reviews are automatically
                  published (use with caution)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
                  •
                </span>
                <span>
                  You can still manually reject reviews even with auto-approve
                  enabled
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col lg:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white rounded-lg hover:from-[#DC2626] hover:to-[#F97316] disabled:bg-[#FECACA] disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-[0_4px_12px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.45)]"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Save Settings
                </>
              )}
            </button>

            <button
              onClick={fetchReviewSettings}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] transition-all duration-200 hover:scale-105"
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSettings;
