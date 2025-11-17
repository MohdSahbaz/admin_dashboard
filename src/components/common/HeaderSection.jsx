import { useState, useRef, useEffect } from "react";
import { BiSearch, BiChevronDown } from "react-icons/bi";
import { FaDatabase } from "react-icons/fa6";

const HeaderSection = ({
  title,
  description = "",
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
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasDescription = description && description.trim() !== "";

  return (
    <div className="w-full p-6 bg-white text-black rounded-md border border-gray-100 shadow-sm transition">
      {/* === Title & Tabs === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-blue-800">{title}</h1>

          {hasDescription && (
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* SHOW TOTAL EVEN WITH DESCRIPTION */}
          {showTotal && (
            <p className="text-sm text-gray-500 mt-1">
              Total: <span className="font-medium text-blue-600">{total}</span>
            </p>
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
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            <div className="relative w-full md:w-auto" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="flex items-center justify-between gap-2 w-full md:w-56 border border-gray-300 bg-gray-50 text-gray-800 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <FaDatabase className="text-blue-600 w-5 h-5" />
                  <span>
                    {databases.find((db) => db.value === dbValue)?.label ||
                      "Select Database"}
                  </span>
                </div>
                <BiChevronDown
                  className={`transition-transform duration-200 ${
                    openDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown && (
                <div className="absolute right-0 mt-2 w-full md:w-56 bg-white border border-gray-200 rounded-md shadow-xl z-50 animate-fadeIn">
                  {databases.map((db) => (
                    <button
                      key={db.value}
                      onClick={() => {
                        onDbChange(db.value);
                        setOpenDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                        dbValue === db.value
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {db.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSection;
