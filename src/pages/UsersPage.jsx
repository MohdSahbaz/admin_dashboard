import DashboardLayout from "../components/DashboardLayout";
import { usersData } from "../data/mockData";

const UsersPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with buttons */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-800">Users</h2>

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

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Registered</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.registered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
