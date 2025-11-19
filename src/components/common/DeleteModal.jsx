import React from "react";
import { BiX } from "react-icons/bi";

const DeleteModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onCancel,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
      <div className="bg-white w-80 sm:w-96 rounded-md p-6 shadow-xl relative">
        {/* Close */}
        <button
          className="cursor-pointer absolute right-3 top-3 text-gray-500 hover:text-black"
          onClick={onCancel}
        >
          <BiX size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        {/* Description */}
        <p className="text-gray-600 mt-2">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="cursor-pointer px-4 py-2 border rounded-md hover:bg-gray-100 text-gray-700"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`cursor-pointer px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 flex items-center gap-2 shadow-sm disabled:opacity-50`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
