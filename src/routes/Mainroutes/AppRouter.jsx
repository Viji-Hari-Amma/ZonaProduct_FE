// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "../../pages/About Us/AboutUs";
import Contact from "../../pages/Contact/Contact";
import HomePage from "../../pages/Home Page/HomePage";
import HomeLayout from "../../layout/HomeLayout";
import { Login } from "../../pages/Authentication/Login/Login";
import Register from "../../pages/Authentication/CreateAccount/Register";
import ForgotPassword from "../../pages/Authentication/ForgotPassword/ForgotPassword";
import ChangePassword from "../../pages/Authentication/ChangePassword/ChangePassword";
import ResetPassword from "../../pages/Authentication/ResetPassword/ResetPassword";
import VerifyOtp from "../../pages/Authentication/VerifyOTP/VerifyOTP";
import AdminRegister from "../../pages/Authentication/AdminRegister/AdminRegister";
import { WishList } from "../../pages/WishList/WishList";
import { Cart } from "../../pages/Cart/Cart";
import { Profile } from "../../pages/Profile/Profile";
import { Orders } from "../../pages/Orders/Orders";
import { Products } from "../../pages/Products/Products";
import ProtectedRoute from "../ProductedRouter/ProtectedRoute";
import ProductDetails from "../../pages/ProductDetails/ProductDetails";
import { ScrollToTop } from "../../components/ScrollToTop/ScrollToTop";
import CheckoutPage from "../../pages/CheckoutPage/CheckoutPage";
import AdminRouter from "../AdminRouter/AdminRouter";
import Forbidden from "../../pages/Forbidden/Forbidden";
import { FAQs } from "../../pages/FAQ/FAQs";
import { ShippingAndReturns } from "../../pages/Shipping&Returns/ShippingAndReturns";
import { PrivacyPolicy } from "../../pages/PrivacyPolicy/PrivacyPolicy";
import { TermsAndConditions } from "../../pages/TermsAndConditions/TermsAndConditions";

const AppRouter = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      {/* Home Layout Routes */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="wishlist"
          element={
            <ProtectedRoute>
              <WishList />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="Login" element={<Login />} />
        <Route path="Register" element={<Register />} />
        <Route path="Verify-OTP" element={<VerifyOtp />} />
        <Route path="Forgot-Password" element={<ForgotPassword />} />
        <Route path="Reset-Password/:token" element={<ResetPassword />} />
        <Route path="Change-Password" element={<ChangePassword />} />
        <Route path="Admin/Register-Admin" element={<AdminRegister />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/faq" element={<FAQs />} />
        <Route path="/shipping-returns" element={<ShippingAndReturns />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/*" element={<AdminRouter />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
