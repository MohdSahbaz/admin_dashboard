import { useState } from "react";
import { BiX } from "react-icons/bi";
import api from "../../api/axios";
import { masterCampColumns } from "../../config/campColumns";
import toast from "react-hot-toast";

const requiredFields = ["dr_code", "plandate", "location", "state"];

const AddCamp = ({ mode = "d2c", onSuccess, onCancel }) => {
  const [form, setForm] = useState(
    Object.fromEntries(masterCampColumns.map((col) => [col, ""]))
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

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-xl w-96 shadow-lg max-h-[90vh] relative animate-fadeIn overflow-y-auto transition-all duration-300"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 text-gray-500 hover:text-black transition cursor-pointer"
        >
          <BiX size={22} />
        </button>

        <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Add {mode === "lloyd-db" ? "Lloyd" : "D2C"} Camp
        </h3>

        {/* Render Inputs */}
        <div className="space-y-3">
          {masterCampColumns.map((col) => (
            <div key={col} className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium">
                {col.replace(/_/g, " ").toUpperCase()}
                {requiredFields.includes(col) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <input
                type="text"
                name={col}
                value={form[col]}
                onChange={handleChange}
                placeholder={col.replace(/_/g, " ")}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4">
          <button
            onClick={onCancel}
            className="border border-gray-400 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="col-span-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCamp;
