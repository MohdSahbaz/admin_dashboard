import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import HeaderSection from "../components/common/HeaderSection";
import DynamicTable from "../components/common/DynamicTable";
import PaginationControls from "../components/common/PaginationControls";
import Loader from "../components/common/Loader";

const UsersPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageInput, setPageInput] = useState("");

  // search + sort
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [order, setOrder] = useState("asc");

  // debounce for search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoader(true);
    setError(null);
    try {
      const res = await api.get(
        `/admin/users?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}`
      );
      setUsersData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoader(false);
    }
  }, [page, limit, debouncedSearch, sortBy, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // handle sorting
  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-20rem)]">
        {/* Header */}
        <HeaderSection
          title="Users"
          showTotal
          total={total}
          showSearch
          searchPlaceholder="Search by username, createdby, or modifiedby..."
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Users Table */}
        <DynamicTable
          columns={[
            { key: "username", label: "USERNAME", sortable: true },
            { key: "createdby", label: "CREATED BY", sortable: true },
            { key: "createdon", label: "CREATED ON", sortable: true },
            { key: "modifyby", label: "MODIFIED BY", sortable: true },
            { key: "isactive", label: "STATUS", sortable: true },
          ]}
          data={usersData}
          loading={loader}
          error={error}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          renderCell={(key, value, row) => {
            if (key === "isactive") {
              return value === 1 ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                  Inactive
                </span>
              );
            }
            if (key === "createdon") {
              return new Date(value).toLocaleDateString();
            }
            return value || "—";
          }}
        />

        {/* Pagination */}
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          pageInput={pageInput}
          setPageInput={setPageInput}
          doctorData={usersData}
          error={error}
        />
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
