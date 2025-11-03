import { useState } from "react";
import toast from "react-hot-toast";

const ExportForm = ({ onClose, onSubmit, title = "Export Data" }) => {
  const [format, setFormat] = useState("csv");
  const [startFrom, setStartFrom] = useState("");
  const [recordCount, setRecordCount] = useState("");

  const [isExportingAll, setIsExportingAll] = useState(false);
  const [isExportingRange, setIsExportingRange] = useState(false);

  const handleSubmit = async (e, exportAll = false) => {
    e.preventDefault();

    if (!exportAll) {
      if (!startFrom || !recordCount) {
        toast.error(
          "Please enter both 'Start From' and 'Number of Records' before exporting."
        );
        return;
      }
    }

    if (exportAll) setIsExportingAll(true);
    else setIsExportingRange(true);

    try {
      await onSubmit(
        format,
        exportAll ? null : { offset: startFrom, limit: recordCount }
      );
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExportingAll(false);
      setIsExportingRange(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto sm:max-w-xl md:max-w-2xl">
      {/* Close Button */}
      <button
        onClick={onClose}
        disabled={isExportingAll || isExportingRange}
        className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>

      {/* Title */}
      <h3 className="text-xl font-bold text-green-700 mb-4 text-center sm:text-left">
        {title}
      </h3>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-5">
        {/* Format Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose File Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            disabled={isExportingAll || isExportingRange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
          >
            <option value="csv">CSV (.csv)</option>
            <option value="xlsx">Excel (.xlsx)</option>
          </select>
        </div>

        {/* Range Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start From (Record Number)
            </label>
            <input
              type="number"
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
              disabled={isExportingAll || isExportingRange}
              placeholder="e.g. 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: Enter 1 to start from the first record.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Records to Export
            </label>
            <input
              type="number"
              value={recordCount}
              onChange={(e) => setRecordCount(e.target.value)}
              disabled={isExportingAll || isExportingRange}
              placeholder="e.g. 100"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: Enter 100 to export 100 records.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isExportingAll || isExportingRange}
            className="cursor-pointer w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isExportingAll || isExportingRange}
              className="cursor-pointer w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isExportingAll ? (
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
                "Export All Data"
              )}
            </button>

            <button
              type="submit"
              disabled={isExportingAll || isExportingRange}
              className="cursor-pointer w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isExportingRange ? (
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
                "Export Selected Range"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExportForm;
