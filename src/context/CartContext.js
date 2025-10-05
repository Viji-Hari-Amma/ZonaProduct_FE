import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import AuthContext from "./AuthContext";
import {
  QuickAddToCart,
  addToCart,
  deleteCartItem,
  updateCartItem,
  listCartItems,
} from "../services/cartApi/cartApi";
import { toast } from "react-toastify";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState({});
  const { loginSuccessFlag } = useContext(AuthContext);

  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setCartItems([]);
      return;
    }
    try {
      const res = await listCartItems();
      setCartItems(res.data);
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 401 && status !== 403) {
        toast.error("Failed to load cart");
      } else {
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) refreshCart();
    else setCartItems([]);
  }, [refreshCart, loginSuccessFlag]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "auth-event") {
        const event = JSON.parse(e.newValue);
        if (event.type === "login") {
          refreshCart();
        }
        if (event.type === "logout") {
          setCartItems([]);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshCart]);

  const quickAddToCart = async (productId) => {
    setLoadingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await QuickAddToCart({ product_id: productId });
      toast.success("Added to cart");
      refreshCart();
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const addToCartWithQty = async (productId, quantity, sizeId) => {
    setIsLoading(true);
    try {
      await addToCart({ product_id: productId, quantity, size_id: sizeId });
      toast.success("Added to cart");
      refreshCart();
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setIsLoading(true);
    try {
      await deleteCartItem(itemId);
      toast.success("Removed from cart");
      refreshCart();
    } catch {
      toast.error("Failed to remove from cart");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCart = async (itemId, data) => {
    setIsLoading(true);
    try {
      await updateCartItem(itemId, data);
      toast.success("Cart updated");
      refreshCart();
    } catch {
      toast.error("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        isLoading,
        loadingItems,
        quickAddToCart,
        addToCartWithQty,
        removeFromCart,
        updateCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
