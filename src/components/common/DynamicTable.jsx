import Loader from "./Loader";
import { BiSort, BiSortUp, BiSortDown } from "react-icons/bi";

const DynamicTable = ({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onSort = () => {},
  sortBy = "",
  order = "asc",
  emptyMessage = "No records found",
  responsive = true,
  renderCell = null,
}) => {
  const getSortIcon = (field) => {
    if (sortBy !== field) return <BiSort className="inline ml-1 opacity-50" />;
    return order === "asc" ? (
      <BiSortUp className="inline ml-1 text-blue-600" />
    ) : (
      <BiSortDown className="inline ml-1 text-blue-600" />
    );
  };

  return (
    <div
      className={`relative w-full ${
        responsive ? "overflow-x-auto" : ""
      } rounded-md border border-gray-200 bg-white shadow-sm`}
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
        <table className="w-full table-auto text-sm text-gray-700 hidden md:table">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-left font-semibold text-gray-700 uppercase whitespace-nowrap tracking-wide ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{ width: `${100 / columns.length}%` }}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-blue-200 transition-all duration-300"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3 whitespace-nowrap">
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
      <div className="space-y-3 md:hidden mt-4 px-2">
        {data.map((row, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition hover:shadow-md"
          >
            {columns.map((col) => (
              <p key={col.key} className="text-sm text-gray-700 mb-1">
                <span className="font-medium text-gray-600">{col.label}:</span>{" "}
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
