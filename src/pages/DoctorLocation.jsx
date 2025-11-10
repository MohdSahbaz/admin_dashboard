import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddLocation from "../components/location/AddLocation";
import api from "../api/axios";
import toast from "react-hot-toast";
import { BiDownload, BiPlus, BiUpload } from "react-icons/bi";
import FilterMasterLocation from "../components/location/FilterMasterLocation";
import { masterLocationColumns } from "../config/locationColumns";
import PaginationControls from "../components/common/PaginationControls";
import HeaderSection from "../components/common/HeaderSection";
import DynamicTable from "../components/common/DynamicTable";

const DoctorLocation = () => {
  const [modalType, setModalType] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // Search & sorting
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("dr_code");
  const [order, setOrder] = useState("asc");

  const [pageInput, setPageInput] = useState("");

  // Filters
  const [filterState, setFilterState] = useState("");
  const [filterDivision, setFilterDivision] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const handleClose = () => setModalType(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch master locations
  const fetchMasterLocations = async () => {
    setLoader(true);
    setError(null);
    try {
      const url = `/admin/master-locations?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}&division=${filterDivision}&state=${filterState}`;
      const res = await api.get(url);
      setLocationData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      setError("Failed to fetch master locations");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchMasterLocations();
  }, [
    page,
    limit,
    debouncedSearch,
    sortBy,
    order,
    filterDivision,
    filterState,
  ]);

  // Sorting toggle
  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  // Import Handler
  const handleImport = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = `/admin/import-locations?db=d2c&type=master`;

      const res = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        `${res?.data?.message}\nInserted: ${res.data.inserted} records`
      );
      fetchMasterLocations();
    } catch (error) {
      toast.error(
        "Import failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  // Export Handler
  const handleExport = async (format, paginationData = null) => {
    try {
      const exportFormat = format === "excel" ? "xlsx" : format;
      let query = `/admin/export-master-locations?format=${exportFormat}`;

      if (paginationData && paginationData.offset && paginationData.limit) {
        query += `&offset=${paginationData.offset}&limit=${paginationData.limit}`;
      }

      const response = await api.get(query, { responseType: "blob" });
      const disposition = response.headers["content-disposition"];
      let filename = `locations-d2c.${exportFormat}`;
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Export successful!");
    } catch {
      toast.error("Export failed. Please try again.");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-20rem)]">
        {/* Header */}
        <HeaderSection
          title="Locations"
          showTotal
          total={total}
          tabs={["master"]}
          selectedTab="master"
          onTabChange={() => {}}
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
          searchPlaceholder="Search locations by dr_code or division..."
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Master Table */}
        <DynamicTable
          columns={masterLocationColumns.map((col) => ({
            key: col,
            label: col.replace(/_/g, " ").toUpperCase(),
            sortable: ["dr_code", "division"].includes(col),
          }))}
          data={locationData}
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
          doctorData={locationData}
          error={error}
        />
      </div>

      {/* Modal */}
      <Modal isOpen={!!modalType} onClose={handleClose}>
        {modalType === "import" && (
          <ImportForm
            onClose={handleClose}
            onSubmit={handleImport}
            title="Import Location Data (D2C)"
          />
        )}
        {modalType === "export" && (
          <ExportForm
            onClose={handleClose}
            onSubmit={handleExport}
            title="Export Location Data (D2C)"
          />
        )}
        {modalType === "add" && (
          <AddLocation
            mode="master"
            onSuccess={() => {
              handleClose();
              fetchMasterLocations();
            }}
            onCancel={handleClose}
          />
        )}
      </Modal>

      {/* Filter */}
      {showFilter && (
        <FilterMasterLocation
          filterDivision={filterDivision}
          setFilterDivision={setFilterDivision}
          filterState={filterState}
          setFilterState={setFilterState}
          setShowFilter={setShowFilter}
          fetchMasterLocations={fetchMasterLocations}
        />
      )}
    </DashboardLayout>
  );
};

export default DoctorLocation;
