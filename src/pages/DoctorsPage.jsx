import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddDoctor from "../components/doctor/AddDoctor";
import api from "../api/axios";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { BiDownload, BiErrorCircle, BiPlus, BiUpload } from "react-icons/bi";
import FilterMasterDoc from "../components/doctor/FilterMasterDoc";
import FilterSelectedDoc from "../components/doctor/FilterSelectedDoc";
import { masterDocColumns } from "../config/doctorColumns";
import PaginationControls from "../components/common/PaginationControls";
import HeaderSection from "../components/common/HeaderSection";
import DynamicTable from "../components/common/DynamicTable";
import { useAccess } from "../context/AccessContext";

const DoctorsPage = () => {
  const { access } = useAccess();

  const [selectedTab, setSelectedTab] = useState("");
  const [dbTab, setDBTab] = useState("");

  const [modalType, setModalType] = useState(null);
  const [doctorData, setDoctorData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // search and sorting
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("dr_code");
  const [order, setOrder] = useState("asc");

  // page input for manual navigation
  const [pageInput, setPageInput] = useState("");

  // Master Filters
  const [masterDivision, setMasterDivision] = useState("");
  const [masterSpeciality, setMasterSpeciality] = useState("");

  // Selected Filters
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDrType, setSelectedDrType] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const handleClose = () => setModalType(null);

  // when schemas load, set default tab
  useEffect(() => {
    if (!Array.isArray(access?.schemas)) return;
    if (access.schemas.length === 0) return;

    setSelectedTab(access.schemas[0].toLowerCase());
  }, [access?.schemas]);

  // Set default DB based on access.dbs
  useEffect(() => {
    if (!Array.isArray(access?.dbs) || access.dbs.length === 0) return;

    const firstDb = access.dbs[0].toLowerCase().replace(/\s+/g, "-");
    setDBTab(firstDb);
  }, [access?.dbs]);

  // debounce search to avoid multiple calls
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // fetch master doctore data
  const fetchMasterDoctors = async () => {
    setLoader(true);
    setError(null);
    try {
      const url = `/admin/doctors?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}&division=${masterDivision}&speciality=${masterSpeciality}`;
      const response = await api.get(url);
      setDoctorData(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch doctors");
    } finally {
      setLoader(false);
    }
  };

  // fetch selcted doctore data
  const fetchSelectedDoctors = async () => {
    setLoader(true);
    setError(null);
    try {
      const url = `/admin/selected-doctors?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}&db=${dbTab}&division=${selectedDivision}&dr_type=${selectedDrType}`;
      const response = await api.get(url);
      setDoctorData(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch doctors");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);

    // When switching to Lloyd DB, force "selected" tab immediately
    if (dbTab === "lloyd-db" && selectedTab !== "selected") {
      setSelectedTab("selected");
    }

    // Reset filters and pagination cleanly
    setSortBy(selectedTab === "master" ? "dr_code" : "doctor_code");
    setPage(1);
    setPageInput("1");
    setMasterDivision("");
    setMasterSpeciality("");
    setSelectedDivision("");
    setSelectedDrType("");
    setSearch("");
    setDoctorData([]); // Clear previous data instantly
  }, [dbTab]);

  useEffect(() => {
    if (!selectedTab) return;

    // Prevent fetching master data when Lloyd DB is active
    if (dbTab === "lloyd-db" && selectedTab === "master") {
      // Just ensure no wrong fetch happens
      setDoctorData([]);
      setLoader(false);
      return;
    }

    setDoctorData([]);
    setLoader(true);

    const fetchData = async () => {
      if (selectedTab === "master") await fetchMasterDoctors();
      else await fetchSelectedDoctors();
    };

    fetchData();
  }, [selectedTab, page, limit, debouncedSearch, sortBy, order, dbTab]);

  // toggle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const handleImport = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = `/admin/import-doctors?db=${dbTab}&type=${selectedTab}`;

      const res = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        `${res?.data?.message}\nInserted: ${res.data.inserted} records${
          res.data.skipped ? `\nSkipped: ${res.data.skipped} duplicates` : ""
        }`
      );

      setLoader(true);
      if (selectedTab === "master") fetchMasterDoctors();
      else fetchSelectedDoctors();
    } catch (error) {
      toast.error(
        "Import failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleExport = async (format, paginationData = null) => {
    try {
      const exportFormat = format === "excel" ? "xlsx" : format;

      let query =
        selectedTab === "master"
          ? `/admin/export-doctors?format=${exportFormat}`
          : `/admin/export-seltab-doctors?format=${exportFormat}&db=${dbTab}`;

      if (paginationData && paginationData.offset && paginationData.limit) {
        query += `&offset=${paginationData.offset}&limit=${paginationData.limit}`;
      }

      const response = await api.get(query, { responseType: "blob" });

      // Get filename from server
      const disposition = response.headers["content-disposition"];
      let filename = "download." + exportFormat;

      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      // Download file with correct name
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        paginationData
          ? `Exported ${paginationData.limit} records ( ${selectedTab}-${dbTab} )`
          : "All data exported successfully!"
      );
    } catch (error) {
      toast.error("Export failed. Please try again.");
    }
  };

  const totalPages = Math.ceil(total / limit);

  const hasD2C = access?.dbs?.some(
    (db) => db.toLowerCase().replace(/\s+/g, "-") === "d2c"
  );

  const can = (tabName) => access?.actions?.includes(tabName);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-20rem)]">
        {/* Header Section */}
        <HeaderSection
          title="Doctors"
          showTotal
          total={total}
          tabs={(Array.isArray(access?.schemas) ? access.schemas : [])
            .map((tab) => tab.toLowerCase())
            .filter((tab) => {
              // If Lloyd DB is NOT available → remove ONLY "selected"
              if (!hasD2C && tab === "master") {
                return false;
              }

              // if Lloyd DB is selected, hide master
              if (dbTab === "lloyd-db" && tab === "master") return false;

              return true;
            })}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          actions={[
            can("Import") && {
              label: "Import",
              icon: BiUpload,
              color: "bg-emerald-600 hover:bg-emerald-700",
              onClick: () => setModalType("import"),
            },
            can("Export") && {
              label: "Export",
              icon: BiDownload,
              color: "bg-amber-500 hover:bg-amber-600",
              onClick: () => setModalType("export"),
            },
            can("Add") && {
              label: "Add",
              icon: BiPlus,
              color: "bg-blue-600 hover:bg-blue-700",
              onClick: () => setModalType("add"),
            },
            can("Filter") && {
              label: "Filter",
              color: "bg-purple-600 hover:bg-purple-700",
              onClick: () => setShowFilter(true),
            },
          ].filter(Boolean)}
          showSearch
          searchPlaceholder={`Search doctors by ${
            selectedTab === "master"
              ? "name, specialization, or state..."
              : "code or division..."
          }`}
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          showDatabaseSelect
          dbValue={dbTab}
          onDbChange={setDBTab}
          databases={
            Array.isArray(access?.dbs)
              ? access.dbs.map((db) => ({
                  label: db, // original text
                  value: db.toLowerCase().replace(/\s+/g, "-"), // lowercase + hyphens
                }))
              : []
          }
        />

        {/*  Master Table */}
        {selectedTab === "master" ? (
          <>
            {/* Table */}
            <DynamicTable
              columns={masterDocColumns.map((col) => ({
                key: col,
                label: col.replace(/_/g, " ").toUpperCase(),
                sortable: [
                  "dr_code",
                  "dr_name",
                  "speciality",
                  "division",
                  "clinic_state",
                  "status",
                ].includes(col),
              }))}
              data={doctorData}
              loading={loader}
              error={error}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
              renderCell={(key, value, row) => {
                return value || "—";
              }}
            />
          </>
        ) : (
          <>
            {/* Selected Table */}
            <div className="overflow-x-auto block md:max-w-[calc(100vw-19rem)]">
              {loader ? (
                <Loader />
              ) : (
                <DynamicTable
                  columns={[
                    {
                      key: "doctor_code",
                      label: "DOCTOR CODE",
                      sortable: true,
                    },
                    { key: "division", label: "DIVISION", sortable: true },
                    ...(dbTab === "lloyd-db"
                      ? [{ key: "dr_type", label: "DR TYPE", sortable: true }]
                      : []),
                  ]}
                  data={doctorData}
                  loading={loader}
                  error={error}
                  sortBy={sortBy}
                  order={order}
                  onSort={handleSort}
                />
              )}
            </div>
          </>
        )}

        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          pageInput={pageInput}
          setPageInput={setPageInput}
          doctorData={doctorData}
          error={error}
        />
      </div>

      {/* Modal */}
      <Modal isOpen={!!modalType} onClose={handleClose}>
        {modalType === "import" && (
          <ImportForm
            onClose={handleClose}
            onSubmit={handleImport}
            title="Import Doctors Data"
          />
        )}
        {modalType === "export" && (
          <ExportForm
            onClose={handleClose}
            onSubmit={handleExport}
            title="Export Doctors Data"
          />
        )}
        {modalType === "add" && (
          <AddDoctor
            mode={
              selectedTab === "master"
                ? "master"
                : dbTab === "lloyd-db"
                  ? "selected-lloyd"
                  : "selected-d2c"
            }
            onSuccess={() => {
              handleClose();
              if (selectedTab === "master") fetchMasterDoctors();
              else fetchSelectedDoctors();
            }}
            onCancel={handleClose}
          />
        )}
      </Modal>

      {/* Filter form */}
      {showFilter && selectedTab === "master" && (
        <FilterMasterDoc
          filterDivision={masterDivision}
          setFilterDivision={setMasterDivision}
          filterSpeciality={masterSpeciality}
          setFilterSpeciality={setMasterSpeciality}
          setShowFilter={setShowFilter}
          fetchMasterDoctors={fetchMasterDoctors}
          canExport={can("Export")}
        />
      )}

      {showFilter && selectedTab === "selected" && (
        <FilterSelectedDoc
          dbTab={dbTab}
          filterDivision={selectedDivision}
          setFilterDivision={setSelectedDivision}
          filterDrType={selectedDrType}
          setFilterDrType={setSelectedDrType}
          close={() => setShowFilter(false)}
          apply={() => {
            setPage(1);
            fetchSelectedDoctors();
            setShowFilter(false);
          }}
          canExport={can("Export")}
        />
      )}
    </DashboardLayout>
  );
};

export default DoctorsPage;
