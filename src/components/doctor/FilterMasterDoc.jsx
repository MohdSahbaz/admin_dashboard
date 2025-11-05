import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import Select from "react-select";
import api from "../../api/axios";
import toast from "react-hot-toast";

const FilterMasterDoc = ({
  filterDivision,
  setFilterDivision,
  filterSpeciality,
  setFilterSpeciality,
  setShowFilter,
  fetchMasterDoctors,
}) => {
  const [divisionList, setDivisionList] = useState([]);
  const [specialityList, setSpecialityList] = useState([]);

  useEffect(() => {
    fetchDivisions();
    fetchSpecialities();
  }, []);

  const fetchDivisions = async () => {
    try {
      const res = await api.get("/admin/get-all-divisions");
      setDivisionList(res.data.data || []);
    } catch (err) {
      toast.error("Error fetching divisions:", err);
    }
  };

  const fetchSpecialities = async () => {
    try {
      const res = await api.get("/admin/get-all-specialities");
      setSpecialityList(res.data.data || []);
    } catch (err) {
      toast.error("Error fetching specialities:", err);
    }
  };

  const handleClear = () => {
    setFilterDivision("");
    setFilterSpeciality("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg space-y-4 relative animate-fadeIn">
        <button
          onClick={() => setShowFilter(false)}
          className="absolute right-3 top-3 text-gray-500 hover:text-black transition cursor-pointer"
        >
          <BiX size={22} />
        </button>

        <h3 className="text-xl font-semibold text-gray-800 text-center">
          Filter Doctors
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

        {/* Speciality */}
        <div className="space-y-1">
          <label className="text-gray-700 text-sm font-medium">
            Speciality
          </label>
          <Select
            value={
              filterSpeciality
                ? { label: filterSpeciality, value: filterSpeciality }
                : null
            }
            onChange={(e) => setFilterSpeciality(e?.value || "")}
            options={specialityList.map((s) => ({ label: s, value: s }))}
            placeholder="Select Speciality"
            isSearchable
            className="text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={handleClear}
            className="border border-gray-400 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => setShowFilter(false)}
            className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowFilter(false);
              fetchMasterDoctors();
            }}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterMasterDoc;
