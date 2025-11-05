import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, token, user, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn || !token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Decode token and check expiry
  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      logout(); // Clear auth and redirect
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
