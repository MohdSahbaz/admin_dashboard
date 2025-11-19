import { useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      {/* Card */}
      <div className="bg-white shadow-xl rounded-md p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-orange-100 text-orange-600 p-4 rounded-full shadow">
            <MdErrorOutline className="w-12 h-12" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-orange-600">404</h1>

        {/* Message */}
        <p className="text-gray-600 text-lg mt-3">
          Oops! The page you're looking for doesn't exist.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          {/* Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
