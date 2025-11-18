import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const AccessContext = createContext();

export const AccessProvider = ({ children }) => {
  const { token, isLoggedIn } = useAuth();
  const [access, setAccess] = useState({
    tabs: [],
    dbs: [],
    schemas: [],
  });
  const [loadingAccess, setLoadingAccess] = useState(true);

  const fetchAccess = async () => {
    if (!token || !isLoggedIn) {
      setAccess({ tabs: [], dbs: [], schemas: [] });
      setLoadingAccess(false);
      return;
    }

    try {
      const res = await api.get("/admin/get-access-me");

      setAccess(res.data?.data?.access || { tabs: [], dbs: [], schemas: [] });
    } catch (err) {
      console.error("Failed to load access:", err);
    } finally {
      setLoadingAccess(false);
    }
  };

  useEffect(() => {
    fetchAccess();
  }, [token, isLoggedIn]);

  useEffect(() => {
  }, [access]);

  return (
    <AccessContext.Provider value={{ access, loadingAccess, fetchAccess }}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => useContext(AccessContext);
