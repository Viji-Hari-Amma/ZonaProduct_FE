import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createAddress,
  listAddresses,
  updateAddress,
} from "../../services/profileApi/profileApi";
import { listCartItems } from "../../services/cartApi/cartApi";
import {
  createOrder,
  createBuyNowOrder,
} from "../../services/orderApi/orderApi";
import {
  createPayment,
  getUPISettings,
  uploadPaymentProof,
} from "../../services/paymentApi/paymentApi";
import AddressFormModal from "../Profile/Forms/AddressFormModal";
import AddressSelection from "./AddressSelection/AddressSelection";
import CartItems from "./CartItems/CartItems";
import OrderSummary from "./OrderSummary/OrderSummary";
import PaymentModal from "./PaymentModal/PaymentModal";
import BuyNowItem from "../../components/Buttons/BuyNowItem/BuyNowItem";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [buyNowState, setBuyNowState] = useState(() => {
    // First priority: location state (direct navigation)
    if (location.state?.buyNow) {
      return location.state;
    }

    // Second priority: sessionStorage (after login redirect)
    const storedData = sessionStorage.getItem("buyNowData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      sessionStorage.removeItem("buyNowData"); // Clean up
      return parsedData;
    }

    return null;
  });

  const isBuyNow = buyNowState?.buyNow;
  const buyNowProduct = buyNowState?.product;
  const buyNowSelectedSize = buyNowState?.selectedSize;
  const buyNowQuantity = buyNowState?.quantity;
  const buyNowData = buyNowState?.buyNowData;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [upiSettings, setUpiSettings] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Calculate delivery charge based on items
  const calculateDeliveryCharge = (items) => {
    if (!items || items.length === 0) return 0;

    // Use the maximum delivery charge among items (or sum them up based on your business logic)
    return items.reduce((maxCharge, item) => {
      const itemDeliveryCharge = parseFloat(
        item.size?.delivery_charge || item.delivery_charge || 0
      );
      return Math.max(maxCharge, itemDeliveryCharge);
    }, 0);
  };

  // Calculate subtotal based on items
  const calculateSubtotal = (items) => {
    if (!items || items.length === 0) return 0;

    return items.reduce((total, item) => {
      const price = item.size?.discounted_price
        ? parseFloat(item.size.discounted_price)
        : parseFloat(item.price || 0);
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  // Calculate totals based on mode
  const currentItems = isBuyNow
    ? [
        {
          product: buyNowProduct,
          size: buyNowSelectedSize,
          quantity: buyNowQuantity || 1,
          price: buyNowSelectedSize
            ? parseFloat(
                buyNowSelectedSize.discounted_price || buyNowSelectedSize.price
              )
            : 0,
        },
      ]
    : cartItems;

  const subtotal = calculateSubtotal(currentItems);
  const deliveryCharge = calculateDeliveryCharge(currentItems);
  const totalAmount = subtotal + deliveryCharge;

  useEffect(() => {
    fetchAddresses();
    if (!isBuyNow) {
      fetchCart();
    }
    fetchUPISettings();
  }, [isBuyNow]);

  const fetchUPISettings = async () => {
    try {
      const response = await getUPISettings();
      const activeUPI = response.data.find((setting) => setting.is_active);
      setUpiSettings(activeUPI || null);
    } catch (error) {
      toast.error("Failed to load UPI settings");
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await listAddresses();
      setAddresses(response.data || []);
      const defaultAddress = (response.data || []).find(
        (addr) => addr.is_default
      );
      if (defaultAddress) setSelectedAddressId(defaultAddress.id);
    } catch (error) {
      toast.error("Failed to load addresses");
    }
  };

  const fetchCart = async () => {
    try {
      const response = await listCartItems();
      const data = response.data || [];

      const items = Array.isArray(data) ? data : data.items || [];
      setCartItems(items);
    } catch (error) {
      toast.error("Failed to load cart items");
    }
  };

  const handleAddressSubmit = async (formData) => {
    try {
      setIsLoading(true);
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
        toast.success("Address updated successfully");
      } else {
        await createAddress(formData);
        toast.success("Address added successfully");
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    // Additional validation for buy now mode
    if (
      isBuyNow &&
      (!buyNowProduct || !buyNowSelectedSize || !buyNowQuantity)
    ) {
      toast.error("Invalid product data. Please try again.");
      return;
    }

    try {
      setIsLoading(true);

      let orderResponse;

      if (isBuyNow) {
        // Use buy now API
        const buyNowPayload = {
          ...buyNowData,
          address_id: selectedAddressId,
        };
        orderResponse = await createBuyNowOrder(buyNowPayload);
      } else {
        // Use regular cart order API
        orderResponse = await createOrder({
          address_id: selectedAddressId,
        });
      }

      if (orderResponse.status === 200 || orderResponse.status === 201) {
        const order = orderResponse.data;
        setOrderId(order.id);

        // Clear buy now data from sessionStorage after successful order
        sessionStorage.removeItem("buyNowData");

        toast.success("Order placed successfully! Please complete payment.");
        setShowPaymentModal(true);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (paymentMethod === "UPI" && (!screenshot || !upiSettings)) {
      toast.error("Please upload screenshot or UPI is unavailable");
      return;
    }

    try {
      setIsLoading(true);

      const paymentData = {
        order: orderId,
        amount: Number(totalAmount).toFixed(2), // <-- Fix: round to 2 decimals
        mode: paymentMethod,
      };

      const paymentResponse = await createPayment(paymentData);
      const payment = paymentResponse.data;

      if (paymentMethod === "UPI" && screenshot) {
        await uploadPaymentProof(payment.id, screenshot);
      }

      setShowPaymentModal(false);
      toast.success("Payment request sent! Admin will verify your order.");

      // Redirect based on mode
      navigate(isBuyNow ? "/orders" : "/cart");
    } catch (error) {
      toast.error("Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (
      window.confirm(
        "Are you sure you want to close? You haven't made the payment yet."
      )
    ) {
      setShowPaymentModal(false);
      navigate("/orders");
    }
  };

  // If we're in buy now mode but missing essential data, show error
  if (isBuyNow && (!buyNowProduct || !buyNowSelectedSize)) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] pb-8 pt-[13vh] px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#7C2D12] mb-4">
            Invalid Product Data
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the product details. Please try buying the product
            again.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-2 px-6 rounded-lg font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-8 pt-[13vh] px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#7C2D12] mb-8">
          Checkout {isBuyNow && "(Buy Now)"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Address and Items */}
          <div className="space-y-6">
            <AddressSelection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onEditAddress={(address) => {
                setEditingAddress(address);
                setShowAddressModal(true);
              }}
              onAddAddress={() => {
                setEditingAddress(null);
                setShowAddressModal(true);
              }}
            />

            {/* Show either Buy Now item or Cart items */}
            {isBuyNow ? (
              <div>
                <h2 className="text-xl font-semibold text-[#7C2D12] mb-4">
                  Order Item
                </h2>
                <BuyNowItem
                  product={buyNowProduct}
                  selectedSize={buyNowSelectedSize}
                  quantity={buyNowQuantity}
                />
              </div>
            ) : (
              <CartItems items={cartItems} />
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <OrderSummary
              items={currentItems}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              totalAmount={totalAmount}
            />
            <button
              onClick={handlePlaceOrder}
              disabled={
                isLoading || (isBuyNow ? !buyNowProduct : !cartItems.length)
              }
              className="w-full bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-[#DC2626] hover:to-[#F97316] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressFormModal
          address={editingAddress}
          onSubmit={handleAddressSubmit}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          loading={isLoading}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          orderId={orderId}
          amount={totalAmount}
          items={currentItems}
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          paymentMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
          screenshot={screenshot}
          onScreenshotChange={setScreenshot}
          onConfirm={handlePayment}
          onClose={handleClose}
          loading={isLoading}
          upiSettings={upiSettings}
          address={addresses.find((addr) => addr.id === selectedAddressId)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
