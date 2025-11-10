import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddDoctor from "../components/doctor/AddDoctor";
import api from "../api/axios";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { BiDownload, BiPlus, BiUpload } from "react-icons/bi";
import FilterMasterDoc from "../components/doctor/FilterMasterDoc";
import FilterSelectedDoc from "../components/doctor/FilterSelectedDoc";
import { masterDocColumns } from "../config/doctorColumns";
import PaginationControls from "../components/common/PaginationControls";
import HeaderSection from "../components/common/HeaderSection";
import DynamicTable from "../components/common/DynamicTable";

const DoctorsPage = () => {
  const [selectedTab, setSelectedTab] = useState("master");
  const [dbTab, setDBTab] = useState("d2c");

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
    } catch {
      setError("Failed to fetch doctors");
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
    } catch {
      setError("Failed to fetch doctors");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    // only switch tab when DB changes
    setLoader(true);
    if (dbTab === "lloyd-db") {
      // delay tab switch slightly so it doesn't trigger old fetch
      setTimeout(() => setSelectedTab("selected"), 500);
    }

    setSortBy(selectedTab === "master" ? "dr_code" : "doctor_code");

    setPage(1);
    setPageInput(1);
    setSearch("");
  }, [dbTab, selectedTab]);

  useEffect(() => {
    if (!selectedTab) return;

    setDoctorData([]);
    setLoader(true);

    if (selectedTab === "master") {
      fetchMasterDoctors();
    } else {
      fetchSelectedDoctors();
    }
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
        `${res?.data?.message} \n Inserted: ${res.data.inserted} data`
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

      // ✅ Get filename from server
      const disposition = response.headers["content-disposition"];
      let filename = "download." + exportFormat;

      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      // ✅ Download file with correct name
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

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-20rem)]">
        {/* Header Section */}
        <HeaderSection
          title="Doctors"
          showTotal
          total={total}
          tabs={["master", "selected"].filter(
            (tab) => !(dbTab === "lloyd-db" && tab === "master")
          )}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          actions={[
            {
              label: "Import",
              icon: BiUpload,
              color: "bg-emerald-600 hover:bg-emerald-700",
              onClick: () => setModalType("import"),
            },
            {
              label: "Export",
              icon: BiDownload,
              color: "bg-amber-500 hover:bg-amber-600",
              onClick: () => setModalType("export"),
            },
            {
              label: "Add",
              icon: BiPlus,
              color: "bg-blue-600 hover:bg-blue-700",
              onClick: () => setModalType("add"),
            },
            {
              label: "Filter",
              color: "bg-purple-600 hover:bg-purple-700",
              onClick: () => setShowFilter(true),
            },
          ]}
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
          databases={[
            { label: "D2C", value: "d2c" },
            { label: "Lloyd DB", value: "lloyd-db" },
          ]}
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
                // // Custom cell rendering for specific columns
                // if (key === "status") {
                //   return (
                //     <span
                //       className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                //         value === "A"
                //           ? "bg-green-100 text-green-700"
                //           : "bg-red-100 text-red-700"
                //       }`}
                //     >
                //       {value === "A" ? "Active" : "Inactive"}
                //     </span>
                //   );
                // }
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
              ) : error ? (
                <div className="text-center py-6 text-red-600">{error}</div>
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
        />
      )}
    </DashboardLayout>
  );
};

export default DoctorsPage;
