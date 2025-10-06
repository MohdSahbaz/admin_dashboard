import DashboardLayout from "../components/DashboardLayout";
import { reportsData } from "../data/mockData";

const ReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with buttons */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-800">Reports</h2>

          {/* Action buttons */}
          <div className="flex space-x-3">
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

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.map((report) => (
                <tr
                  key={report.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-2">{report.title}</td>
                  <td className="px-4 py-2">{report.type}</td>
                  <td className="px-4 py-2">{report.date}</td>
                  <td className="px-4 py-2">
                    {report.status === "Completed" ? (
                      <span className="text-green-600 font-semibold">
                        {report.status}
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        {report.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
