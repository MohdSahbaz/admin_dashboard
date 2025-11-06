import { BiSearch } from "react-icons/bi";
import { FaDatabase } from "react-icons/fa6";

/**
 * Reusable Header Section Component
 *
 * Props:
 * - title: string → Page title (e.g. "Doctors")
 * - total: number → total count (optional)
 * - tabs: array → list of tab names (optional)
 * - selectedTab: string → currently active tab
 * - onTabChange: function(tabName)
 * - showTotal: boolean → whether to show total
 * - actions: array → buttons [{ label, icon, color, onClick }]
 * - showSearch: boolean
 * - searchPlaceholder: string
 * - searchValue, onSearchChange
 * - showDatabaseSelect: boolean
 * - dbValue, onDbChange
 * - databases: array → [{ label, value }]
 */

const HeaderSection = ({
  title,
  total,
  showTotal = false,
  tabs = [],
  selectedTab,
  onTabChange,
  actions = [],
  showSearch = false,
  searchPlaceholder = "",
  searchValue,
  onSearchChange,
  showDatabaseSelect = false,
  dbValue,
  onDbChange,
  databases = [],
}) => {
  return (
    <div className="w-full p-6 bg-white dark:bg-white text-black rounded-md border border-gray-100 dark:border-blue-800 transition">
      {/* === Title & Tabs === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-2xl font-bold text-blue-800">{title}</h2>

          {showTotal && (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-700 bg-gray-100 dark:bg-gray-200 px-3 py-1 rounded-sm">
              Total:{" "}
              <span className="font-semibold text-blue-700">{total}</span>
            </span>
          )}
        </div>

        {tabs.length > 0 && (
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`cursor-pointer hover:scale-105 px-5 py-2.5 rounded-md font-medium text-sm capitalize transition-all duration-200 ${
                  selectedTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* === Action Buttons === */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {actions.map(({ label, icon: Icon, color, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-md text-white shadow-sm hover:shadow-md transition transform hover:scale-105 ${color}`}
            >
              {Icon && <Icon className="w-4 h-4" />} {label}
            </button>
          ))}
        </div>
      )}

      {/* === Search & Database Select === */}
      {(showSearch || showDatabaseSelect) && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {showSearch && (
            <div className="relative w-full md:w-2/3">
              <BiSearch className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={onSearchChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {showDatabaseSelect && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <FaDatabase className="text-gray-900 w-5 h-5" />
              <select
                value={dbValue}
                onChange={(e) => onDbChange(e.target.value)}
                className="cursor-pointer border border-gray-300 rounded-md px-4 py-2.5 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {databases.map((db) => (
                  <option key={db.value} value={db.value}>
                    {db.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSection;
