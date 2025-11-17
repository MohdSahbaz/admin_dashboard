import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import HeaderSection from "../components/common/HeaderSection";
import Select from "react-select";
import api from "../api/axios";
import toast from "react-hot-toast";
import { BiX, BiFile, BiSpreadsheet, BiBarChartAlt2 } from "react-icons/bi";
import { useEffect } from "react";

const ReportsPage = () => {
  const [openModal, setOpenModal] = useState(null);
  const [division, setDivision] = useState("");
  const [loadingButton, setLoadingButton] = useState(null);
  const [backgroundLoading, setBackgroundLoading] = useState({
    ddc: false,
    opd: false,
    reminder: false,
  });
  const [exportControllers, setExportControllers] = useState({
    ddc: null,
    opd: null,
    reminder: null,
  });

  const [divisionList, setDivisionList] = useState([]);

  const reportLabels = {
    ddc: "DDC Report",
    opd: "OPD Report",
    reminder: "Reminder Report",
  };

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await api.get("/admin/get-all-divisions");

        const formatted = (res.data.data || []).map((division) => ({
          label: division,
          value: division,
        }));

        setDivisionList(formatted);
      } catch (err) {
        toast.error("Failed to fetch divisions");
      }
    };

    fetchDivisions();
  }, []);

  const handleExport = async (type, format) => {
    if (!division) return toast.error("Please select a division first!");

    setLoadingButton(format);
    setBackgroundLoading((prev) => ({ ...prev, [type]: true }));

    // Create cancel controller
    const controller = new AbortController();
    setExportControllers((prev) => ({ ...prev, [type]: controller }));

    try {
      const exportFormat = format === "excel" ? "xlsx" : "csv";

      const route =
        type === "ddc"
          ? "export-ddc-report"
          : type === "opd"
            ? "export-opd-report"
            : "export-reminder-report";

      const url = `/admin/${route}?format=${exportFormat}&division=${division}`;

      const response = await api.get(url, {
        responseType: "blob",
        validateStatus: (status) => status < 500,
        signal: controller.signal,
      });

      const contentType = response.headers["content-type"];

      // STOP: Error returned as JSON → DO NOT DOWNLOAD
      if (contentType && contentType.includes("application/json")) {
        const text = await response.data.text();
        const json = JSON.parse(text);
        toast.error(json.message || "No data found");
        return;
      }

      // SAFE TO DOWNLOAD
      let filename = `${type}-${division}.${exportFormat}`;
      const disp = response.headers["content-disposition"];
      if (disp?.includes("filename=")) {
        filename = disp.split("filename=")[1].replace(/"/g, "");
      }

      const blob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blob;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`${reportLabels[type]} exported successfully!`);

      if (openModal) {
        setOpenModal(null);
        setDivision("");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        toast.error("Export cancelled");
      } else if (err.response?.status === 404) {
        toast.error(`No data found for division ${division}`);
      } else {
        toast.error("Export failed");
      }
    } finally {
      setLoadingButton(null);
      setBackgroundLoading((prev) => ({ ...prev, [type]: false }));
      setExportControllers((prev) => ({ ...prev, [type]: null }));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 md:max-w-[calc(100vw-20rem)] pb-10">
        {/* Page Header */}
        <HeaderSection
          title="Reports"
          description="Export DDC, OPD, and Reminder reports in CSV or Excel format. Select a division and choose the report you want to download."
        />

        {/* Redesigned Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {Object.keys(reportLabels).map((key) => (
            <div
              key={key}
              onClick={() => {
                if (!backgroundLoading[key]) {
                  setOpenModal(key);
                  setDivision("");
                }
              }}
              className="
    cursor-pointer bg-white shadow-md rounded-xl 
    p-6 border border-gray-200 
    hover:shadow-xl hover:border-blue-500 
    transition transform hover:-translate-y-1
    relative
  "
            >
              {/* CARD LOADER */}
              {backgroundLoading[key] && (
                <div className="absolute inset-0 bg-white/70 flex flex-col justify-center items-center gap-2 rounded-xl">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-700"
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

                  <button
                    className="cursor-pointer mt-3 px-4 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportControllers[key]?.abort();
                    }}
                  >
                    Cancel Export
                  </button>
                </div>
              )}

              {/* Rest of card UI */}
              <div className="flex items-center gap-4 opacity-100">
                <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
                  <BiBarChartAlt2 size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {reportLabels[key]}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Click to export this report
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL - Styled same as FilterMasterDoc */}
        {openModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-80 sm:w-[380px] shadow-lg space-y-4 relative animate-fadeIn">
              {/* Close */}
              <button
                onClick={() => setOpenModal(null)}
                className="absolute right-3 top-3 text-gray-500 hover:text-black cursor-pointer transition"
              >
                <BiX size={22} />
              </button>

              <h3 className="text-xl font-semibold text-gray-800 text-center">
                Export {reportLabels[openModal]}
              </h3>

              {/* Division Selector */}
              <div className="space-y-1">
                <label className="text-gray-700 text-sm font-medium">
                  Division
                </label>
                <Select
                  options={divisionList}
                  placeholder="Select Division"
                  value={
                    division
                      ? divisionList.find((d) => d.value === division)
                      : null
                  }
                  onChange={(opt) => setDivision(opt?.value)}
                  className="cursor-pointer"
                />
              </div>

              {/* Export Buttons */}
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <button
                  disabled={!division || loadingButton !== null}
                  onClick={() => handleExport(openModal, "csv")}
                  className={`
            cursor-pointer w-full flex items-center justify-center gap-2 
            bg-blue-600 text-white py-2.5 rounded-md transition 
            hover:bg-blue-700 hover:scale-[1.02] shadow-sm
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
                >
                  {loadingButton === "csv" ? (
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
                      <BiFile size={18} />
                      Export CSV
                    </>
                  )}
                </button>

                <button
                  disabled={!division || loadingButton !== null}
                  onClick={() => handleExport(openModal, "excel")}
                  className={`
            cursor-pointer w-full flex items-center justify-center gap-2 
            bg-green-600 text-white py-2.5 rounded-md transition 
            hover:bg-green-700 hover:scale-[1.02] shadow-sm
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
                >
                  {loadingButton === "excel" ? (
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
                      <BiSpreadsheet size={18} />
                      Export Excel
                    </>
                  )}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setOpenModal(null);
                  setDivision("");
                  setLoadingButton(null);
                }}
                className="cursor-pointer text-gray-700 text-sm font-medium w-full py-2 mt-2 border rounded-md hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
