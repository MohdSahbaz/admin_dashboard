import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddCamp from "../components/camps/AddCamp";
import api from "../api/axios";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { BiDownload, BiPlus, BiUpload } from "react-icons/bi";
import FilterMasterCamp from "../components/camps/FilterMasterCamp";
import {
  masterCampColumnsD2C,
  masterCampColumnsLloyd,
} from "../config/campColumns";
import PaginationControls from "../components/common/PaginationControls";
import HeaderSection from "../components/common/HeaderSection";
import DynamicTable from "../components/common/DynamicTable";
import { useAccess } from "../context/AccessContext";

const CampsPage = () => {
  const { access } = useAccess();

  const [dbTab, setDBTab] = useState("");

  const [modalType, setModalType] = useState(null);
  const [campData, setCampData] = useState([]);
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

  const [pageInput, setPageInput] = useState("");

  // Filters
  const [masterType, setMasterType] = useState("");
  const [masterState, setMasterState] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const handleClose = () => setModalType(null);

  // Set default DB based on access.dbs
  useEffect(() => {
    if (!Array.isArray(access?.dbs) || access.dbs.length === 0) return;

    const firstDb = access.dbs[0].toLowerCase().replace(/\s+/g, "-");
    setDBTab(firstDb);
  }, [access?.dbs]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // fetch master camps (for current DB)
  const fetchMasterCamps = async () => {
    setLoader(true);
    setError(null);
    try {
      const url = `/admin/master-camps?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}&division=${masterType}&state=${masterState}&db=${dbTab}`;
      const response = await api.get(url);
      setCampData(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch camps");
    } finally {
      setLoader(false);
    }
  };

  // call when db changes
  useEffect(() => {
    setPage(1);
    setPageInput(1);
    setSearch("");
    setMasterType("");
    setMasterState("");
    fetchMasterCamps();
  }, [dbTab]);

  // main data fetch
  useEffect(() => {
    fetchMasterCamps();
  }, [page, limit, debouncedSearch, sortBy, order, masterType, masterState]);

  // sorting toggle
  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  // Import
  const handleImport = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = `/admin/import-camps?db=${dbTab}&type=master`;

      const res = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        `${res?.data?.message}\nInserted: ${res.data.inserted} records`
      );

      fetchMasterCamps();
    } catch (error) {
      toast.error(
        "Import failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  // Export
  const handleExport = async (format, paginationData = null) => {
    try {
      const exportFormat = format === "excel" ? "xlsx" : format;
      let query = `/admin/export-master-camps?format=${exportFormat}&db=${dbTab}`;

      if (paginationData && paginationData.offset && paginationData.limit) {
        query += `&offset=${paginationData.offset}&limit=${paginationData.limit}`;
      }

      const response = await api.get(query, { responseType: "blob" });

      const disposition = response.headers["content-disposition"];
      let filename = `camps-${dbTab}.${exportFormat}`;
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported camp data (${dbTab}) successfully!`);
    } catch {
      toast.error("Export failed. Please try again.");
    }
  };

  const totalPages = Math.ceil(total / limit);

  const can = (tabName) => access?.actions?.includes(tabName);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-20rem)]">
        {/* Header */}
        <HeaderSection
          title="Camps"
          showTotal
          total={total}
          tabs={["master"]}
          selectedTab="master"
          onTabChange={() => {}}
          actions={[
            // Disable Import and Add (commented out)
            // {
            //   label: "Import",
            //   icon: BiUpload,
            //   color: "bg-emerald-600 hover:bg-emerald-700",
            //   onClick: () => setModalType("import"),
            // },
            can("Export") && {
              label: "Export",
              icon: BiDownload,
              color: "bg-amber-500 hover:bg-amber-600",
              onClick: () => setModalType("export"),
            },
            // {
            //   label: "Add",
            //   icon: BiPlus,
            //   color: "bg-blue-600 hover:bg-blue-700",
            //   onClick: () => setModalType("add"),
            // },
            can("Filter") && {
              label: "Filter",
              color: "bg-purple-600 hover:bg-purple-700",
              onClick: () => setShowFilter(true),
            },
          ].filter(Boolean)}
          showSearch
          searchPlaceholder="Search camps by dr_code, location, or state..."
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          showDatabaseSelect
          dbValue={dbTab}
          onDbChange={setDBTab}
          // databases={[
          //   { label: "D2C", value: "d2c" },
          //   { label: "Lloyd DB", value: "lloyd-db" },
          // ]}
          databases={
            Array.isArray(access?.dbs)
              ? access.dbs.map((db) => ({
                  label: db, // original text
                  value: db.toLowerCase().replace(/\s+/g, "-"), // lowercase + hyphens
                }))
              : []
          }
        />

        {/* Master Table */}
        <DynamicTable
          columns={(dbTab === "d2c"
            ? masterCampColumnsD2C
            : masterCampColumnsLloyd
          ).map((col) => ({
            key: col,
            label: col.replace(/_/g, " ").toUpperCase(),
            sortable: [
              "dr_code",
              "plandate",
              "city",
              "plantime",
              "location",
              "state",
            ].includes(col),
          }))}
          data={campData}
          loading={loader}
          error={error}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          renderCell={(key, value) => value || "—"}
        />

        {/* Pagination */}
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          pageInput={pageInput}
          setPageInput={setPageInput}
          doctorData={campData}
          error={error}
        />
      </div>

      {/* Modal */}
      <Modal isOpen={!!modalType} onClose={handleClose}>
        {modalType === "import" && (
          <ImportForm
            onClose={handleClose}
            onSubmit={handleImport}
            title={`Import Camps Data (${dbTab.toUpperCase()})`}
          />
        )}
        {modalType === "export" && (
          <ExportForm
            onClose={handleClose}
            onSubmit={handleExport}
            title={`Export Camps Data (${dbTab.toUpperCase()})`}
          />
        )}
        {modalType === "add" && (
          <AddCamp
            mode={dbTab}
            onSuccess={() => {
              handleClose();
              fetchMasterCamps();
            }}
            onCancel={handleClose}
          />
        )}
      </Modal>

      {/* Filter */}
      {showFilter && (
        <FilterMasterCamp
          key={dbTab}
          dbTab={dbTab}
          filterType={masterType}
          setFilterType={setMasterType}
          filterState={masterState}
          setFilterState={setMasterState}
          setShowFilter={setShowFilter}
          fetchMasterCamps={fetchMasterCamps}
          canExport={can("Export")}
        />
      )}
    </DashboardLayout>
  );
};

export default CampsPage;
