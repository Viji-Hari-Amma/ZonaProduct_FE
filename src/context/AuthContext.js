// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState, useCallback } from "react";
import { getAccessToken, setTokens, clearTokens } from "../utils/tokenUtils";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());
  const [loginSuccessFlag, setLoginSuccessFlag] = useState(false);
  const [pendingCartItems, setPendingCartItems] = useState([]);
  const [user, setUser] = useState(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;
    return {
      userId,
      isSuperuser: localStorage.getItem("is_superuser") === "true",
      isStaff: localStorage.getItem("is_staff") === "true",
      profilePic: localStorage.getItem("profilePic") || "",
    };
  });

  // Load pending cart items from localStorage on initial load
  useEffect(() => {
    const savedPendingItems = localStorage.getItem("pendingCartItems");
    if (savedPendingItems) {
      setPendingCartItems(JSON.parse(savedPendingItems));
    }
  }, []);

  // Save pending cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pendingCartItems", JSON.stringify(pendingCartItems));
  }, [pendingCartItems]);

  /**
   * Update profile picture in context and localStorage
   */
  const updateProfilePic = useCallback((newProfilePic) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedUser = {
        ...prevUser,
        profilePic: newProfilePic || "",
      };

      // Update localStorage
      localStorage.setItem("profilePic", newProfilePic || "");

      return updatedUser;
    });
  }, []);

  /**
   * login(payload)
   * Accepts either:
   *  { access, refresh, userId, isSuperuser, is_staff, profilePic }
   *  OR
   *  { access, refresh, userId, is_superuser, isStaff, profilePic } etc.
   * (normalizes keys)
   */
  const login = useCallback(
    ({
      access,
      refresh,
      userId,
      isSuperuser,
      is_superuser,
      isStaff,
      is_staff,
      profilePic,
    }) => {
      setTokens({ access, refresh });

      // normalize role flags
      const normalizedIsSuper = isSuperuser ?? is_superuser ?? false;
      const normalizedIsStaff = isStaff ?? is_staff ?? false;

      // persist to localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("is_superuser", String(!!normalizedIsSuper));
      localStorage.setItem("is_staff", String(!!normalizedIsStaff));
      localStorage.setItem("profilePic", profilePic || "");

      // update state
      setUser({
        userId,
        isSuperuser: !!normalizedIsSuper,
        isStaff: !!normalizedIsStaff,
        profilePic: profilePic || "",
      });

      setIsAuthenticated(true);
      setLoginSuccessFlag((prev) => !prev);

      localStorage.setItem(
        "auth-event",
        JSON.stringify({ type: "login", timestamp: Date.now() })
      );

      if (pendingCartItems.length > 0) {
        toast.success(`${pendingCartItems.length} item(s) added to cart!`);
      }

      return [...pendingCartItems];
    },
    [pendingCartItems]
  );

  const logout = useCallback(() => {
    clearTokens();
    localStorage.removeItem("userId");
    localStorage.removeItem("is_superuser");
    localStorage.removeItem("is_staff");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("userEmail");

    setIsAuthenticated(false);
    setUser(null);
    setPendingCartItems([]);

    localStorage.setItem(
      "auth-event",
      JSON.stringify({ type: "logout", timestamp: Date.now() })
    );

    // keep your existing redirect style (hash or not depending on your app)
    window.location.href = "/#/Login";
    window.location.reload();
  }, []);

  const addPendingCartItem = useCallback((productId) => {
    setPendingCartItems((prev) =>
      prev.includes(productId) ? prev : [...prev, productId]
    );
  }, []);

  const clearPendingCartItems = useCallback(() => {
    setPendingCartItems([]);
  }, []);

  const getPendingCartItems = useCallback(() => {
    return [...pendingCartItems];
  }, [pendingCartItems]);

  // Auto logout after 30min inactivity
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, 30 * 60 * 1000); // 30 minutes
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [logout]);

  // Sync login/logout across tabs (and restore user when login event occurs)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "auth-event" && e.newValue) {
        try {
          const event = JSON.parse(e.newValue);
          if (event.type === "logout") {
            setIsAuthenticated(false);
            setUser(null);
          } else if (event.type === "login") {
            setIsAuthenticated(!!getAccessToken());
            // restore user from localStorage (so roles are available in other tabs)
            const userId = localStorage.getItem("userId");
            if (userId) {
              setUser({
                userId,
                isSuperuser: localStorage.getItem("is_superuser") === "true",
                isStaff: localStorage.getItem("is_staff") === "true",
                profilePic: localStorage.getItem("profilePic") || "",
              });
            }
          }
        } catch (err) {
          // noop
        }
      } else if (e.key === "profilePic") {
        // Sync profile picture updates across tabs
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            profilePic: e.newValue || "",
          };
        });
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loginSuccessFlag,
        pendingCartItems,
        addPendingCartItem,
        clearPendingCartItems,
        getPendingCartItems,
        updateProfilePic, // Add the new function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
