import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { reportsData } from "../data/mockData";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddForm from "../components/report/AddForm";

const ReportsPage = () => {
  const [modalType, setModalType] = useState(null);

  const handleClose = () => setModalType(null);

  const handleImport = (file) => {
    console.log("Importing reports file:", file);
  };

  const handleExport = (format) => {
    console.log("Exporting reports as:", format);
  };

  const handleAdd = (data) => {
    console.log("Adding new report:", data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Reports</h2>

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

        {/* Reports Table */}
        <div className="overflow-x-auto sm:block hidden">
          <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr className="text-sm text-blue-900">
                <th className="px-6 py-3 text-left font-semibold">Title</th>
                <th className="px-6 py-3 text-left font-semibold">Type</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {reportsData.map((report, index) => (
                <tr
                  key={report.id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-blue-100`}
                >
                  <td className="px-6 py-3">{report.title}</td>
                  <td className="px-6 py-3">{report.type}</td>
                  <td className="px-6 py-3">{report.date}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        report.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards for mobile */}
      <div className="space-y-4 sm:hidden">
        {reportsData.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow p-4 space-y-2 border"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Title:</span>
              <span>{report.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Type:</span>
              <span>{report.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Date:</span>
              <span>{report.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Status:</span>
              <span
                className={`font-semibold ${
                  report.status === "Completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {report.status}
              </span>
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
            title="Import Reports Data"
          />
        )}
        {modalType === "export" && (
          <ExportForm
            onClose={handleClose}
            onSubmit={handleExport}
            title="Export Reports Data"
          />
        )}
        {modalType === "add" && (
          <AddForm onClose={handleClose} onSubmit={handleAdd} />
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default ReportsPage;
