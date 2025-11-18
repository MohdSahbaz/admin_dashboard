import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAccess } from "../context/AccessContext";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useRef } from "react";
import Loader from "./common/Loader";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, token, user, logout, loading } = useAuth();
  const { access } = useAccess();
  const location = useLocation();
  const toastShownRef = useRef(false);

  // Wait for auth to load
  if (loading) return <Loader />;

  // If not logged in, redirect
  if (!isLoggedIn || !token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Validate token
  try {
    const decoded = jwtDecode(token);
    const expired = decoded.exp * 1000 < Date.now();

    if (expired) {
      logout();
      if (!toastShownRef.current) {
        toast.error("Your session has expired. Please log in again.");
        toastShownRef.current = true;
      }
      return <Navigate to="/login" replace />;
    }
  } catch {
    logout();
    if (!toastShownRef.current) {
      toast.error("Invalid session. Please log in again.");
      toastShownRef.current = true;
    }
    return <Navigate to="/login" replace />;
  }

  // Wait until access permissions load
  if (!access?.tabs || access.tabs.length === 0) {
    return <Loader />;
  }

  // Match route to required permission
  const routePath = location.pathname.replace("/", "").toLowerCase();
  const routeToPermission = {
    "": "Dashboard",
    doctors: "Doctors",
    camps: "Camps",
    users: "Users",
    reports: "Reports",
    "doctor-locations": "Doctors Location",
    access: "Access",
    "db-console": "Db Console",
  };

  if (routePath === "") {
    return (
      <Navigate
        to={`${access?.tabs[0].replace(/\s+/g, "-").toLowerCase()}`}
        replace
      />
    );
  }

  const requiredPermission = routeToPermission[routePath];
  const notAllowed =
    requiredPermission && !access.tabs.includes(requiredPermission);

  // Block unauthorized access
  if (notAllowed) {
    if (!toastShownRef.current) {
      toast.error("You are not allowed to access this page.");
      toastShownRef.current = true;
    }
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
