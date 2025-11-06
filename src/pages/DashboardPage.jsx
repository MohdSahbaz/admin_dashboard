import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axios from "../api/axios";
import Loader from "../components/common/Loader";
import { Link } from "react-router-dom";
import { BiErrorCircle, BiSolidReport } from "react-icons/bi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaUserDoctor } from "react-icons/fa6";
import { GiCampingTent } from "react-icons/gi";
import { HiMiniUsers } from "react-icons/hi2";

const DashboardPage = () => {
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        setError(null);
        const response = await axios.get("/admin/dashboard");
        setData(response.data.data);
      } catch (error) {
        setError("Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    {
      title: "Doctors",
      value: data?.total_doctors ?? "NA",
      icon: <FaUserDoctor className="text-blue-600 text-3xl" />,
      link: "/doctors",
    },
    {
      title: "Camps",
      value: data?.total_camps ?? "NA",
      icon: <GiCampingTent className="text-indigo-600 text-3xl" />,
      link: "/camps",
    },
    {
      title: "Users",
      value: data?.total_users ?? "NA",
      icon: <HiMiniUsers className="text-green-600 text-3xl" />,
      link: "/users",
    },
    {
      title: "Reports",
      value: data?.total_reports ?? "NA",
      icon: <BiSolidReport className="text-orange-600 text-3xl" />,
      link: "/reports",
    },
  ];

  const chartData = [
    { name: "Doctors", value: Number(data?.total_doctors) || 0 },
    { name: "Camps", value: Number(data?.total_camps) || 0 },
    { name: "Users", value: Number(data?.total_users) || 0 },
    { name: "Reports", value: Number(data?.total_reports) || 0 },
  ];

  const COLORS = ["#2563eb", "#4f46e5", "#16a34a", "#f97316"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Overview of key statistics and data
          </p>
        </div>

        {/* Loader */}
        {loader && (
          <div className="flex justify-center items-center py-8">
            <Loader />
          </div>
        )}

        {/* Error */}
        {error && !loader && (
          <div className="flex flex-col justify-center items-center py-6 text-red-600">
            <BiErrorCircle className="text-4xl mb-2" />
            <p className="text-base font-medium">{error}</p>
          </div>
        )}

        {/* Dashboard Grid */}
        {!loader && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map((card, idx) => (
                <Link
                  key={idx}
                  to={card.link}
                  className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gray-50 rounded-md">
                        {card.icon}
                      </div>
                      <h3 className="text-gray-700 font-medium text-base">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-3xl font-bold text-gray-900 mt-3 group-hover:text-blue-600 transition-colors">
                    {card.value}
                  </p>
                </Link>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Bar Chart */}
              <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Summary Comparison
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow border border-gray-200 p-5 min-h-[320px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Overall Data Breakdown
                </h3>
                {chartData && chartData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                        isAnimationActive={true}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              ["#2563eb", "#4f46e5", "#16a34a", "#f97316"][
                                index % 4
                              ]
                            }
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    No data available for visualization
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
