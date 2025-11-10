import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
  };

  // ✅ Check storage on mount
  useEffect(() => {
    const loadAuth = () => {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const storedToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (storedUser && storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired
            logout();
            return;
          }

          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setIsLoggedIn(true);
        } catch (error) {
          logout();
        }
      } else {
        logout();
      }

      setLoading(false);
    };

    loadAuth();

    // ✅ Listen to manual logout (like storage clearing in other tabs)
    window.addEventListener("storage", loadAuth);

    return () => {
      window.removeEventListener("storage", loadAuth);
    };
  }, []);

  const login = (userData, token, remember = false) => {
    setUser(userData);
    setToken(token);
    setIsLoggedIn(true);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("authToken", token);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
