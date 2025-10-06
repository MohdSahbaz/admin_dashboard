import DashboardLayout from "../components/DashboardLayout";
import { dashboardData } from "../data/mockData";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-800">Dashboard Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {item.title}
              </h3>
              <p className="text-2xl font-bold text-blue-700 mt-2">
                {item.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
