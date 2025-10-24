import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { campsData } from "../data/mockData";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddForm from "../components/camps/AddForm";

const CampsPage = () => {
  const [modalType, setModalType] = useState(null);

  const handleClose = () => setModalType(null);

  const handleImport = (file) => {
    console.log("Importing file:", file);
  };

  const handleExport = (format) => {
    console.log("Exporting as:", format);
  };

  const handleAdd = (data) => {
    console.log("Adding new camp:", data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Health Camps</h2>

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

        {/* Table */}
        <div className="overflow-x-auto sm:block hidden">
          <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr className="text-sm text-blue-900">
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Attendees</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {campsData.map((camp, index) => (
                <tr
                  key={camp.id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-blue-100`}
                >
                  <td className="px-6 py-3">{camp.name}</td>
                  <td className="px-6 py-3">{camp.location}</td>
                  <td className="px-6 py-3">{camp.date}</td>
                  <td className="px-6 py-3">{camp.attendees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards for mobile */}
      <div className="space-y-4 sm:hidden">
        {campsData.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-lg shadow p-4 space-y-2 border"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Name:</span>
              <span>{camp.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Location:</span>
              <span>{camp.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Date:</span>
              <span>{camp.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Attendees:</span>
              <span>{camp.attendees}</span>
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
