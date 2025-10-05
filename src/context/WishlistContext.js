import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import AuthContext from "./AuthContext";
import {
  viewWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistApi/wishlistApi";

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [productIdToItem, setProductIdToItem] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { loginSuccessFlag } = useContext(AuthContext);

  const normalizeId = useCallback((id) => String(id), []);
  const extractProductId = useCallback(
    (item) => item?.product_id ?? item?.product?.id,
    []
  );

  const rebuildMap = useCallback(
    (items) => {
      const map = new Map();
      items.forEach((item) => {
        const pid = extractProductId(item);
        if (pid !== undefined && pid !== null) {
          map.set(normalizeId(pid), item);
        }
      });
      return map;
    },
    [extractProductId, normalizeId]
  );

  const initializeWishlist = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setWishlistItems([]);
      setProductIdToItem(new Map());
      setIsInitialized(true);
      return;
    }
    if (isInitialized) return;
    setIsLoading(true);
    try {
      const res = await viewWishlist();
      const items = res?.data || [];
      setWishlistItems(items);
      setProductIdToItem(rebuildMap(items));
      setIsInitialized(true);
    } catch (error) {
      // Only clear on 401/403, else show toast
      const status = error?.response?.status;
      if (status !== 401 && status !== 403) {
        // Optionally show a toast here if you want
      }
      setWishlistItems([]);
      setProductIdToItem(new Map());
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, rebuildMap]);

  // Fetch wishlist on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) initializeWishlist();
    else {
      setWishlistItems([]);
      setProductIdToItem(new Map());
      setIsInitialized(true);
    }
    // eslint-disable-next-line
  }, [initializeWishlist]);

  // When loginSuccessFlag changes, reset isInitialized to force refresh
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsInitialized(false);
  }, [loginSuccessFlag]);

  // Always fetch wishlist on login event
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "auth-event") {
        const event = JSON.parse(e.newValue);
        if (event.type === "login") {
          setIsInitialized(false);
          initializeWishlist();
        }
        if (event.type === "logout") {
          setWishlistItems([]);
          setProductIdToItem(new Map());
          setIsInitialized(true);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [initializeWishlist]);

  const isInWishlist = useCallback(
    (productId) => productIdToItem.has(normalizeId(productId)),
    [productIdToItem, normalizeId]
  );

  const refreshWishlist = useCallback(async () => {
    setIsInitialized(false);
    await initializeWishlist();
  }, [initializeWishlist]);

  const toggleWishlist = useCallback(
    async (productId) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // Let caller redirect/toast
        return { ok: false, reason: "unauthenticated" };
      }

      const key = normalizeId(productId);
      const currentlyIn = productIdToItem.has(key);
      try {
        if (currentlyIn) {
          const item = productIdToItem.get(key);
          if (item) {
            await removeFromWishlist(item.id);
            const nextItems = wishlistItems.filter((w) => {
              const pid = extractProductId(w);
              return normalizeId(pid) !== key;
            });
            setWishlistItems(nextItems);
            setProductIdToItem(rebuildMap(nextItems));
            return { ok: true, added: false };
          }
          // If map desynced, hard refresh
          await refreshWishlist();
          return { ok: true, added: false };
        } else {
          try {
            const res = await addToWishlist({ product_id: productId });
            const created = res?.data;
            const nextItems = [...wishlistItems, created];
            setWishlistItems(nextItems);
            setProductIdToItem(rebuildMap(nextItems));
            return { ok: true, added: true };
          } catch (err) {
            const msg =
              err?.response?.data?.non_field_errors?.[0] ||
              err?.response?.data?.detail ||
              "";
            // If backend says it's already in wishlist, just refresh and report success
            if (
              typeof msg === "string" &&
              msg.toLowerCase().includes("already")
            ) {
              await refreshWishlist();
              return { ok: true, added: true, already: true };
            }
            throw err;
          }
        }
      } catch (error) {
        // If backend says the item doesn't exist on delete, refresh state
        const detail = error?.response?.data?.detail || "";
        if (
          typeof detail === "string" &&
          detail.toLowerCase().includes("no wishlist")
        ) {
          await refreshWishlist();
        }
        return { ok: false, error };
      }
    },
    [
      productIdToItem,
      wishlistItems,
      rebuildMap,
      refreshWishlist,
      normalizeId,
      extractProductId,
    ]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      isInWishlist,
      toggleWishlist,
      refreshWishlist,
      isLoading,
      isInitialized,
    }),
    [
      wishlistItems,
      isInWishlist,
      toggleWishlist,
      refreshWishlist,
      isLoading,
      isInitialized,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
