import { useState, useEffect, useCallback } from "react";
import { FaDatabase, FaTable, FaPlay } from "react-icons/fa";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import HeaderSection from "../components/common/HeaderSection";
import QueryResultTable from "../components/common/QueryResultTable";
import PaginationControls from "../components/common/PaginationControls";

const DBConsole = () => {
  const [db, setDb] = useState("lloyd-db");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [pageInput, setPageInput] = useState("1");

  // --- Run Query with pagination ---
  const runQuery = useCallback(async () => {
    if (!query.trim()) {
      toast.error("Please enter a SQL query.");
      return;
    }

    setLoader(true);
    setError(null);
    setResult([]);

    try {
      const res = await api.post("/admin/query-console/run", {
        db,
        query,
        page,
        limit,
      });

      if (res.data.success) {
        const rows = res.data.data || [];
        const totalCount = res.data.total || rows.length;
        setResult(rows);
        setTotal(totalCount);

        if (rows.length > 0) {
          const firstRow = rows[0];
          const formattedColumns = Object.keys(firstRow).map((key) => ({
            key,
            label: key.replace(/_/g, " ").toUpperCase(),
          }));
          setColumns(formattedColumns);
        } else {
          setColumns([]);
        }

        toast.success(`Fetched ${rows.length} rows (Total: ${totalCount})`);
      } else {
        throw new Error(res.data.message || "Error executing query.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to execute query.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoader(false);
    }
  }, [db, query, page, limit]);

  // Auto-refetch on pagination change
  useEffect(() => {
    if (query.trim()) {
      runQuery();
    }
  }, [page, limit]);

  // --- Ctrl+Enter shortcut ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runQuery();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runQuery]);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-20rem)]">
        <HeaderSection
          title="PostgreSQL Query Console"
          showDatabaseSelect
          dbValue={db}
          onDbChange={setDb}
          databases={[
            { label: "Lloyd DB", value: "lloyd-db" },
            { label: "D2C", value: "d2c" },
          ]}
          icon={<FaDatabase className="text-blue-600" />}
        />

        {/* Query Box */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <textarea
            rows={6}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your SQL query (e.g. SELECT * FROM users;)"
          />

          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-gray-500">
              💡 Press <kbd className="border px-1">Ctrl</kbd> +{" "}
              <kbd className="border px-1">Enter</kbd> to run.
            </p>

            <button
              onClick={runQuery}
              disabled={loader}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium shadow-md transition disabled:opacity-50"
            >
              <FaPlay />
              {loader ? "Running..." : "Run Query"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 overflow-x-auto md:max-w-[calc(100vw-19rem)]">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <FaTable className="text-blue-600" />
            Query Results
            {total > 0 && (
              <span className="text-gray-500 text-sm">
                ({total} total rows)
              </span>
            )}
          </h2>

          {loader ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-6 text-red-600 font-medium">
              {error}
            </div>
          ) : result.length > 0 ? (
            <>
              <QueryResultTable columns={columns} data={result} />
              <PaginationControls
                page={page}
                totalPages={Math.ceil(total / limit)}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                pageInput={pageInput}
                setPageInput={setPageInput}
                doctorData={result}
                error={error}
              />
            </>
          ) : (
            <p className="text-gray-500 text-sm text-center py-5">
              No results to display.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DBConsole;
