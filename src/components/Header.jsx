import React from "react";
import { MdMenu } from "react-icons/md";

const Header = ({ userEmail, userName, onMenuClick }) => (
  <header className="sticky top-0 z-40 flex items-center justify-between h-20 px-4 md:px-8 border-b border-gray-200 bg-white shadow-sm">
    {/* Left: Hamburger + Title */}
    <div className="flex items-center space-x-4">
      {/* Hamburger - only on mobile */}
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <MdMenu className="h-6 w-6 text-blue-700" />
      </button>
      <h1 className="text-lg md:text-xl font-bold text-blue-800">
        Welcome back!
      </h1>
    </div>

    {/* Right: User info */}
    <div className="flex items-center">
      <div className="text-right mr-4 hidden sm:block">
        <p className="font-semibold text-sm text-blue-900">{userEmail}</p>
        <p className="text-xs text-gray-500">Administrator</p>
      </div>
    </div>
  </header>
);

export default Header;
