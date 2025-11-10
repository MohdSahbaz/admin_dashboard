import { useState } from "react";
import { BiX } from "react-icons/bi";
import api from "../../api/axios";
import {
  masterDocColumns,
  selectedDocD2CDbColumns,
  selectedDocLloydDbColumns,
} from "../../config/doctorColumns";
import toast from "react-hot-toast";
import { useEffect } from "react";

// 🚫 Fields to skip from form (system-managed or not editable)
const skipFields = [
  // "created_date",
  // // "createdby",
  // // "created_by",
  // "createdon",
  // // "modifyby",
  // "modifyon",
  // // "updated_by",
  // "updated_on",
  // "epochdate",
  // "isactive",
  // "status",
];

// ✅ Required fields for validation
const requiredFields = [
  "dr_code",
  "doctor_code",
  "dr_name",
  "division",
  "speciality",
  "category",
  "dr_type",
];

// 🗓️ Explicitly detect only true date fields
const dateFields = ["dob", "doa", "valid_upto", "created_date", "dr_add_date"];

// 🧠 Main Component
const AddDoctor = ({ mode, onSuccess, onCancel }) => {
  const [form, setForm] = useState(
    Object.fromEntries(
      [
        ...masterDocColumns,
        ...selectedDocD2CDbColumns,
        ...selectedDocLloydDbColumns,
      ].map((col) => [col, ""])
    )
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const columnsToValidate =
      mode === "master"
        ? masterDocColumns
        : mode === "selected-lloyd"
        ? selectedDocLloydDbColumns
        : selectedDocD2CDbColumns;

    for (let field of requiredFields) {
      if (columnsToValidate.includes(field) && !form[field]?.trim()) {
        toast.error(`${field.replace(/_/g, " ")} is required`);
        return;
      }
    }

    try {
      let url = "";
      let payload = {};

      if (mode === "master") {
        url = "/admin/doctor/master";
        payload = { ...form };
      } else if (mode === "selected-lloyd") {
        url = "/admin/doctor/selected-lloyd";
        payload = {
          doctor_code: form.doctor_code,
          division: form.division,
          dr_type: form.dr_type,
        };
      } else if (mode === "selected-d2c") {
        url = "/admin/doctor/selected-d2c";
        payload = {
          doctor_code: form.doctor_code,
          division: form.division,
        };
      }

      await api.post(url, payload);
      toast.success("Doctor added successfully!");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add doctor. Check console for details.");
    }
  };

  // 🧩 Get mode-specific columns & filter skipped ones
  const getColumnsForMode = () => {
    let columns = [];
    if (mode === "master") columns = masterDocColumns;
    else if (mode === "selected-lloyd") columns = selectedDocLloydDbColumns;
    else if (mode === "selected-d2c") columns = selectedDocD2CDbColumns;

    return columns.filter(
      (col) => !skipFields.includes(col.toLowerCase().trim())
    );
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
            {mode === "master" ? "Add Master Doctor" : "Add Selected Doctor"}
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
            Fill out the details below to register a new{" "}
            <span className="font-medium text-gray-700">
              {mode === "master" ? "Master" : "Selected"}
            </span>{" "}
            doctor.
          </p>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {getColumnsForMode().map((col) => {
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
              Add Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
