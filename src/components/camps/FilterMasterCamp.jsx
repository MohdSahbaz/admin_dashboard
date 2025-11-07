import { useEffect, useState } from "react";
import { BiX, BiDownload } from "react-icons/bi";
import Select from "react-select";
import api from "../../api/axios";
import toast from "react-hot-toast";

const FilterMasterCamp = ({
  dbTab, // "d2c" or "lloyd-db"
  filterType,
  setFilterType,
  filterState,
  setFilterState,
  setShowFilter,
  fetchMasterCamps,
}) => {
  const [divisionList, setDivisionList] = useState([]);
  const [stateList, setStateList] = useState([]);

  const [exportFormat, setExportFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchDivisions();
    fetchStates();
  }, [dbTab]);

  const fetchDivisions = async () => {
    try {
      const res = await api.get(`/admin/get-all-camp-plantype?db=${dbTab}`);
      setDivisionList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch divisions");
    }
  };

  const fetchStates = async () => {
    try {
      const res = await api.get(`/admin/get-all-camp-states?db=${dbTab}`);
      setStateList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch states");
    }
  };

  const handleClear = () => {
    setFilterType("");
    setFilterState("");
  };

  const handleFilteredExport = async () => {
    try {
      if (!filterType && !filterState) {
        return toast.error(
          "Please select at least one filter before exporting."
        );
      }

      setIsExporting(true);
      const format = exportFormat === "excel" ? "xlsx" : exportFormat;

      const params = new URLSearchParams({
        db: dbTab,
        format,
        division: filterType || "",
        state: filterState || "",
      });

      const url = `/admin/export-master-camps?${params.toString()}`;
      const response = await api.get(url, { responseType: "blob" });

      const disposition = response.headers["content-disposition"];
      let filename = `filtered_camps_${dbTab}.${format}`;
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Filtered camp data exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 sm:w-96 shadow-lg space-y-4 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => setShowFilter(false)}
          className="absolute right-3 top-3 text-gray-500 hover:text-black transition cursor-pointer"
        >
          <BiX size={22} />
        </button>

        <h3 className="text-xl font-semibold text-gray-800 text-center">
          Filter & Export Camps ({dbTab === "lloyd-db" ? "Lloyd DB" : "D2C"})
        </h3>

        {/* Plan Type */}
        <div
          className="space-y-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          }}
        >
          <label className="text-gray-700 text-sm font-medium">Plan Type</label>
          <Select
            value={
              filterType
                ? { label: filterType, value: filterType }
                : null
            }
            onChange={(e) => setFilterType(e?.value || "")}
            options={divisionList.map((d) => ({ label: d, value: d }))}
            placeholder="Select Plan Type"
            isSearchable
            className="text-sm"
          />
        </div>

        {/* State */}
        <div
          className="space-y-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          }}
        >
          <label className="text-gray-700 text-sm font-medium">State</label>
          <Select
            value={
              filterState ? { label: filterState, value: filterState } : null
            }
            onChange={(e) => setFilterState(e?.value || "")}
            options={stateList.map((s) => ({ label: s, value: s }))}
            placeholder="Select State"
            isSearchable
            className="text-sm"
          />
        </div>

        {/* Export Section */}
        <div className="border-t border-gray-200 pt-3 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Export Format
          </label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="csv">CSV (.csv)</option>
            <option value="xlsx">Excel (.xlsx)</option>
          </select>

          <button
            onClick={handleFilteredExport}
            disabled={isExporting}
            className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-2 py-2.5 rounded-md hover:scale-[1.02] transition shadow-sm disabled:opacity-50"
          >
            {isExporting ? (
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
              <>
                <BiDownload className="text-lg" />
                Export Filtered Data
              </>
            )}
          </button>
        </div>

        {/* Buttons */}
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
              fetchMasterCamps();
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

export default FilterMasterCamp;
