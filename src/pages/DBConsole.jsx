import { useState, useEffect, useCallback, useRef } from "react";
import {
  FaDatabase,
  FaTable,
  FaPlay,
  FaCode,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
} from "react-icons/fa";

import { BiDownload } from "react-icons/bi";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import HeaderSection from "../components/common/HeaderSection";
import QueryResultTable from "../components/common/QueryResultTable";
import PaginationControls from "../components/common/PaginationControls";

// CodeMirror imports
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { githubDark } from "@uiw/codemirror-themes-all";
import { EditorView } from "@codemirror/view";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

// Prettier for SQL formatting
import prettier from "prettier/standalone";
import sqlPlugin from "prettier-plugin-sql";

const DBConsole = () => {
  const [db, setDb] = useState("lloyd-db");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loader, setLoader] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const [queryMessage, setQueryMessage] = useState("");
  const [tableSuggestions, setTableSuggestions] = useState([]);
  const exportRef = useRef();

  // --- Run Query ---
  const runQuery = useCallback(async () => {
    if (!query.trim()) return toast.error("Please enter a SQL query.");
    setLoader(true);
    setError(null);
    setResult([]);
    setQueryMessage("");
    setPageInput("1");
    setPage(1);

    try {
      const cleanedQuery = query.trim().replace(/;$/, "");
      const res = await api.post("/admin/query-console/run", {
        db,
        query: cleanedQuery,
        page,
        limit,
      });

      if (!res.data.success) throw new Error(res.data.message);

      // --- Handle SELECT/WITH queries ---
      if (["select", "with"].includes(res.data.type)) {
        const rows = res.data.data || [];
        const totalCount = res.data.total || rows.length;
        setResult(rows);
        setTotal(totalCount);

        if (rows.length > 0) {
          const formattedColumns = Object.keys(rows[0]).map((key) => ({
            key,
            label: key.replace(/_/g, " ").toUpperCase(),
          }));
          setColumns(formattedColumns);
        } else {
          setColumns([]);
        }

        setQueryMessage(res.data.message || "Query executed successfully.");
        toast.success(
          `${res.data.message} (${rows.length} rows shown, total ${totalCount})`
        );
      } else {
        // --- Handle non-SELECT queries ---
        setColumns([]);
        setResult([]);
        setTotal(0);

        const affected = res.data.affectedRows || 0;
        toast.success(res.data.message || `Query executed successfully.`);
        setQueryMessage(res.data.message || "Query executed successfully.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to execute query.";
      setError(msg);
      setQueryMessage(msg);
      setResult([]);
      toast.error(msg);
    } finally {
      setLoader(false);
    }
  }, [db, query, page, limit]);

  useEffect(() => {
    if (query.trim()) runQuery();
  }, [page, limit]);

  // --- Close export card on outside click ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExportOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Format SQL ---
  const handleFormatSQL = async () => {
    try {
      const formatted = await prettier.format(query, {
        parser: "sql",
        plugins: [sqlPlugin],
      });
      setQuery(formatted);
      toast.success("Query formatted!");
    } catch {
      toast.error("Formatting failed.");
    }
  };

  // --- Export Query ---
  const handleExport = async (format = "csv") => {
    if (!query.trim())
      return toast.error("Please enter a SQL query to export.");
    try {
      setExporting(true);
      const res = await api.post(
        "/admin/query-console/export",
        { db, query, format },
        { responseType: "blob" }
      );

      const contentDisposition = res.headers["content-disposition"];
      const filenameMatch = contentDisposition
        ? contentDisposition.match(/filename="?(.+)"?/)
        : null;
      const filename = filenameMatch
        ? filenameMatch[1]
        : `query-export.${format === "excel" ? "xlsx" : "csv"}`;

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Exported successfully (${format.toUpperCase()})`);
    } catch (err) {
      toast.error(
        "Export failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setExporting(false);
      setShowExportOptions(false);
    }
  };

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

  // --- Ctrl+Shift+F shortcut for formatting SQL ---
  useEffect(() => {
    const handleFormatShortcut = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "f"
      ) {
        e.preventDefault();
        handleFormatSQL();
      }
    };
    window.addEventListener("keydown", handleFormatShortcut);
    return () => window.removeEventListener("keydown", handleFormatShortcut);
  }, [handleFormatSQL]);

  // This loads all table names for the selected database.
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await api.get(`/admin/query-console/tables?db=${db}`);
        if (res.data.success) {
          setTableSuggestions(res.data.tables);
        }
      } catch (err) {
        console.error("Failed to fetch tables:", err.message);
      }
    };
    fetchTables();
  }, [db]);

  const sqlCompletion = useCallback(
    (context) => {
      const word = context.matchBefore(/[\w.]+/);
      if (!word || (word.from === word.to && !context.explicit)) return null;

      const filtered = tableSuggestions
        .filter((t) => t.toLowerCase().startsWith(word.text.toLowerCase()))
        .map((t) => ({
          label: t,
          type: "keyword",
          apply: t,
        }));

      return {
        from: word.from,
        options: filtered,
        validFor: /[\w.]+/,
      };
    },
    [tableSuggestions]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-20rem)]">
        {/* Header */}
        <HeaderSection
          title="PostgreSQL Query Console"
          subtitle="Run, format, and export queries across connected databases."
          showDatabaseSelect
          dbValue={db}
          onDbChange={setDb}
          databases={[
            { label: "Lloyd DB", value: "lloyd-db" },
            { label: "D2C", value: "d2c" },
          ]}
          icon={<FaDatabase className="text-blue-600" />}
        />

        {/* Query Editor */}
        <div className="bg-white rounded-md shadow-md border border-gray-200 relative">
          <div className="flex justify-between items-center px-5 py-3 border-b bg-gray-50">
            <h3 className="text-gray-700 font-semibold flex items-center gap-2">
              <FaCode className="text-blue-600" />
              SQL Editor
            </h3>
            <button
              onClick={handleFormatSQL}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
            >
              Format SQL
            </button>
          </div>

          <CodeMirror
            value={query}
            height="260px"
            theme={githubDark}
            extensions={[
              sql(),
              autocompletion({ override: [sqlCompletion] }),
              EditorView.lineWrapping,
            ]}
            onChange={(value) => setQuery(value)}
            className="font-mono text-sm"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              history: true,
              foldGutter: true,
              autocompletion: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              lineWrap: "on",
            }}
          />

          {/* Footer Controls (Run + Export + Tip) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 px-5 py-3 border-t bg-gray-50 relative">
            <p className="text-xs text-gray-500">
              💡 Press <kbd className="border px-1">Ctrl</kbd> +{" "}
              <kbd className="border px-1">Enter</kbd> to run query.
              <br />
              💡 Press <kbd className="border px-1">Ctrl</kbd> +{" "}
              <kbd className="border px-1">Shift</kbd> +{" "}
              <kbd className="border px-1">F</kbd> to format SQL.
            </p>

            <div className="flex gap-3 items-center" ref={exportRef}>
              {/* Export Button */}
              {result.length > 0 && (
                <div className="relative" ref={exportRef}>
                  <button
                    onClick={() => setShowExportOptions((prev) => !prev)}
                    disabled={exporting}
                    className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 focus:outline-none ${
                      exporting
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-600 text-white hover:from-cyan-600 hover:via-teal-600 hover:to-emerald-700 shadow-md hover:shadow-lg active:scale-[0.98]"
                    }`}
                  >
                    {exporting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <BiDownload className="text-lg" />
                    )}
                    {exporting ? "Exporting..." : "Export Data"}
                  </button>

                  {/* Export Card */}
                  {showExportOptions && (
                    <div className="absolute right-0 mt-2 w-52 backdrop-blur-lg bg-white/95 border border-gray-200 shadow-2xl rounded-md overflow-hidden z-[9999] animate-popUp">
                      <button
                        onClick={() => {
                          setShowExportOptions(false); // 👈 auto close before export
                          handleExport("csv");
                        }}
                        className="cursor-pointer w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 flex items-center gap-2 transition-all"
                      >
                        <BiDownload className="text-orange-500 text-lg" />
                        Export as CSV
                      </button>
                      <button
                        onClick={() => {
                          setShowExportOptions(false); // 👈 auto close before export
                          handleExport("excel");
                        }}
                        className="cursor-pointer w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 flex items-center gap-2 transition-all"
                      >
                        <BiDownload className="text-green-600 text-lg" />
                        Export as Excel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Run Query */}
              <button
                onClick={runQuery}
                disabled={loader}
                className={`cursor-pointer flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  loader
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-sm hover:shadow-md"
                }`}
              >
                {loader ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaPlay className="text-sm" />
                )}
                {loader ? "Running..." : "Run Query"}
              </button>
            </div>
          </div>
        </div>

        {/* Query Results */}
        <div className="bg-white rounded-md shadow-md border border-gray-200 p-5 overflow-x-auto md:max-w-[calc(100vw-19rem)]">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <FaTable className="text-blue-600" />
            Results
            {total > 0 && (
              <span className="text-gray-500 text-sm">
                ({total} total rows)
              </span>
            )}
          </h2>

          {loader ? (
            <Loader />
          ) : error ? (
            // 🔴 Error Card
            <div className="flex flex-col items-center justify-center text-center py-8 px-6 rounded-md border border-red-200 bg-red-50/80 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2 text-base font-semibold text-red-700 mb-2">
                <FaExclamationCircle className="text-red-600 text-lg" />
                {error}
              </div>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <FaClock className="text-gray-400" />
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ) : result.length > 0 ? (
            // 🧾 Data Table
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
          ) : queryMessage ? (
            // 🟢 Success / Info Card
            <div className="flex flex-col items-center justify-center text-center py-8 px-6 rounded-md border border-green-200 bg-green-50/80 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2 text-base font-semibold text-green-700 mb-2">
                <FaCheckCircle className="text-green-600 text-lg" />
                {queryMessage}
              </div>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <FaClock className="text-gray-400" />
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ) : (
            // ⚪ Default Placeholder
            <p className="text-gray-500 text-sm text-center py-5">
              No results yet. Run a query to see results here.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DBConsole;
