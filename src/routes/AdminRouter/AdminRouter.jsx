import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import Dashboard from "../../pages/AdminDashboard/Dashboard/Dashboard";
import UserManagement from "../../pages/AdminDashboard/UserMangement/UserManagement";
import AdminRoute from "./AdminRoute";
import { OrderManagement } from "../../pages/AdminDashboard/OrderManagement/OrderManagement";
import { ProductManagement } from "../../pages/AdminDashboard/ProductManagement/ProductManagement";
import ContactManagement from "../../pages/AdminDashboard/ContactMangement/ContactManagement";
import ReviewManagement from "../../pages/AdminDashboard/ReviewManagement/ReviewManagement";
import DiscountManagement from "../../pages/AdminDashboard/DiscountManagement/DiscountManagement";
import PaymentManagement from "../../pages/AdminDashboard/PaymentManagement/PaymentManagement";
import WebSettings from "../../pages/AdminDashboard/WebsiteSettings/WebsiteSettings";
import FAQManagement from "../../pages/AdminDashboard/FAQManagement/FAQManagement";

export default function AdminRouter() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="User_Management" element={<UserManagement />} />
        <Route path="Order_Management" element={<OrderManagement />} />
        <Route path="Product_Management" element={<ProductManagement />} />
        <Route path="Contact_Management" element={<ContactManagement />} />
        <Route path="Review_Management" element={<ReviewManagement />} />
        <Route path="Discount_Management" element={<DiscountManagement />} />
        <Route path="Payment_Management" element={<PaymentManagement />} />
        <Route path="Web_settings" element={<WebSettings />} />
        <Route path="FAQ_Management" element={<FAQManagement />} />
      </Route>
    </Routes>
  );
}
