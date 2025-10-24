import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { usersData } from "../data/mockData";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddForm from "../components/users/AddForm";

const UsersPage = () => {
  const [modalType, setModalType] = useState(null);

  const handleClose = () => setModalType(null);

  const handleImport = (file) => {
    console.log("Importing users file:", file);
  };

  const handleExport = (format) => {
    console.log("Exporting users as:", format);
  };

  const handleAdd = (data) => {
    console.log("Adding new user:", data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Users</h2>

          {/* Action buttons */}
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

        {/* Users Table */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr className="text-sm text-blue-900">
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Role</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {usersData.map((user, index) => (
                <tr
                  key={user.id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-blue-100`}
                >
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.role}</td>
                  <td className="px-6 py-3">{user.registered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards for mobile */}
      <div className="space-y-4 sm:hidden">
        {usersData.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow p-4 space-y-2 border"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Name:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Role:</span>
              <span>{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Registered:</span>
              <span>{user.registered}</span>
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
