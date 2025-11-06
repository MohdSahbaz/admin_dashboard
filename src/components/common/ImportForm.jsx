import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { BiCloudUpload, BiX } from "react-icons/bi";
import { RxDragHandleDots2 } from "react-icons/rx"; // <-- Added drag icon

const ImportForm = ({ onClose, onSubmit, title = "Import Data" }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Smooth draggable setup
  const cardRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouseOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload a file");

    setLoading(true);
    try {
      await onSubmit(file);
      onClose();
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(
        "Import failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Start dragging when user holds the handle
  const startDrag = (e) => {
    dragging.current = true;
    mouseOffset.current = {
      x: e.clientX - pos.current.x,
      y: e.clientY - pos.current.y,
    };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  // Real-time move (no lag)
  const onDrag = (e) => {
    if (!dragging.current || !cardRef.current) return;
    pos.current = {
      x: e.clientX - mouseOffset.current.x,
      y: e.clientY - mouseOffset.current.y,
    };
    cardRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    cardRef.current.style.transition = "none";
  };

  // Stop drag
  const stopDrag = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    if (cardRef.current)
      cardRef.current.style.transition = "transform 0.1s ease-out";
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto transition-transform duration-300 ease-in-out"
      style={{ transform: "translate(0px, 0px)" }}
    >
      {/* === Header (with Drag Handle Button) === */}
      <div className="flex justify-between items-center mb-4">
        {/* Drag Handle (:: button) */}
        <button
          onMouseDown={startDrag}
          title="Drag to move"
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 transition"
        >
          <RxDragHandleDots2 size={22} />
        </button>

        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="text-gray-500 hover:text-gray-800 transition cursor-pointer"
        >
          <BiX size={24} />
        </button>
      </div>

      {/* === Upload Header Info === */}
      <div className="text-center mb-4">
        <div className="flex justify-center mb-3">
          {/* <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
            <BiCloudUpload size={28} />
          </div> */}
        </div>
        <p className="text-sm text-gray-500">
          Upload a <span className="font-medium text-indigo-600">CSV</span> or{" "}
          <span className="font-medium text-indigo-600">Excel</span> file to
          import data.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* === File Upload === */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400"
          }`}
        >
          <input
            id="fileInput"
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <BiCloudUpload
              size={40}
              className="text-indigo-500 mb-2 transition-transform group-hover:scale-105"
            />
            <span className="text-sm text-gray-600">
              {file ? (
                <span className="font-medium text-gray-800">
                  {file.name.length > 25
                    ? file.name.slice(0, 25) + "..."
                    : file.name}
                </span>
              ) : isDragging ? (
                <span className="font-medium text-indigo-600">
                  Drop file here
                </span>
              ) : (
                <>
                  <span className="font-medium text-indigo-600">
                    Click to browse
                  </span>{" "}
                  or drag and drop your file
                </>
              )}
            </span>
          </label>
        </div>

        {/* === Buttons === */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Importing...
              </>
            ) : (
              <>
                <BiCloudUpload size={18} />
                Import File
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImportForm;
