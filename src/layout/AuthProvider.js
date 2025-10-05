import React, { useEffect, useState, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { getAccessToken, setTokens, clearTokens } from "../utils/tokenUtils";

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());

  const [loginSuccessFlag, setLoginSuccessFlag] = useState(false);

  const login = useCallback(({ access, refresh }) => {
    setTokens({ access, refresh });
    setIsAuthenticated(true);
    setLoginSuccessFlag((prev) => {
      return !prev;
    });

    localStorage.setItem(
      "auth-event",
      JSON.stringify({ type: "login", timestamp: Date.now() })
    );
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setIsAuthenticated(false);

    localStorage.setItem(
      "auth-event",
      JSON.stringify({ type: "logout", timestamp: Date.now() })
    );
    window.location.href = "/login";
  }, []);

  // Idle logout logic
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, 30 * 60 * 1000);
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

  // Cross-tab login/logout sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "auth-event") {
        const event = JSON.parse(e.newValue);
        if (event.type === "logout") {
          setIsAuthenticated(false);
        } else if (event.type === "login") {
          setIsAuthenticated(!!getAccessToken());
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loginSuccessFlag }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
