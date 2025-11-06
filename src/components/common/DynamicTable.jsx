import React from "react";
import Loader from "./Loader";

const DynamicTable = ({
  columns = [], // [{ key: "dr_name", label: "Doctor Name", sortable: true }]
  data = [],
  loading = false,
  error = null,
  onSort = () => {},
  sortBy = "",
  order = "asc",
  emptyMessage = "No records found",
  responsive = true,
  renderCell = null, // optional custom renderer
}) => {
  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️";
    return order === "asc" ? "⬆️" : "⬇️";
  };

  return (
    <div
      className={`relative w-full ${responsive ? "overflow-x-auto" : ""}`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 transparent",
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-600">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-center py-6 text-gray-500 italic">
          {emptyMessage}
        </div>
      ) : (
        <table className="min-w-full table-auto text-sm text-gray-700 hidden md:table">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr className="text-blue-900">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left font-semibold whitespace-nowrap ${
                    col.sortable ? "cursor-pointer" : ""
                  }`}
                  style={{ width: `${100 / columns.length}%` }}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  {col.label} {col.sortable && getSortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-blue-50"
                } transition hover:bg-blue-50`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-3">
                    {renderCell
                      ? renderCell(col.key, row[col.key], row)
                      : row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Mobile View */}
      <div className="space-y-4 md:hidden mt-4">
        {data.map((row, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-md shadow-sm p-4 transition hover:shadow-md"
          >
            {columns.map((col) => (
              <p key={col.key} className="text-sm text-gray-700">
                <span className="font-semibold text-gray-600">
                  {col.label}:
                </span>{" "}
                {renderCell
                  ? renderCell(col.key, row[col.key], row)
                  : row[col.key] || "—"}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicTable;
