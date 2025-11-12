import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdLogout, MdKeyboardArrowDown } from "react-icons/md";
import { GiHospitalCross, GiCampingTent, GiSecurityGate } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { HiMiniUsers } from "react-icons/hi2";
import { BiSolidReport } from "react-icons/bi";
import { FiMapPin } from "react-icons/fi";
import logo from "../../src/assets/logo.png";

const Sidebar = ({ onLogout, open, onClose }) => {
  const [openSections, setOpenSections] = useState({
    main: true,
    management: true,
    reports: true,
    database: true,
  });

  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const linkClass = ({ isActive }) =>
    `relative flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group
    ${
      isActive
        ? "bg-blue-50 text-blue-800 font-semibold shadow-sm"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
    }`;

  const iconClass = (isActive) =>
    `h-5 w-5 mr-3 transition-colors duration-200 ${
      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
    }`;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:static h-screen inset-y-0 left-0 z-50 w-64 bg-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out
          ${
            open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 shadow-lg border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 px-6 h-20 border-b border-gray-200">
          <div className="p-2 rounded-md shadow-sm">
            {/* <GiHospitalCross className="h-7 w-7 text-blue-700" /> */}
            <img
              src={
                logo ||
                "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
              }
              alt="Lloyd Logo"
              className="relative z-10 h-10 drop-shadow-md"
            />
          </div>
          {/* <span clax */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {/* --- MAIN SECTION --- */}
          <div>
            <button
              onClick={() => toggleSection("main")}
              className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold uppercase text-gray-500 hover:text-blue-700 transition"
            >
              <span>Main</span>
              <MdKeyboardArrowDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSections.main ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSections.main ? "max-h-40" : "max-h-0"
              }`}
            >
              <div className="space-y-1 pl-1">
                <NavLink to="/" className={linkClass} end>
                  {({ isActive }) => (
                    <>
                      <MdDashboard className={iconClass(isActive)} />
                      Dashboard
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink to="/doctors" className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <FaUserDoctor className={iconClass(isActive)} />
                      Doctors
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink to="/camps" className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <GiCampingTent className={iconClass(isActive)} />
                      Camps
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            </div>
          </div>

          {/* --- MANAGEMENT SECTION --- */}
          <div>
            <button
              onClick={() => toggleSection("management")}
              className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold uppercase text-gray-500 hover:text-blue-700 transition"
            >
              <span>Management</span>
              <MdKeyboardArrowDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSections.management ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSections.management ? "max-h-32" : "max-h-0"
              }`}
            >
              <div className="space-y-1 pl-1">
                <NavLink to="/users" className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <HiMiniUsers className={iconClass(isActive)} />
                      Users
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink to="/access" className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <GiSecurityGate className={iconClass(isActive)} />
                      Access
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink to="/doctor-locations" className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <FiMapPin className={iconClass(isActive)} />
                      Doctor Locations
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            </div>
          </div>

          {/* --- REPORTS SECTION --- */}
          <div>
            <button
              onClick={() => toggleSection("reports")}
              className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold uppercase text-gray-500 hover:text-blue-700 transition"
            >
              <span>Reports</span>
              <MdKeyboardArrowDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSections.reports ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSections.reports ? "max-h-20" : "max-h-0"
              }`}
            >
              <div className="space-y-1 pl-1">
                <NavLink to="/reports" className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <BiSolidReport className={iconClass(isActive)} />
                      Reports
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            </div>
          </div>

          {/* --- DATABASE SECTION --- */}
          <div>
            <button
              onClick={() => toggleSection("database")}
              className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold uppercase text-gray-500 hover:text-blue-700 transition"
            >
              <span>Database</span>
              <MdKeyboardArrowDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSections.database ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSections.database ? "max-h-40" : "max-h-0"
              }`}
            >
              <div className="space-y-1 pl-1">
                {/* <NavLink to="/db-queries" className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <BiSolidReport className={iconClass(isActive)} />
                      Run Queries
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink to="/query-history" className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <FiMapPin className={iconClass(isActive)} />
                      Query History
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink> */}

                <NavLink to="/db-console" className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <BiSolidReport className={iconClass(isActive)} />
                      DB Console
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full cursor-pointer flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
          >
            <MdLogout className="h-5 w-5 mr-3 text-gray-400 group-hover:text-red-600" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
