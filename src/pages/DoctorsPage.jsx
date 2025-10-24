import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { doctorsData } from "../data/mockData";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddForm from "../components/doctor/AddForm";

const DoctorsPage = () => {
  const [modalType, setModalType] = useState(null);

  const handleClose = () => setModalType(null);

  const handleImport = (file) => {
    console.log("Importing doctors file:", file);
  };

  const handleExport = (format) => {
    console.log("Exporting doctors as:", format);
  };

  const handleAdd = (data) => {
    console.log("Adding new doctor:", data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Doctors</h2>

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

        {/* Table for desktop/tablet */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr className="text-sm text-blue-900">
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left font-semibold">Patients</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Availability
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {doctorsData.map((doctor, index) => (
                <tr
                  key={doctor.id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-blue-100`}
                >
                  <td className="px-6 py-3">{doctor.name}</td>
                  <td className="px-6 py-3">{doctor.specialization}</td>
                  <td className="px-6 py-3">{doctor.patients}</td>
                  <td className="px-6 py-3">
                    {doctor.available ? (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Available
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                        Unavailable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards for mobile */}
        <div className="space-y-4 sm:hidden">
          {doctorsData.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow p-4 space-y-2 border"
            >
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Name:</span>
                <span>{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  Specialization:
                </span>
                <span>{doctor.specialization}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Patients:</span>
                <span>{doctor.patients}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  Availability:
                </span>
                {doctor.available ? (
                  <span className="text-green-600 font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Unavailable
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
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
