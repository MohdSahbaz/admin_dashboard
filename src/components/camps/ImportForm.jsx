import React, { useState } from "react";

const ImportForm = ({ onClose, onSubmit }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file");
    onSubmit(file);
    onClose();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
      <button
        onClick={onClose}
        className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>

      <h3 className="text-xl font-bold text-indigo-700 mb-4">Import Data</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload File (CSV/Excel)
          </label>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Import
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImportForm;
