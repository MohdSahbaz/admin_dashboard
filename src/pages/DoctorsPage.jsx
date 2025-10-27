import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddForm from "../components/doctor/AddForm";
import api from "../api/axios";
import Loader from "../components/common/Loader";

const DoctorsPage = () => {
  const [modalType, setModalType] = useState(null);
  const [doctorData, setDoctorData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // search and sorting
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("dr_name");
  const [order, setOrder] = useState("asc");

  // page input for manual navigation
  const [pageInput, setPageInput] = useState("");

  const handleClose = () => setModalType(null);

  // debounce search to avoid multiple calls
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDoctors = useCallback(async () => {
    setLoader(true);
    setError(null);
    try {
      const response = await api.get(
        `/admin/doctors?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}`
      );
      setDoctorData(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError("Failed to fetch doctors");
    } finally {
      setLoader(false);
    }
  }, [page, limit, debouncedSearch, sortBy, order]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // toggle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️";
    return order === "asc" ? "⬆️" : "⬇️";
  };

  const handleImport = (file) => {
    console.log("Importing doctors file:", file);
  };

  const handleExport = async (format) => {
    try {
      const exportFormat = format === "excel" ? "xlsx" : format;

      const response = await api.get(
        `/admin/export-doctors?format=${exportFormat}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `doctors.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting doctors:", error);
    }
  };

  const handleAdd = (data) => {
    console.log("Adding new doctor:", data);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Doctors</h2>
          <div className="flex flex-wrap gap-2 sm:space-x-3">
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

        {/* Search bar */}
        <div className="relative w-full">
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
              placeholder="Search doctors by name, specialization, or state..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto hidden sm:block">
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
                    onClick={() => handleSort("dr_name")}
                  >
                    Name {getSortIcon("dr_name")}
                  </th>
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("speciality")}
                  >
                    Specialization {getSortIcon("speciality")}
                  </th>
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("no_patients")}
                  >
                    Patients {getSortIcon("no_patients")}
                  </th>
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("clinic_state")}
                  >
                    Clinic State {getSortIcon("clinic_state")}
                  </th>
                  <th
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Availability {getSortIcon("status")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {doctorData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  doctorData.map((doctor, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="px-6 py-3">{doctor.dr_name}</td>
                      <td className="px-6 py-3">{doctor.speciality}</td>
                      <td className="px-6 py-3">{doctor.no_patients || "—"}</td>
                      <td className="px-6 py-3">{doctor.clinic_state}</td>
                      <td className="px-6 py-3">
                        {doctor.status === "A" ? (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Cards (visible only on small screens) */}
        <div className="space-y-4 sm:hidden mt-4">
          {loader && <Loader />}
          {error && (
            <div className="text-center py-6 text-red-600">{error}</div>
          )}
          {doctorData.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              {error ? "" : "No doctors found."}
            </div>
          ) : (
            doctorData.map((doctor, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 transition hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-blue-800">
                    {doctor.dr_name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      doctor.status === "A"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {doctor.status === "A" ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-600">
                      Specialization:
                    </span>{" "}
                    {doctor.speciality || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">
                      Patients:
                    </span>{" "}
                    {doctor.no_patients || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">
                      Clinic State:
                    </span>{" "}
                    {doctor.clinic_state || "—"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {error !== null ||
          (doctorData.length !== 0 && (
            <>
              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {page} of {totalPages || 1}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                {/* Go to Page */}
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
                      if (
                        !isNaN(target) &&
                        target >= 1 &&
                        target <= totalPages
                      ) {
                        setPage(target);
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Go
                  </button>
                </div>

                {/* Limit Selector */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="limitSelect"
                    className="text-sm text-gray-600"
                  >
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
            </>
          ))}
      </div>

      {/* Modal */}
      <Modal isOpen={!!modalType} onClose={handleClose}>
        {modalType === "import" && (
          <ImportForm
            onClose={handleClose}
            onSubmit={handleImport}
            title="Import Doctors Data"
          />
        )}
        {modalType === "export" && (
          <ExportForm
            onClose={handleClose}
            onSubmit={handleExport}
            title="Export Doctors Data"
          />
        )}
        {modalType === "add" && (
          <AddForm onClose={handleClose} onSubmit={handleAdd} />
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default DoctorsPage;
