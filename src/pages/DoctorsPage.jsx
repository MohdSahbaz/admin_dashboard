import DashboardLayout from "../components/DashboardLayout";
import { doctorsData } from "../data/mockData";

const DoctorsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-blue-800">Doctors</h2>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 sm:space-x-3">
            <button className="cursor-pointer px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition">
              Import
            </button>
            <button className="cursor-pointer px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition">
              Export
            </button>
            <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
              Add
            </button>
          </div>
        </div>

        {/* Table for desktop/tablet */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-max w-full bg-white rounded-lg shadow">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Specialization</th>
                <th className="px-4 py-2 text-left">Patients</th>
                <th className="px-4 py-2 text-left">Availability</th>
              </tr>
            </thead>
            <tbody>
              {doctorsData.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-2">{doctor.name}</td>
                  <td className="px-4 py-2">{doctor.specialization}</td>
                  <td className="px-4 py-2">{doctor.patients}</td>
                  <td className="px-4 py-2">
                    {doctor.available ? (
                      <span className="text-green-600 font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
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
    </DashboardLayout>
  );
};

export default DoctorsPage;
