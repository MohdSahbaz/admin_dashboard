import { useState } from "react";
import { BiX } from "react-icons/bi";
import api from "../../api/axios";
import {
  masterCampColumnsD2C,
  masterCampColumnsLloyd,
} from "../../config/campColumns";
import toast from "react-hot-toast";
import { useEffect } from "react";

const requiredFields = ["dr_code", "plandate", "location", "state"];

// Fields to skip (auto-managed or backend-only)
const skipFields = [
  // "createdby",
  // "createdon",
  // "modifyby",
  // "modifyon",
  // "epochdate",
  // "isactive",
];

// Detect date-related fields (explicit, accurate names only)
const dateFields = [
  "plandate",
  "approvon",
  "exit_approvon",
  "modifyon",
  "createdon",
];

// 🧠 Main Component
const AddCamp = ({ mode = "d2c", onSuccess, onCancel }) => {
  const columns =
    mode === "d2c" ? masterCampColumnsD2C : masterCampColumnsLloyd;

  // Filter out skipped columns
  const filteredColumns = columns.filter(
    (col) => !skipFields.includes(col.toLowerCase().trim())
  );

  const [form, setForm] = useState(
    Object.fromEntries(filteredColumns.map((col) => [col, ""]))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    for (let field of requiredFields) {
      if (!form[field]?.trim()) {
        toast.error(`${field.replace(/_/g, " ").toUpperCase()} is required`);
        return;
      }
    }

    try {
      const url = `/admin/camp/master?db=${mode}`;
      await api.post(url, form);

      toast.success(
        `Camp added successfully to ${
          mode === "lloyd-db" ? "Lloyd" : "D2C"
        } DB!`
      );

      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add camp. Check console for details.");
    }
  };

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
      <div
        className="relative bg-white rounded-2xl w-[92%] md:w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn border border-gray-100 transition-all duration-300"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Add {mode === "lloyd-db" ? "Lloyd" : "D2C"} Camp
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
            Fill out the details below to add a new{" "}
            <span className="font-medium text-gray-700">
              {mode === "lloyd-db" ? "Lloyd" : "D2C"}
            </span>{" "}
            camp.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredColumns.map((col) => {
              const isDate = dateFields.includes(col.toLowerCase());
              return (
                <div key={col} className="flex flex-col">
                  <label className="text-gray-700 text-[13px] font-medium mb-1 tracking-wide">
                    {col.replace(/_/g, " ").toUpperCase()}
                    {requiredFields.includes(col) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  <input
                    type={isDate ? "date" : "text"}
                    name={col}
                    value={form[col]}
                    onChange={handleChange}
                    placeholder={
                      isDate ? "Select date" : `Enter ${col.replace(/_/g, " ")}`
                    }
                    className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm 
                      bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      outline-none transition duration-200 hover:border-gray-400 
                      placeholder:text-gray-400`}
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
              Add Camp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCamp;
