import React, { useEffect } from "react";
import { FiCheckCircle, FiX, FiUploadCloud, FiMapPin } from "react-icons/fi";

const PaymentModal = ({
  orderId,
  amount,
  paymentMethod,
  onSelectMethod,
  screenshot,
  onScreenshotChange,
  onConfirm,
  onClose,
  loading,
  upiSettings,
  items = [],
  subtotal,
  deliveryCharge = 0,
  address,
}) => {
  // Calculate subtotal from items if available
  const calculatedSubtotal = React.useMemo(() => {
    if (items && items.length > 0) {
      return items.reduce((total, item) => {
        const price = item.size?.discounted_price
          ? parseFloat(item.size.discounted_price)
          : item.discounted_price
          ? parseFloat(item.discounted_price)
          : parseFloat(item.price || 0);

        const quantity = item.quantity || 1;
        return total + price * quantity;
      }, 0);
    }
    return subtotal || 0;
  }, [items, subtotal]);

  // Calculate original total for discount display
  const originalTotal = React.useMemo(() => {
    if (items && items.length > 0) {
      return items.reduce((total, item) => {
        const price = item.size?.price
          ? parseFloat(item.size.price)
          : item.price
          ? parseFloat(item.price)
          : parseFloat(item.discounted_price || 0);

        const quantity = item.quantity || 1;
        return total + price * quantity;
      }, 0);
    }
    return calculatedSubtotal; // If no items, assume no discount
  }, [items, calculatedSubtotal]);

  const displaySubtotal = calculatedSubtotal;
  const displayDeliveryCharge = deliveryCharge || 0;
  const displayAmount = amount || (calculatedSubtotal + displayDeliveryCharge);
  const hasDiscount = originalTotal > calculatedSubtotal;

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? You haven't completed the payment yet.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white h-[500px] overflow-y-auto rounded-xl shadow-2xl w-full max-w-md mx-auto scrollbar-thin scrollbar-thumb-[#F97316] scrollbar-track-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#7C2D12]">
              Complete Payment
            </h2>
            <button
              onClick={onClose}
              className="text-[#F97316] hover:text-[#DC2626]"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
            
            {/* Show discount breakdown if there's a discount */}
            {hasDiscount ? (
              <>
                <p className="text-gray-600 w-[250px] flex items-center justify-between">
                  Original Price:{" "}
                  <span className="line-through text-gray-400 font-semibold w-[100px]">
                    ₹{originalTotal.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-600 w-[250px] flex items-center justify-between">
                  Discounted Price:{" "}
                  <span className="text-green-700 font-semibold w-[100px]">
                    ₹{displaySubtotal.toFixed(2)}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-gray-600 w-[250px] flex items-center justify-between">
                Subtotal:{" "}
                <span className="font-semibold w-[100px]">
                  ₹{displaySubtotal.toFixed(2)}
                </span>
              </p>
            )}
            
            <p className="text-gray-600 w-[250px] flex items-center justify-between">
              Delivery Fee:{" "}
              <span className="font-semibold w-[100px]">
                ₹{displayDeliveryCharge.toFixed(2)}
              </span>
            </p>
            <p className="text-gray-600 w-[250px] flex items-center justify-between">
              Total:{" "}
              <span className="font-semibold w-[100px]">
                ₹{displayAmount.toFixed(2)}
              </span>
            </p>
          </div>

          {/* Address Display */}
          {address && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center text-[#7C2D12] font-semibold mb-2">
                <FiMapPin className="mr-2" />
                Delivery Address
              </div>
              <div className="text-gray-700 text-sm">
                <p className="font-medium">{address.address}</p>
                <p>
                  {address.city}, {address.state}
                </p>
                <p>
                  {address.country} - {address.zip_code}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer ${
                paymentMethod === "COD"
                  ? "border-[#F97316] bg-[#FFF5F0]"
                  : "border-gray-200"
              }`}
              onClick={() => onSelectMethod("COD")}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    paymentMethod === "COD"
                      ? "border-[#F97316] bg-[#F97316]"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "COD" && (
                    <FiCheckCircle className="text-white text-xs" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Cash on Delivery</h3>
                  <p className="text-gray-600 text-sm">
                    Pay when you receive the order
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer ${
                paymentMethod === "UPI"
                  ? "border-[#F97316] bg-[#FFF5F0]"
                  : "border-gray-200"
              }`}
              onClick={() => onSelectMethod("UPI")}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    paymentMethod === "UPI"
                      ? "border-[#F97316] bg-[#F97316]"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "UPI" && (
                    <FiCheckCircle className="text-white text-xs" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">UPI Payment</h3>
                  <p className="text-gray-600 text-sm">
                    Pay instantly using UPI
                  </p>
                </div>
              </div>
            </div>
          </div>

          {paymentMethod === "UPI" && (
            <div className="mb-6">
              {upiSettings ? (
                <div className="bg-gray-100 p-4 rounded-lg text-center mb-4">
                  <img
                    src={upiSettings.qr_image_url}
                    alt="UPI QR Code"
                    className="mx-auto mb-4 max-w-[200px]"
                  />
                  <p className="font-mono text-lg font-semibold">
                    {upiSettings.upi_id}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Scan the QR code or send payment to the UPI ID
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-100 p-4 rounded-lg text-center mb-4">
                  <p className="text-yellow-800">
                    UPI payment is currently unavailable. Please choose another
                    payment method.
                  </p>
                </div>
              )}

              {upiSettings && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Payment Screenshot
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#F97316]">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Click to upload or drag and drop
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onScreenshotChange(e.target.files[0])}
                      />
                    </label>
                  </div>

                  {screenshot && (
                    <div className="mt-4">
                      <p className="text-sm text-green-600">
                        File selected: {screenshot.name}
                      </p>
                      {screenshot.type.startsWith("image/") && (
                        <img
                          src={URL.createObjectURL(screenshot)}
                          alt="Payment Screenshot Preview"
                          className="mt-2 max-h-40 rounded-lg border border-gray-200 shadow-sm mx-auto"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={onConfirm}
            disabled={
              loading ||
              (paymentMethod === "UPI" && (!screenshot || !upiSettings))
            }
            className="w-full bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-[#DC2626] hover:to-[#F97316] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
