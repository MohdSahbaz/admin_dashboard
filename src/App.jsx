import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./pages/auth/LoginForm";
import DashboardPage from "./pages/DashboardPage";
import Camps from "./pages/CampsPage";
import Users from "./pages/UsersPage";
import Reports from "./pages/ReportsPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorLocation from "./pages/DoctorLocation";
import DBConsole from "./pages/DBConsole";
import Access from "./pages/Access";

const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctors",
    element: (
      <ProtectedRoute>
        <DoctorsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/camps",
    element: (
      <ProtectedRoute>
        <Camps />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor-locations",
    element: (
      <ProtectedRoute>
        <DoctorLocation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/db-console",
    element: (
      <ProtectedRoute>
        <DBConsole />
      </ProtectedRoute>
    ),
  },
  {
    path: "/access",
    element: (
      <ProtectedRoute>
        <Access />
      </ProtectedRoute>
    ),
  },
]);

export default function App() {
  return (
    <>
      {/* Toast notifications available globally */}
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            style: {
              background: "#dcfce7", // soft green
              color: "#166534", // dark green text
              borderLeft: "6px solid #16a34a", // accent border
              fontWeight: 500,
            },
          },
          error: {
            style: {
              background: "#fee2e2", // soft red
              color: "#991b1b", // dark red text
              borderLeft: "6px solid #dc2626",
              fontWeight: 500,
            },
          },
        }}
      />
    </>
  );
}
