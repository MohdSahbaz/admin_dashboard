import { useState } from "react";
import { BiX } from "react-icons/bi";
import api from "../../api/axios";
import { masterLocationColumns } from "../../config/locationColumns";
import toast from "react-hot-toast";

// Fields to skip (auto-handled or system-managed)
// const skipFields = ["isactive"];
const skipFields = [];

// Required fields for validation
const requiredFields = ["dr_code", "division", "lat", "long"];

const AddLocation = ({ mode = "master", db = "d2c", onSuccess, onCancel }) => {
  // Initialize form state
  const [form, setForm] = useState(
    Object.fromEntries(
      masterLocationColumns
        .filter((col) => !skipFields.includes(col.toLowerCase()))
        .map((col) => [col, ""])
    )
  );

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async () => {
    for (let field of requiredFields) {
      if (!form[field]?.trim()) {
        toast.error(`${field.replace(/_/g, " ").toUpperCase()} is required`);
        return;
      }
    }

    try {
      const url = `/admin/add-location?db=${db}`;
      await api.post(url, form);
      toast.success("Location added successfully!");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add location. Check console for details.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50"
      style={{ overflow: "hidden" }} // prevent background scroll
    >
      <div
        className="relative bg-white rounded-md w-[92%] md:w-[700px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn border border-gray-100 transition-all duration-300"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Add New Location
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition"
          >
            <BiX size={24} />
          </button>
        </div>

        {/* Form Section */}
        <div className="p-6 md:p-8">
          <p className="text-sm text-gray-500 mb-6">
            Enter the details below to register a new{" "}
            <span className="font-medium text-gray-700">Doctor Location</span>.
          </p>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {masterLocationColumns
              .filter((col) => !skipFields.includes(col.toLowerCase().trim()))
              .map((col) => {
                const placeholderMap = {
                  dr_code: "Enter Doctor Code",
                  division: "Enter Division Name",
                  lat: "Enter Latitude (e.g., 19.0760)",
                  long: "Enter Longitude (e.g., 72.8777)",
                  isactive: "Enter 1 for active 0 for inactive",
                };

                return (
                  <div key={col} className="flex flex-col">
                    <label className="text-gray-700 text-[13px] font-medium mb-1 tracking-wide">
                      {col.replace(/_/g, " ").toUpperCase()}
                      {requiredFields.includes(col) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    <input
                      type={col === "lat" || col === "long" ? "number" : "text"}
                      step={col === "lat" || col === "long" ? "any" : undefined}
                      name={col}
                      value={form[col]}
                      onChange={handleChange}
                      placeholder={placeholderMap[col] || `Enter ${col}`}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm 
                      bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      outline-none transition duration-200 hover:border-gray-400 
                      placeholder:text-gray-400"
                    />
                  </div>
                );
              })}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mt-8 mb-6"></div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg 
                hover:bg-gray-200 transition cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg 
                font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition transform cursor-pointer"
            >
              Add Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLocation;
