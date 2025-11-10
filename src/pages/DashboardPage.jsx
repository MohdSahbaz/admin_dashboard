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
import { FiMapPin } from "react-icons/fi";

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
      value: data?.total_doctors ?? "—",
      icon: <FaUserDoctor className="text-blue-600 text-3xl" />,
      link: "/doctors",
      color: "from-blue-50 to-blue-100",
    },
    {
      title: "Camps",
      value: data?.total_camps ?? "—",
      icon: <GiCampingTent className="text-indigo-600 text-3xl" />,
      link: "/camps",
      color: "from-indigo-50 to-indigo-100",
    },
    {
      title: "Users",
      value: data?.total_users ?? "—",
      icon: <HiMiniUsers className="text-green-600 text-3xl" />,
      link: "/users",
      color: "from-green-50 to-green-100",
    },
    {
      title: "Doctor Locations",
      value: data?.total_locations ?? "—",
      icon: <FiMapPin className="text-teal-600 text-3xl" />,
      link: "/doctor-locations",
      color: "from-teal-50 to-teal-100",
    },
    {
      title: "Reports",
      value: data?.total_reports ?? "—",
      icon: <BiSolidReport className="text-orange-600 text-3xl" />,
      link: "/reports",
      color: "from-orange-50 to-orange-100",
    },
  ];

  const chartData = [
    { name: "Doctors", value: Number(data?.total_doctors) || 0 },
    { name: "Camps", value: Number(data?.total_camps) || 0 },
    { name: "Users", value: Number(data?.total_users) || 0 },
    { name: "Reports", value: Number(data?.total_reports) || 0 },
    { name: "Locations", value: Number(data?.total_locations) || 0 }, // added
  ];

  const COLORS = ["#2563eb", "#4f46e5", "#16a34a", "#f97316", "#0ea5a4"]; // added teal

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold text-blue-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1 sm:mt-0">
            Live summary of your key performance data
          </p>
        </div>

        {/* Loader */}
        {loader && (
          <div className="flex justify-center items-center py-16">
            <Loader />
          </div>
        )}

        {/* Error */}
        {error && !loader && (
          <div className="flex flex-col justify-center items-center py-10 text-red-600">
            <BiErrorCircle className="text-5xl mb-2" />
            <p className="text-base font-medium">{error}</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!loader && !error && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {cards.map((card, idx) => (
                <Link
                  key={idx}
                  to={card.link}
                  className={`group bg-gradient-to-br ${card.color} rounded-md border border-gray-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transform transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-md shadow-sm">
                        {card.icon}
                      </div>
                      <h3 className="text-gray-700 font-medium text-base">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-4xl font-bold text-gray-900 mt-3 group-hover:text-blue-700 transition-colors">
                    {card.value}
                  </p>
                </Link>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
              {/* Bar Chart */}
              <div className="bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Summary Comparison
                  </h3>
                  <span className="text-xs text-gray-400">Last 30 days</span>
                </div>

                {chartData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
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
                ) : (
                  <div className="text-center text-gray-400 py-16">
                    No data available
                  </div>
                )}
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Overall Breakdown
                  </h3>
                  <span className="text-xs text-gray-400">Distribution</span>
                </div>

                {chartData.some((d) => d.value > 0) ? (
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
                      >
                        {chartData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-400 py-16">
                    No data available
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
