import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddForm from "../components/users/AddForm";
import api from "../api/axios";
import Loader from "../components/common/Loader";

const UsersPage = () => {
  const [modalType, setModalType] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // search and sorting
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [order, setOrder] = useState("asc");

  // manual page input
  const [pageInput, setPageInput] = useState("");

  const handleClose = () => setModalType(null);

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoader(true);
    setError(null);
    try {
      const res = await api.get(
        `/admin/users?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}`
      );
      setUsersData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoader(false);
    }
  }, [page, limit, debouncedSearch, sortBy, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // sorting
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

  // export users
  const handleExport = async (format) => {
    try {
      const exportFormat = format === "excel" ? "xlsx" : format;
      const response = await api.get(
        `/admin/export-users?format=${exportFormat}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleImport = (file) => {
    console.log("Importing users file:", file);
  };

  const handleAdd = (data) => {
    console.log("Adding new user:", data);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-19rem)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:max-w-[calc(100vw-19rem)]">
          <h2 className="text-2xl font-bold text-blue-800">Users</h2>
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
              placeholder="Search by username, modifyby or createdby..."
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
        <div className="overflow-x-auto hidden sm:block max-w-[calc(100vw-19rem)]">
          {loader ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-6 text-red-600">{error}</div>
          ) : (
            <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
              <thead className="bg-blue-100 sticky top-0 z-10">
                <tr className="text-sm text-blue-900">
                  <th
                    onClick={() => handleSort("username")}
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                  >
                    Username {getSortIcon("username")}
                  </th>
                  <th
                    onClick={() => handleSort("createdby")}
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                  >
                    Created By {getSortIcon("createdby")}
                  </th>
                  <th
                    onClick={() => handleSort("createdon")}
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                  >
                    Created On {getSortIcon("createdon")}
                  </th>
                  <th
                    onClick={() => handleSort("modifyby")}
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                  >
                    Modified By {getSortIcon("modifyby")}
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="px-6 py-3 text-left font-semibold cursor-pointer"
                  >
                    Status {getSortIcon("status")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {usersData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  usersData.map((user, index) => (
                    <tr
                      key={user.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="px-6 py-3">{user.username}</td>
                      <td className="px-6 py-3">{user.createdby || "—"}</td>
                      <td className="px-6 py-3">
                        {new Date(user.createdon).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">{user.modifyby || "—"}</td>
                      <td className="px-6 py-3">
                        {user.isactive === 1 ? (
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

        {/* Mobile Cards */}
        <div className="space-y-4 sm:hidden mt-4">
          {loader && <Loader />}
          {error && (
            <div className="text-center py-6 text-red-600">{error}</div>
          )}
          {usersData.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              {error ? "" : "No users found."}
            </div>
          ) : (
            usersData.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 transition hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-blue-800">
                    {user.username}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isactive === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isactive === 1 ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-600">
                      Created By:
                    </span>{" "}
                    {user.createdby || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">
                      Created On:
                    </span>{" "}
                    {new Date(user.createdon).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">
                      Modified By:
                    </span>{" "}
                    {user.modifyby || "—"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {error !== null ||
          (usersData.length !== 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
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
                    if (!isNaN(target) && target >= 1 && target <= totalPages) {
                      setPage(target);
                    }
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
            title="Import Users Data"
          />
        )}
        {modalType === "export" && (
          <ExportForm
            onClose={handleClose}
            onSubmit={handleExport}
            title="Export Users Data"
          />
        )}
        {modalType === "add" && (
          <AddForm onClose={handleClose} onSubmit={handleAdd} />
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default UsersPage;
