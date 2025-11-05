import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddForm from "../components/doctor/AddForm";
import api from "../api/axios";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { FaDatabase } from "react-icons/fa6";
import { BiDownload, BiPlus, BiSearch, BiUpload } from "react-icons/bi";
import FilterMasterDoc from "../components/doctor/FilterMasterDoc";
import FilterSelectedDoc from "../components/doctor/FilterSelectedDoc";

const DoctorsPage = () => {
  const [selectedTab, setSelectedTab] = useState("master");
  const [dbTab, setDBTab] = useState("d2c");

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

  // Master Filters
  const [masterDivision, setMasterDivision] = useState("");
  const [masterSpeciality, setMasterSpeciality] = useState("");

  // Selected Filters
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDrType, setSelectedDrType] = useState("");

  const [showFilter, setShowFilter] = useState(false);

  const handleClose = () => setModalType(null);

  // debounce search to avoid multiple calls
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // fetch master doctore data
  const fetchMasterDoctors = async () => {
    setLoader(true);
    setError(null);
    try {
      const url = `/admin/doctors?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}&division=${masterDivision}&speciality=${masterSpeciality}`;
      const response = await api.get(url);
      setDoctorData(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch {
      setError("Failed to fetch doctors");
    } finally {
      setLoader(false);
    }
  };

  // fetch selcted doctore data
  const fetchSelectedDoctors = async () => {
    setLoader(true);
    setError(null);
    try {
      const url = `/admin/selected-doctors?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}&db=${dbTab}&division=${selectedDivision}&dr_type=${selectedDrType}`;
      const response = await api.get(url);
      setDoctorData(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch {
      setError("Failed to fetch doctors");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    // only switch tab when DB changes
    setLoader(true);
    if (dbTab === "lloyd-db") {
      // delay tab switch slightly so it doesn't trigger old fetch
      setTimeout(() => setSelectedTab("selected"), 500);
    }

    setPage(1);
    setSearch("");
  }, [dbTab]);

  useEffect(() => {
    if (!selectedTab) return;

    setDoctorData([]);
    setLoader(true);

    if (selectedTab === "master") {
      fetchMasterDoctors();
    } else {
      fetchSelectedDoctors();
    }
  }, [selectedTab, page, limit, debouncedSearch, sortBy, order, dbTab]);

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

  const handleImport = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = `/admin/import-doctors?db=${dbTab}&type=${selectedTab}`;

      const res = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        `${res?.data?.message} \n Inserted: ${res.data.inserted} data`
      );

      setLoader(true);
      if (selectedTab === "master") fetchMasterDoctors();
      else fetchSelectedDoctors();
    } catch (error) {
      toast.error(
        "Import failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleExport = async (format, paginationData = null) => {
    try {
      const exportFormat = format === "excel" ? "xlsx" : format;

      let query =
        selectedTab === "master"
          ? `/admin/export-doctors?format=${exportFormat}`
          : `/admin/export-seltab-doctors?format=${exportFormat}&db=${dbTab}`;

      if (paginationData && paginationData.offset && paginationData.limit) {
        query += `&offset=${paginationData.offset}&limit=${paginationData.limit}`;
      }

      const response = await api.get(query, { responseType: "blob" });

      // ✅ Get filename from server
      const disposition = response.headers["content-disposition"];
      let filename = "download." + exportFormat;

      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      // ✅ Download file with correct name
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        paginationData
          ? `Exported ${paginationData.limit} records ( ${selectedTab}-${dbTab} )`
          : "All data exported successfully!"
      );
    } catch (error) {
      toast.error("Export failed. Please try again.");
      console.error(error);
    }
  };

  const handleAdd = (data) => {
    console.log("Adding new doctor:", data);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-19rem)]">
        {/* Header Section */}
        <div className="w-full p-6 bg-white dark:bg-white text-black rounded-sm border border-gray-100 dark:border-blue-800 transition">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-2xl font-bold text-blue-800">Doctors</h2>
              {/* ✅ Total Doctors Count */}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-700 bg-gray-100 dark:bg-gray-200 px-3 py-1 rounded-sm">
                Total:{" "}
                <span className="font-semibold text-blue-700">{total}</span>
              </span>
            </div>

            <div className="flex gap-3">
              {["master", "selected"]
                .filter((tab) => !(dbTab === "lloyd-db" && tab === "master")) // hide master
                .map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`cursor-pointer hover:scale-105 px-5 py-2.5 rounded-md font-medium text-sm capitalize transition-all duration-200 ${
                      selectedTab === tab
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setModalType("import")}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white rounded-md shadow-sm hover:shadow-md transition"
            >
              <BiUpload className="w-4 h-4" /> Import
            </button>
            <button
              onClick={() => setModalType("export")}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:scale-105 text-white rounded-md shadow-sm hover:shadow-md transition"
            >
              <BiDownload className="w-4 h-4" /> Export
            </button>

            <button
              onClick={() => setModalType("add")}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 text-white rounded-md shadow-sm hover:shadow-md transition"
            >
              <BiPlus className="w-4 h-4" /> Add
            </button>
            <button
              onClick={() => setShowFilter(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
            >
              Filter
            </button>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-2/3">
              <BiSearch className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search doctors by ${
                  selectedTab === "master"
                    ? "name, specialization, or state..."
                    : "code or division..."
                }`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Database Select */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <FaDatabase className="text-gray-900 w-5 h-5" />
              <select
                value={dbTab}
                onChange={(e) => setDBTab(e.target.value)}
                className="cursor-pointer border border-gray-300 rounded-md px-4 py-2.5 dark:bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="d2c">D2C</option>
                <option value="lloyd-db">Lloyd DB</option>
              </select>
            </div>
          </div>
        </div>

        {selectedTab === "master" ? (
          <>
            {/* Table */}
            <div className="overflow-x-auto hidden md:block md:max-w-[calc(100vw-19rem)]">
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
                        onClick={() => handleSort("division")}
                      >
                        Division {getSortIcon("division")}
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Patients
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
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-blue-50"
                          }
                        >
                          <td className="px-6 py-3">{doctor.dr_name}</td>
                          <td className="px-6 py-3">{doctor.speciality}</td>
                          <td className="px-6 py-3">{doctor.division}</td>
                          <td className="px-6 py-3">
                            {doctor.no_patients || "—"}
                          </td>
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
            <div className="space-y-4 md:hidden mt-4">
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
          </>
        ) : (
          <>
            {/* Selected Table */}
            <div className="overflow-x-auto  block md:max-w-[calc(100vw-19rem)]">
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
                        onClick={() => handleSort("doctor_code")}
                      >
                        Doctor Code {getSortIcon("doctor_code")}
                      </th>
                      <th
                        className="px-6 py-3 text-left font-semibold cursor-pointer"
                        onClick={() => handleSort("division")}
                      >
                        Division {getSortIcon("division")}
                      </th>
                      {dbTab === "lloyd-db" && (
                        <th className="px-6 py-3 text-left font-semibold cursor-pointer">
                          Dr Type
                        </th>
                      )}
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
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-blue-50"
                          }
                        >
                          <td className="px-6 py-3">{doctor.doctor_code}</td>
                          <td className="px-6 py-3">{doctor.division}</td>
                          {dbTab === "lloyd-db" && (
                            <td className="px-6 py-3">{doctor.dr_type}</td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile Cards (visible only on small screens) */}
            {/* <div className="space-y-4 hidden mt-4">
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
            </div> */}
          </>
        )}

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

      {/* Filter form */}
      {showFilter && selectedTab === "master" && (
        <FilterMasterDoc
          filterDivision={masterDivision}
          setFilterDivision={setMasterDivision}
          filterSpeciality={masterSpeciality}
          setFilterSpeciality={setMasterSpeciality}
          setShowFilter={setShowFilter}
          fetchMasterDoctors={fetchMasterDoctors}
        />
      )}

      {showFilter && selectedTab === "selected" && (
        <FilterSelectedDoc
          dbTab={dbTab}
          filterDivision={selectedDivision}
          setFilterDivision={setSelectedDivision}
          filterDrType={selectedDrType}
          setFilterDrType={setSelectedDrType}
          close={() => setShowFilter(false)}
          apply={() => {
            setPage(1);
            fetchSelectedDoctors();
            setShowFilter(false);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default DoctorsPage;
