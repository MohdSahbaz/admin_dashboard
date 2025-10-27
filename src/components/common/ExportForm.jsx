import React, { useState } from "react";

const ExportForm = ({ onClose, onSubmit, title = "Export Data" }) => {
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(format); // Trigger export function
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        disabled={loading}
        className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>

      {/* Title */}
      <h3 className="text-xl font-bold text-green-700 mb-4">{title}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Format Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
          >
            <option value="csv">CSV (.csv)</option>
            <option value="xlsx">Excel (.xlsx)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
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
                Exporting...
              </>
            ) : (
              "Export"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExportForm;
