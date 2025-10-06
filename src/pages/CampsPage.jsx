import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { campsData } from "../data/mockData";
import Modal from "../components/common/Modal";
import ImportForm from "../components/camps/ImportForm";
import ExportForm from "../components/camps/ExportForm";
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Health Camps</h2>
          <div className="flex gap-3">
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Attendees</th>
              </tr>
            </thead>
            <tbody>
              {campsData.map((camp) => (
                <tr
                  key={camp.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-2">{camp.name}</td>
                  <td className="px-4 py-2">{camp.location}</td>
                  <td className="px-4 py-2">{camp.date}</td>
                  <td className="px-4 py-2">{camp.attendees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={!!modalType} onClose={handleClose}>
        {modalType === "import" && (
          <ImportForm onClose={handleClose} onSubmit={handleImport} />
        )}
        {modalType === "export" && (
          <ExportForm onClose={handleClose} onSubmit={handleExport} />
        )}
        {modalType === "add" && (
          <AddForm onClose={handleClose} onSubmit={handleAdd} />
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default CampsPage;
