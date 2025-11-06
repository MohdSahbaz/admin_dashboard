import React from "react";
import Select from "react-select";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const PaginationControls = ({
  page,
  totalPages,
  setPage,
  limit,
  setLimit,
  pageInput,
  setPageInput,
  doctorData,
  error,
}) => {
  const limitOptions = [
    { value: 10, label: "10 / Page" },
    { value: 20, label: "20 / Page" },
    { value: 30, label: "30 / Page" },
    { value: 40, label: "40 / Page" },
    { value: 50, label: "50 / Page" },
  ];

  if (error !== null || !doctorData || doctorData.length === 0) return null;

  return (
    <div className="w-full mt-8 border border-blue-800 rounded-sm">
      <div className="bg-white border border-gray-200 rounded-md px-5 py-4 flex flex-col gap-5 md:gap-4">
        {/* === Top Row for Go to Page + Rows (Large and Tablet) === */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          {/* Go to Page Section */}
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <label htmlFor="pageInput" className="text-sm text-gray-700">
              Go to page:
            </label>
            <input
              id="pageInput"
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-16 text-center px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={() => {
                const target = parseInt(pageInput, 10);
                if (!isNaN(target) && target >= 1 && target <= totalPages) {
                  setPage(target);
                }
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              Go
            </button>
          </div>

          {/* Rows per Page Selector */}
          <div className="flex items-center gap-2 justify-center sm:justify-end">
            <label className="text-sm text-gray-700 whitespace-nowrap">
              Rows:
            </label>
            <div className="w-[110px]">
              <Select
                options={limitOptions}
                value={limitOptions.find((opt) => opt.value === limit)}
                onChange={(selected) => {
                  setLimit(parseInt(selected.value));
                  setPage(1);
                }}
                isSearchable={false}
                menuPlacement="top"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: "#d1d5db",
                    minHeight: "36px",
                    fontSize: "0.85rem",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#9ca3af" },
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                    borderRadius: "0.5rem",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#111827",
                    fontWeight: 500,
                  }),
                }}
              />
            </div>
          </div>
        </div>

        {/* === Pagination Buttons Section === */}
        <div className="flex flex-col sm:flex-row items-center justify-center text-gray-700 w-full">
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto justify-between gap-2 sm:gap-6 max-w-md sm:max-w-none mx-auto sm:mx-0">
            <div className="flex w-full sm:w-auto justify-between sm:justify-start items-center gap-2 sm:gap-0 sm:flex-1">
              {/* Left: Prev */}
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="flex items-center justify-center gap-1 px-5 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium disabled:opacity-50 transition"
              >
                <BiChevronLeft className="text-lg" /> Prev
              </button>

              {/* Center: Page Info (on desktop stays centered between buttons) */}
              <p className="hidden sm:block flex-1 mx-10 text-center text-sm font-medium whitespace-nowrap">
                Page <span className="text-blue-600 font-semibold">{page}</span>{" "}
                of{" "}
                <span className="text-blue-600 font-semibold">
                  {totalPages || 1}
                </span>
              </p>

              {/* Right: Next */}
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPages}
                className="flex items-center justify-center gap-1 px-5 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium disabled:opacity-50 transition"
              >
                Next <BiChevronRight className="text-lg" />
              </button>
            </div>
          </div>

          {/* On mobile, show centered page info below buttons */}
          <p className="sm:hidden mt-2 text-sm font-medium text-center whitespace-nowrap">
            Page <span className="text-blue-600 font-semibold">{page}</span> of{" "}
            <span className="text-blue-600 font-semibold">
              {totalPages || 1}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
