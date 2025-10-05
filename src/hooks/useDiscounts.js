// hooks/useDiscounts.js
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { discountService } from "../services/productApi/productDiscountApi/productDiscountApi";

export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await discountService.listDiscounts();

      // Handle different response formats
      let discountsData = [];
      if (Array.isArray(response?.data)) {
        // Direct array response
        discountsData = response.data;
      } else if (
        response?.data?.offers &&
        Array.isArray(response.data.offers)
      ) {
        // Nested offers response
        discountsData = response.data.offers;
      } else if (Array.isArray(response?.offers)) {
        // Alternative nested format
        discountsData = response.offers;
      }

      setDiscounts(discountsData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch discounts");
      toast.error("Failed to load discounts");
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await discountService.getStats();
      setStats(response.data);
    } catch (err) {
      toast.error("Failed to load statistics");
    }
  };

  const createDiscount = async (data) => {
    try {
      await discountService.createDiscount(data);
      toast.success("Discount created successfully");
      await fetchDiscounts();
      await fetchStats();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create discount";
      toast.error(errorMessage);
      return false;
    }
  };

  const updateDiscount = async (id, data) => {
    try {
      await discountService.updateDiscount(id, data);
      toast.success("Discount updated successfully");
      await fetchDiscounts();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update discount";
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteDiscount = async (id) => {
    try {
      if (!id || id === "undefined") {
        toast.error("Invalid discount ID");
        return false;
      }

      await discountService.deleteDiscount(id);
      toast.success("Discount deleted successfully");
      await fetchDiscounts();
      await fetchStats();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete discount";
      toast.error(errorMessage);
      return false;
    }
  };

  const toggleActive = async (id) => {
    try {
      await discountService.toggleActive(id);
      toast.success("Discount status updated");
      await fetchDiscounts();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update status";
      toast.error(errorMessage);
      return false;
    }
  };

  const sendNotification = async (id) => {
    try {
      await discountService.sendNotification(id);
      toast.success("Notification sent successfully");
      await fetchDiscounts();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send notification";
      toast.error(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchDiscounts();
    fetchStats();
  }, []);

  return {
    discounts,
    stats,
    loading,
    error,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    toggleActive,
    sendNotification,
    refreshDiscounts: fetchDiscounts,
    refreshStats: fetchStats,
  };
};
