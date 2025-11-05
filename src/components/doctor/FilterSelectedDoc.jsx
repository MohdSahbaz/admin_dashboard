import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import Select from "react-select";
import api from "../../api/axios";
import toast from "react-hot-toast";

const FilterSelectedDoc = ({
  dbTab, // "d2c" or "lloyd-db"
  filterDivision,
  setFilterDivision,
  filterDrType,
  setFilterDrType,
  close,
  apply,
}) => {
  const [divisionList, setDivisionList] = useState([]);
  const [drTypeList, setDrTypeList] = useState([]);

  useEffect(() => {
    fetchDivisions();
    if (dbTab === "lloyd-db") fetchDoctorTypes();
  }, [dbTab]);

  const fetchDivisions = async () => {
    try {
      const res = await api.get(`/admin/selected-divisions?db=${dbTab}`);
      setDivisionList(res.data.data || []);
    } catch (err) {
      toast.error("Error fetching divisions:", err);
    }
  };

  const fetchDoctorTypes = async () => {
    try {
      const res = await api.get("/admin/selected-types");
      setDrTypeList(res.data.data || []);
    } catch (err) {
      toast.error("Error fetching dr_types:", err);
    }
  };

  const handleClear = () => {
    setFilterDivision("");
    setFilterDrType("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg space-y-4 relative animate-fadeIn">
        <button
          onClick={close}
          className="absolute right-3 top-3 text-gray-500 hover:text-black transition cursor-pointer"
        >
          <BiX size={22} />
        </button>

        <h3 className="text-xl font-semibold text-gray-800 text-center">
          Filter Selected Doctors
        </h3>

        {/* Division */}
        <div className="space-y-1">
          <label className="text-gray-700 text-sm font-medium">Division</label>
          <Select
            value={
              filterDivision
                ? { label: filterDivision, value: filterDivision }
                : null
            }
            onChange={(e) => setFilterDivision(e?.value || "")}
            options={divisionList.map((d) => ({ label: d, value: d }))}
            placeholder="Select Division"
            isSearchable
            className="text-sm"
          />
        </div>

        {/* Doctor Type → Only for Lloyd Selected */}
        {dbTab === "lloyd-db" && (
          <div className="space-y-1">
            <label className="text-gray-700 text-sm font-medium">
              Doctor Type
            </label>
            <Select
              value={
                filterDrType
                  ? { label: filterDrType, value: filterDrType }
                  : null
              }
              onChange={(e) => setFilterDrType(e?.value || "")}
              options={drTypeList.map((d) => ({ label: d, value: d }))}
              placeholder="Select Doctor Type"
              isSearchable
              className="text-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={handleClear}
            className="border border-gray-400 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={close}
            className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={apply}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSelectedDoc;
