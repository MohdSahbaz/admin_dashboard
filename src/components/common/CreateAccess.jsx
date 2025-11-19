import React, { useEffect, useState } from "react";
import { BiX, BiShow, BiHide, BiCopy, BiTrash } from "react-icons/bi";
import Select from "react-select";

const roleOptions = [
  { value: "administrator", label: "Administrator" },
  { value: "admin", label: "Admin" },
  { value: "pmt", label: "PMT" },
];

const accessOptions = {
  tabs: [
    "Dashboard",
    "Doctors",
    "Camps",
    "Users",
    "Access",
    "Doctors Location",
    "Reports",
    "Db Console",
  ],
  dbs: ["D2C", "Lloyd DB"],
  schemas: ["Master", "Selected"],
  actions: ["Import", "Export", "Add", "Filter"],
};

const CreateAccess = ({
  form,
  setForm,
  editMode,
  handleSubmitAccess,
  selectedAccess,
  setSelectedAccess,
  onCancel,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCheckboxChange = (section, value) => {
    setSelectedAccess((prev) => {
      const current = prev[section] || [];
      if (current.includes(value)) {
        return { ...prev, [section]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [section]: [...current, value] };
      }
    });
  };

  // disable body scroll when modal open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = original);
  }, []);

  // copy password to clipboard
  const copyPassword = async () => {
    try {
      if (!form.password) return;
      await navigator.clipboard.writeText(form.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  // clear password field
  const clearPassword = () => {
    setForm((prev) => ({ ...prev, password: "" }));
    setCopied(false);
  };

  const masterSelected = selectedAccess.schemas.includes("Master");
  const lloydSelected = selectedAccess.dbs.includes("Lloyd DB");

  useEffect(() => {
    if (!masterSelected) {
      setSelectedAccess((prev) => ({
        ...prev,
        tabs: prev.tabs.filter(
          (t) => t !== "Camps" && t !== "Users" && t !== "Doctors Location"
        ),
      }));
    }
  }, [masterSelected]);

  useEffect(() => {
    if (lloydSelected) {
      setSelectedAccess((prev) => ({
        ...prev,
        schemas: prev.schemas.includes("Selected")
          ? prev.schemas
          : [...prev.schemas, "Selected"], // auto add
      }));
    }
  }, [selectedAccess.dbs]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
      <div
        className="relative bg-white rounded-md w-[92%] md:w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn border border-gray-100 transition-all duration-300"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            {editMode ? "Edit Access" : "Create New Access"}
          </h2>
          <button
            onClick={onCancel}
            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition"
            aria-label="Close"
          >
            <BiX size={24} />
          </button>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmitAccess}
          className="p-6 md:p-8 space-y-6 text-sm text-gray-700"
        >
          {/* User Info */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-medium block mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 hover:border-gray-400"
                required
              />
            </div>

            <div>
              <label className="font-medium block mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 hover:border-gray-400"
                required
              />
            </div>
          </div>

          {/* Password with show/copy/clear actions */}
          {!editMode && (
            <div>
              <label className="font-medium block mb-1">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter password"
                  className="w-full pr-32 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 hover:border-gray-400"
                  required={!editMode}
                />

                {/* action buttons */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <BiHide size={18} /> : <BiShow size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={copyPassword}
                    className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                    title="Copy password"
                    aria-label="Copy password"
                  >
                    <BiCopy size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={clearPassword}
                    className="p-2 rounded-md hover:bg-gray-100 text-red-500"
                    title="Clear password"
                    aria-label="Clear password"
                  >
                    <BiTrash size={18} />
                  </button>
                </div>
              </div>

              {/* small helper row */}
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  {form.password ? (
                    <span>
                      Length:{" "}
                      <span className="font-medium">
                        {form.password.length}
                      </span>
                    </span>
                  ) : (
                    <span className="italic">No password set</span>
                  )}
                </div>

                <div className="text-xs text-emerald-600">
                  {copied ? "Copied!" : ""}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="font-medium block mb-1">Role</label>
            <Select
              options={roleOptions}
              value={form.role}
              onChange={(selected) => setForm({ ...form, role: selected })}
              placeholder="Select role"
              className="text-sm"
            />
          </div>

          {/* Access Permissions */}
          <div className="border rounded-md p-5 bg-gray-50">
            <h3 className="text-sm font-semibold mb-4 text-gray-700">
              Access Permissions
            </h3>
            {/* Select All Checkbox */}
            <label className="flex items-center gap-2 mb-4 cursor-pointer font-medium text-gray-800">
              <input
                type="checkbox"
                className="accent-blue-600 w-4 h-4"
                checked={
                  selectedAccess.tabs?.length === accessOptions.tabs.length &&
                  selectedAccess.dbs?.length === accessOptions.dbs.length &&
                  selectedAccess.schemas?.length ===
                    accessOptions.schemas.length &&
                  selectedAccess.actions?.length ===
                    accessOptions.actions.length
                }
                onChange={(e) => {
                  const checked = e.target.checked;

                  if (checked) {
                    // select all
                    setSelectedAccess({
                      tabs: [...accessOptions.tabs],
                      dbs: [...accessOptions.dbs],
                      schemas: [...accessOptions.schemas],
                      actions: [...accessOptions.actions],
                    });
                  } else {
                    // clear all
                    setSelectedAccess({
                      tabs: [],
                      dbs: [],
                      schemas: [],
                      actions: [],
                    });
                  }
                }}
              />
              Select All
            </label>

            <div className="grid grid-cols-4 gap-5">
              {/* Tabs Section */}
              <div>
                <h4 className="font-medium mb-2 text-gray-800">Tabs</h4>
                {accessOptions.tabs.map((tab) => {
                  const restricted = [
                    "Camps",
                    "Users",
                    "Doctors Location",
                  ].includes(tab);

                  return (
                    <label
                      key={tab}
                      className={`block text-gray-700 select-none mb-1 ${
                        !masterSelected && restricted
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={!masterSelected && restricted}
                        checked={selectedAccess.tabs?.includes(tab)}
                        onChange={() =>
                          (!restricted || masterSelected) &&
                          handleCheckboxChange("tabs", tab)
                        }
                        className="mr-2 accent-blue-600"
                      />
                      {tab}
                    </label>
                  );
                })}
              </div>

              {/* Databases Section */}
              <div>
                <h4 className="font-medium mb-2 text-gray-800">Databases</h4>
                {accessOptions.dbs.map((db) => (
                  <label
                    key={db}
                    className="block text-gray-700 cursor-pointer select-none mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccess.dbs?.includes(db)}
                      onChange={() => {
                        setSelectedAccess((prev) => {
                          const exists = prev.dbs.includes(db);

                          return {
                            ...prev,
                            dbs: exists
                              ? prev.dbs.filter((d) => d !== db)
                              : [...prev.dbs, db],
                          };
                        });
                      }}
                      className="mr-2 accent-blue-600"
                    />
                    {db}
                  </label>
                ))}
              </div>

              {/* Schema Section */}
              <div>
                <h4 className="font-medium mb-2 text-gray-800">Schemas</h4>
                {accessOptions.schemas.map((schema) => (
                  <label
                    key={schema}
                    className="block text-gray-700 cursor-pointer select-none mb-1"
                  >
                    <input
                      type="checkbox"
                      disabled={
                        schema === "Selected" &&
                        selectedAccess.dbs.includes("Lloyd DB") // prevent unchecking
                      }
                      checked={selectedAccess.schemas?.includes(schema)}
                      onChange={() => {
                        if (
                          schema === "Selected" &&
                          selectedAccess.dbs.includes("Lloyd DB")
                        ) {
                          return; // stop unchecking
                        }

                        setSelectedAccess((prev) => {
                          const exists = prev.schemas.includes(schema);

                          return {
                            ...prev,
                            schemas: exists
                              ? prev.schemas.filter((s) => s !== schema)
                              : [...prev.schemas, schema],
                          };
                        });
                      }}
                      className="mr-2 accent-blue-600"
                    />
                    {schema}
                  </label>
                ))}
              </div>

              {/* Actions Section */}
              <div>
                <h4 className="font-medium mb-2 text-gray-800">Actions</h4>
                {accessOptions.actions.map((action) => (
                  <label
                    key={action}
                    className="block text-gray-700 cursor-pointer select-none mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccess.actions?.includes(action)}
                      onChange={() => handleCheckboxChange("actions", action)}
                      className="mr-2 accent-blue-600"
                    />
                    {action}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer px-5 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition transform"
            >
              {editMode ? "Update Access" : "Create Access"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccess;
