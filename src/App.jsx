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
// import DoctorLocation from "./pages/DoctorLocation";

const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
  {
    path: "/",
    element: (
      <ProtectedRoute role={"Admin"}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctors",
    element: (
      <ProtectedRoute role={"Admin"}>
        <DoctorsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/camps",
    element: (
      <ProtectedRoute role={"Admin"}>
        <Camps />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute role={"Admin"}>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute role={"Admin"}>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor-locations",
    element: (
      <ProtectedRoute role={"Admin"}>
        <DoctorLocation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/db-console",
    element: (
      <ProtectedRoute role={"Admin"}>
        <DBConsole />
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
