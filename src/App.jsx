import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";
import DashboardPage from "./pages/DashboardPage";
import Camps from "./pages/CampsPage";
import Users from "./pages/UsersPage";
import Reports from "./pages/ReportsPage";
import DoctorsPage from "./pages/DoctorsPage";

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
]);

export default function App() {
  return <RouterProvider router={router} />;
}
