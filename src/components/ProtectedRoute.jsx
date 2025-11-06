import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, token, user, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn || !token || !user) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      logout(); // clear auth
      toast.error("Your session has expired. Please log in again.", {
        duration: 4000,
        position: "top-center",
      });
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    logout();
    toast.error("Invalid session. Please log in again.", {
      duration: 4000,
      position: "top-center",
    });
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) {
    toast.error("You are not authorized to access this page.", {
      duration: 3000,
      position: "top-center",
    });
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
