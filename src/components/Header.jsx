import React from "react";
import { MdMenu } from "react-icons/md";

const Header = ({ userEmail, onMenuClick }) => {
  return (
    <header className="fixed w-full md:w-[calc(100vw-16rem)] top-0 right-0 z-40 flex items-center justify-between h-16 md:h-20 px-5 md:px-10 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
      {/* === Left Section === */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="md:hidden p-2.5 rounded-md hover:bg-gray-100 active:scale-95 transition-transform"
        >
          <MdMenu className="h-6 w-6 text-blue-700" />
        </button>

        {/* Greeting / Title */}
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-tight">
            Welcome back 👋
          </h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            Manage your dashboard efficiently
          </p>
        </div>
      </div>

      {/* === Right Section === */}
      <div className="flex items-center gap-3">
        {/* User Info */}
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="font-medium text-gray-800 text-sm">
            {userEmail || "admin@example.com"}
          </span>
          <span className="text-xs text-gray-500">Administrator</span>
        </div>

        {/* Profile Circle (Placeholder or Avatar) */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm select-none">
          {userEmail ? userEmail[0].toUpperCase() : "A"}
        </div>
      </div>
    </header>
  );
};

export default Header;
