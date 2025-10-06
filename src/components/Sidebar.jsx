import { NavLink } from "react-router-dom";
import { MdLogoDev, MdDashboard, MdLogout } from "react-icons/md";
import { GiCampingTent } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { HiMiniUsers } from "react-icons/hi2";
import { BiSolidReport } from "react-icons/bi";

const Sidebar = ({ onLogout, open, onClose }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-md transition-colors ${
      isActive
        ? "bg-blue-100 text-blue-800"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-800"
    }`;

  const iconClass = (isActive) =>
    `h-5 w-5 mr-3 ${isActive ? "text-blue-500" : "text-gray-400"}`;

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
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white text-gray-700 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 shadow-lg`}
      >
        {/* Header / Logo */}
        <div className="flex items-center px-7 h-20 border-b border-gray-200">
          {/* <img src={MdLogoDev} className="h-12 w-12" /> */}
          <MdLogoDev className="h-10 w-10 text-blue-700" />
          <span className="text-xl font-bold ml-2 text-blue-800">Dev</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavLink to="/" className={linkClass} end>
            {({ isActive }) => (
              <>
                <MdDashboard className={iconClass(isActive)} />
                Dashboard
              </>
            )}
          </NavLink>

          <NavLink to="/doctors" className={linkClass}>
            {({ isActive }) => (
              <>
                <FaUserDoctor className={iconClass(isActive)} />
                Doctors
              </>
            )}
          </NavLink>

          <NavLink to="/camps" className={linkClass}>
            {({ isActive }) => (
              <>
                <GiCampingTent className={iconClass(isActive)} />
                Camps
              </>
            )}
          </NavLink>

          <NavLink to="/users" className={linkClass}>
            {({ isActive }) => (
              <>
                <HiMiniUsers className={iconClass(isActive)} />
                Users
              </>
            )}
          </NavLink>

          <NavLink to="/reports" className={linkClass}>
            {({ isActive }) => (
              <>
                <BiSolidReport className={iconClass(isActive)} />
                Reports
              </>
            )}
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200">
          <button
            onClick={onLogout}
            className="flex items-center cursor-pointer w-full px-4 py-3 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <MdLogout className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
