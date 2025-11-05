import { useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axios from "../api/axios";
import { useState } from "react";
import Loader from "../components/common/Loader";
import { Link } from "react-router-dom";

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
        setError("Failed to fetch data");
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-800">Dashboard Overview</h2>
        {loader && <Loader />}
        {error ? (
          <div className="text-center py-6 text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to={"/doctors"}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-700">Doctors</h3>
                <p className="text-2xl font-bold text-blue-700 mt-2">
                  {data?.total_doctors ? data.total_doctors : "NA"}
                </p>
              </Link>
              <Link
                to={"/camps"}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-700">Camps</h3>
                <p className="text-2xl font-bold text-blue-700 mt-2">
                  {data?.total_camps ? data.total_camps : "NA"}
                </p>
              </Link>
              <Link
                to={"/users"}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-700">Users</h3>
                <p className="text-2xl font-bold text-blue-700 mt-2">
                  {data?.total_users ? data.total_users : "NA"}
                </p>
              </Link>
              <Link
                to={"/reports"}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-700">Reports</h3>
                <p className="text-2xl font-bold text-blue-700 mt-2">
                  {data?.total_reports ? data.total_reports : "NA"}
                </p>
              </Link>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
