import { useNavigate } from "react-router-dom";
import { MdLockOutline } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-md shadow-lg p-10 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <MdLockOutline className="w-10 h-10 text-gray-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800">403 Forbidden</h1>

        {/* Message */}
        <p className="text-gray-600 mt-3">
          You don’t have permission to view this page.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
          >
            Go Back
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg border text-red-600 border-red-600 hover:bg-red-50 transition cursor-pointer font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
