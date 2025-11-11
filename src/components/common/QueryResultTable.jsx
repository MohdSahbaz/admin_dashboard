import { useState } from "react";

/**
 * Safe & dynamic SQL result table
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
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-300">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 border-b border-gray-300 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-blue-50 transition ${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-2 border-b border-gray-200 align-top max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                  title={String(row[col.key] ?? "")}
                >
                  <SafeValueRenderer value={row[col.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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
