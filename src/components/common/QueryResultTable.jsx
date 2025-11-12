import { useState } from "react";

/**
 * Safe & responsive SQL result table
 * - Desktop: Table view
 * - Mobile: Card view (like DynamicTable)
 */
const QueryResultTable = ({ columns = [], data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-4">
        No results to display.
      </p>
    );
  }

  return (
    <div
      className="relative w-full overflow-x-auto"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
    >
      {/* Desktop Table */}
      <table className="w-full text-sm text-gray-700 hidden md:table border-collapse">
        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-left font-semibold text-gray-700 uppercase whitespace-nowrap tracking-wide border-b"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-blue-100 transition-all duration-300 ${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-5 py-3 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis border-b border-gray-100"
                  title={String(row[col.key] ?? "")}
                >
                  <SafeValueRenderer value={row[col.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden mt-4">
        {data.map((row, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition hover:shadow-md"
          >
            {columns.map((col) => (
              <p key={col.key} className="text-sm text-gray-700 mb-1">
                <span className="font-medium text-gray-600">{col.label}:</span>{" "}
                <SafeValueRenderer value={row[col.key]} />
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Handles safely rendering JSON, dates, numbers, strings, etc.
 */
const SafeValueRenderer = ({ value }) => {
  const [open, setOpen] = useState(false);

  if (value === null || value === undefined) return "—";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value))
    return new Date(value).toLocaleString();

  if (["string", "number", "boolean"].includes(typeof value))
    return String(value);

  if (typeof value === "object") {
    return (
      <div className="text-xs text-gray-700">
        <button
          onClick={() => setOpen(!open)}
          className="text-blue-600 hover:underline font-medium focus:outline-none"
        >
          {open ? "Hide JSON ▲" : "View JSON ▼"}
        </button>
        {open && (
          <pre className="bg-gray-50 mt-1 p-2 rounded-md text-xs overflow-auto max-h-60 border border-gray-200 text-gray-800 whitespace-pre-wrap">
            {JSON.stringify(value, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return String(value);
};

export default QueryResultTable;
