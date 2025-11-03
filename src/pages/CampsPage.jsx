import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddForm from "../components/camps/AddForm";
import api from "../api/axios";
import Loader from "../components/common/Loader";

const CampsPage = () => {
  const [modalType, setModalType] = useState(null);
  const [campData, setCampData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // search & sort
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("plandate");
  const [order, setOrder] = useState("asc");

  const [pageInput, setPageInput] = useState("");

  const handleClose = () => setModalType(null);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCamps = useCallback(async () => {
    setLoader(true);
    setError(null);
    try {
      const res = await api.get(
        `/admin/camps?page=${page}&limit=${limit}&search=${encodeURIComponent(
          debouncedSearch
        )}&sortBy=${sortBy}&order=${order}`
      );
      setCampData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Fetch camps error:", err);
      setError("Failed to fetch camps");
    } finally {
      setLoader(false);
    }
  }, [page, limit, debouncedSearch, sortBy, order]);

  useEffect(() => {
    fetchCamps();
  }, [fetchCamps]);

  // sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️";
    return order === "asc" ? "⬆️" : "⬇️";
  };

  // import handlers (frontend stub)
  const handleImport = (file) => {
    console.log("Importing camps file:", file);
    // implement upload flow if needed
  };

  // export (csv / xlsx)
  const handleExport = async (format) => {
    try {
      setExporting(true);
      const exportFormat = format === "excel" ? "xlsx" : format; // export form returns 'csv' or 'excel'
      const response = await api.get(
        `/admin/export-camps?format=${exportFormat}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `camps.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setModalType(null);
    } catch (err) {
      console.error("Export camps error:", err);
      setError("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleAdd = (data) => {
    console.log("Adding new camp:", data);
    // implement create call if needed
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-19rem)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:max-w-[calc(100vw-19rem)]">
          <h2 className="text-2xl font-bold text-blue-800">Camps</h2>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-3">
            <button
              onClick={() => setModalType("import")}
              className="cursor-pointer px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition"
            >
              Import
            </button>
            <button
              onClick={() => setModalType("export")}
              className="cursor-pointer px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition"
            >
              Export
            </button>
            <button
              onClick={() => setModalType("add")}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-fit sm:w-[50vw] sm:max-w-[100vw] md:max-w-[calc(100vw-19rem)]">
          <div className="flex items-center w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-500 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search camps by dr_code, city, state, plantype..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Table (desktop) */}
        <div className="hidden sm:block overflow-x-auto sm:max-w-[100vw] md:max-w-[calc(100vw-19rem)]">
          {loader ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-6 text-red-600">{error}</div>
          ) : (
            <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
              <thead className="bg-blue-100 sticky top-0 z-10">
                <tr className="text-sm text-blue-900">
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("dr_code")}
                  >
                    Dr Code {getSortIcon("dr_code")}
                  </th>
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("plandate")}
                  >
                    Plan Date {getSortIcon("plandate")}
                  </th>
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("plantime")}
                  >
                    Plan Time {getSortIcon("plantime")}
                  </th>
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("location")}
                  >
                    Location {getSortIcon("location")}
                  </th>
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("city")}
                  >
                    City {getSortIcon("city")}
                  </th>
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("state")}
                  >
                    State {getSortIcon("state")}
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Type</th>
                  <th className="px-6 py-3 text-left font-semibold">Remark</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Assigned
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Attended By
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    isactive
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-700">
                {campData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No camps found
                    </td>
                  </tr>
                ) : (
                  campData.map((camp, idx) => (
                    <tr
                      key={camp.id || idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="px-6 py-3">{camp.dr_code}</td>
                      <td className="px-6 py-3">
                        {new Date(camp.plandate).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-3">{camp.plantime}</td>
                      <td className="px-6 py-3">{camp.location}</td>
                      <td className="px-6 py-3">{camp.city}</td>
                      <td className="px-6 py-3">{camp.state}</td>
                      <td className="px-6 py-3">{camp.plantype}</td>
                      <td className="px-6 py-3">{camp.remark}</td>
                      <td className="px-6 py-3">{camp.assignto}</td>
                      <td className="px-6 py-3">{camp.attendedby}</td>
                      <td className="px-6 py-3">{camp.isactive}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 sm:hidden mt-4">
          {loader && <Loader />}
          {error && (
            <div className="text-center py-6 text-red-600">{error}</div>
          )}
          {campData.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No camps found.
            </div>
          ) : (
            campData.map((camp, idx) => (
              <div
                key={camp.id || idx}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 transition hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-blue-800">
                    {camp.dr_code || "—"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(camp.plandate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-600">Time:</span>{" "}
                    {camp.plantime || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">
                      Location:
                    </span>{" "}
                    {camp.location || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">
                      City / State:
                    </span>{" "}
                    {camp.city || "—"} / {camp.state || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">Type:</span>{" "}
                    {camp.plantype || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">
                      Assigned:
                    </span>{" "}
                    {camp.assignto || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">
                      Attended By:
                    </span>{" "}
                    {camp.attendedby || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">Remark:</span>{" "}
                    {camp.remark || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">
                      isactive:
                    </span>{" "}
                    {camp.isactive}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {error !== null ||
          (campData.length !== 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="pageInput" className="text-sm text-gray-600">
                  Go to page:
                </label>
                <input
                  id="pageInput"
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  className="w-20 px-2 py-1 border rounded"
                />
                <button
                  onClick={() => {
                    const target = parseInt(pageInput);
                    if (!isNaN(target) && target >= 1 && target <= totalPages)
                      setPage(target);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Go
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="limitSelect" className="text-sm text-gray-600">
                  Rows per page:
                </label>
                <select
                  id="limitSelect"
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 border rounded"
                >
                  <option value={10}>10</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      <Modal isOpen={!!modalType} onClose={handleClose}>
        {modalType === "import" && (
          <ImportForm
            onClose={handleClose}
            onSubmit={handleImport}
            title="Import Camps Data"
          />
        )}
        {modalType === "export" && (
          <ExportForm
            onClose={handleClose}
            onSubmit={handleExport}
            title="Export Camps Data"
          />
        )}
        {modalType === "add" && (
          <AddForm onClose={handleClose} onSubmit={handleAdd} />
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default CampsPage;
