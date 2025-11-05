import { useState } from "react";
import { BiX } from "react-icons/bi";
import api from "../../api/axios";
import {
  masterDocColumns,
  selectedDocD2CDbColumns,
  selectedDocLloydDbColumns,
} from "../../config/doctorColumns";
import toast from "react-hot-toast";

const requiredFields = [
  "dr_code",
  "doctor_code",
  "dr_name",
  "division",
  "speciality",
  "category",
  "dr_type",
];

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
      if (columnsToValidate.includes(field) && !form[field].trim()) {
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

  const getColumnsForMode = () => {
    if (mode === "master") return masterDocColumns;
    if (mode === "selected-lloyd") return selectedDocLloydDbColumns;
    if (mode === "selected-d2c") return selectedDocD2CDbColumns;
    return [];
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
          Add {mode === "master" ? "Master Doctor" : "Selected Doctor"}
        </h3>

        {/* Render Inputs */}
        <div className="space-y-3">
          {getColumnsForMode().map((col) => (
            <div key={col} className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium">
                {col.replace(/_/g, " ")}
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

export default AddDoctor;
