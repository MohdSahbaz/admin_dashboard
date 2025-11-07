import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import ImportForm from "../components/common/ImportForm";
import ExportForm from "../components/common/ExportForm";
import AddLocation from "../components/location/AddLocation";
import api from "../api/axios";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { BiDownload, BiPlus, BiUpload } from "react-icons/bi";
import FilterMasterLocation from "../components/location/FilterMasterLocation";
import FilterSelectedLocation from "../components/location/FilterSelectedLocation";
import { masterLocationColumns } from "../config/locationColumns";
import PaginationControls from "../components/common/PaginationControls";
import HeaderSection from "../components/common/HeaderSection";
import DynamicTable from "../components/common/DynamicTable";

const DoctorLocation = () => {
  const [selectedTab, setSelectedTab] = useState("master");
  const [dbTab, setDBTab] = useState("d2c");

  const [modalType, setModalType] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // search & sort
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("city");
  const [order, setOrder] = useState("asc");

  const [pageInput, setPageInput] = useState("");

  // Master filters
  const [masterState, setMasterState] = useState("");
  const [masterDivision, setMasterDivision] = useState("");

  // Selected filters
  const [selectedState, setSelectedState] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const handleClose = () => setModalType(null);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // fetch master locations
  const fetchMasterLocations = async () => {
    setLoader(true);
    setError(null);
    try {
      const url = `/admin/master-locations?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}&division=${masterDivision}&state=${masterState}`;
      const res = await api.get(url);
      setLocationData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      setError("Failed to fetch master locations");
    } finally {
      setLoader(false);
    }
  };

  // fetch selected locations
  const fetchSelectedLocations = async () => {
    setLoader(true);
    setError(null);
    try {
      const url = `/admin/selected-locations?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}&db=${dbTab}&division=${selectedDivision}&state=${selectedState}`;
      const res = await api.get(url);
      setLocationData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      setError("Failed to fetch selected locations");
    } finally {
      setLoader(false);
    }
  };

  // handle db change or tab switch
  useEffect(() => {
    setLoader(true);
    if (dbTab === "lloyd-db") {
      setTimeout(() => setSelectedTab("selected"), 500);
    }
    setPage(1);
    setPageInput(1);
    setSearch("");
  }, [dbTab, selectedTab]);

  // main data fetch
  useEffect(() => {
    if (!selectedTab) return;
    setLocationData([]);
    setLoader(true);
    if (selectedTab === "master") fetchMasterLocations();
    else fetchSelectedLocations();
  }, [selectedTab, page, limit, debouncedSearch, sortBy, order, dbTab]);

  // sorting toggle
  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  // import handler
  const handleImport = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = `/admin/import-locations?db=${dbTab}&type=${selectedTab}`;
      const res = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        `${res?.data?.message} \n Inserted: ${res.data.inserted} data`
      );

      setLoader(true);
      if (selectedTab === "master") fetchMasterLocations();
      else fetchSelectedLocations();
    } catch (error) {
      toast.error(
        "Import failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  // export handler
  const handleExport = async (format, paginationData = null) => {
    try {
      const exportFormat = format === "excel" ? "xlsx" : format;
      let query =
        selectedTab === "master"
          ? `/admin/export-master-locations?format=${exportFormat}`
          : `/admin/export-selected-locations?format=${exportFormat}&db=${dbTab}`;

      if (paginationData && paginationData.offset && paginationData.limit) {
        query += `&offset=${paginationData.offset}&limit=${paginationData.limit}`;
      }

      const response = await api.get(query, { responseType: "blob" });
      const disposition = response.headers["content-disposition"];
      let filename = "locations." + exportFormat;

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
          searchPlaceholder={`Search locations by ${
            selectedTab === "master"
              ? "city, state, or division..."
              : "code, division, or state..."
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

        {/* Master Table */}
        {selectedTab === "master" ? (
          <DynamicTable
            columns={masterLocationColumns.map((col) => ({
              key: col,
              label: col.replace(/_/g, " ").toUpperCase(),
              sortable: ["city", "state", "division"].includes(col),
            }))}
            data={locationData}
            loading={loader}
            error={error}
            sortBy={sortBy}
            order={order}
            onSort={handleSort}
            renderCell={(key, value) => value || "—"}
          />
        ) : (
          // Selected Table
          <div className="overflow-x-auto block md:max-w-[calc(100vw-19rem)]">
            {loader ? (
              <Loader />
            ) : error ? (
              <div className="text-center py-6 text-red-600">{error}</div>
            ) : (
              <DynamicTable
                columns={[
                  {
                    key: "location_code",
                    label: "LOCATION CODE",
                    sortable: true,
                  },
                  { key: "division", label: "DIVISION", sortable: true },
                  ...(dbTab === "lloyd-db"
                    ? [{ key: "state", label: "STATE", sortable: true }]
                    : []),
                ]}
                data={locationData}
                loading={loader}
                error={error}
                sortBy={sortBy}
                order={order}
                onSort={handleSort}
              />
            )}
          </div>
        )}

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
            title="Import Location Data"
          />
        )}
        {modalType === "export" && (
          <ExportForm
            onClose={handleClose}
            onSubmit={handleExport}
            title="Export Location Data"
          />
        )}
        {modalType === "add" && (
          <AddLocation
            mode={
              selectedTab === "master"
                ? "master"
                : dbTab === "lloyd-db"
                ? "selected-lloyd"
                : "selected-d2c"
            }
            onSuccess={() => {
              handleClose();
              if (selectedTab === "master") fetchMasterLocations();
              else fetchSelectedLocations();
            }}
            onCancel={handleClose}
          />
        )}
      </Modal>

      {/* Filter */}
      {showFilter && selectedTab === "master" && (
        <FilterMasterLocation
          filterDivision={masterDivision}
          setFilterDivision={setMasterDivision}
          filterState={masterState}
          setFilterState={setMasterState}
          setShowFilter={setShowFilter}
          fetchMasterLocations={fetchMasterLocations}
        />
      )}

      {showFilter && selectedTab === "selected" && (
        <FilterSelectedLocation
          dbTab={dbTab}
          filterDivision={selectedDivision}
          setFilterDivision={setSelectedDivision}
          filterState={selectedState}
          setFilterState={setSelectedState}
          close={() => setShowFilter(false)}
          apply={() => {
            setPage(1);
            fetchSelectedLocations();
            setShowFilter(false);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default DoctorLocation;
