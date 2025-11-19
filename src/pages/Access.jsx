import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/common/Modal";
import HeaderSection from "../components/common/HeaderSection";
import DynamicTable from "../components/common/DynamicTable";
import PaginationControls from "../components/common/PaginationControls";
import api from "../api/axios";
import toast from "react-hot-toast";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import CreateAccess from "../components/common/CreateAccess";
import DeleteModal from "../components/common/DeleteModal";

const roleOptions = [
  { value: "administrator", label: "Administrator" },
  { value: "admin", label: "Admin" },
  { value: "pmt", label: "PMT" },
];

const Access = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("master");

  const [accessData, setAccessData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageInput, setPageInput] = useState("");

  // sorting and search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  // form states
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: null,
  });

  const [selectedAccess, setSelectedAccess] = useState({
    tabs: [],
    dbs: [],
    schemas: [],
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Access Users
  const fetchAccessUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/admin/get-access-list?page=${page}&limit=${limit}&search=${debouncedSearch}&sortBy=${sortBy}&order=${order}`;
      const res = await api.get(url);
      setAccessData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load access list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessUsers();
  }, [page, limit, debouncedSearch, sortBy, order, selectedTab]);

  // sorting toggle
  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: null });
    setSelectedId(null);
    setEditMode(false);
  };

  // Handle Create or Update Access
  const handleSubmitAccess = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role?.value,
        access: selectedAccess,
      };

      if (editMode && selectedId) {
        await api.put(`/admin/update-access/${selectedId}`, payload);
        toast.success("Access updated successfully!");
      } else {
        await api.post("/admin/create-access", payload);
        toast.success("Access created successfully!");
      }

      setModalOpen(false);
      resetForm();
      fetchAccessUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  // Handle Edit Access
  const handleEdit = async (row) => {
    try {
      const res = await api.get(`/admin/get-access/${row.id}`);
      const user = res.data.data;

      setEditMode(true);
      setSelectedId(user.id);

      setForm({
        name: user.name,
        email: user.email,
        password: "",
        role: roleOptions.find((r) => r.value === user.role) || null,
      });

      // IMPORTANT: set full access JSON here
      setSelectedAccess(user.access || { tabs: [], dbs: [], schemas: [] });

      setModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch access details");
    }
  };

  // Handle Delete Access
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/delete-access/${deleteId}`);
      toast.success("Access deleted successfully!");
      setDeleteModalOpen(false);
      fetchAccessUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete access");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:max-w-[calc(100vw-20rem)]">
        {/* ✅ Header with master tab added */}
        <HeaderSection
          title="User Access"
          total={total}
          showTotal
          tabs={["Add"]}
          selectedTab={"Add"}
          onTabChange={() => {
            resetForm();
            setModalOpen(true);
          }}
          showSearch
          searchPlaceholder="Search by name or email..."
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Dynamic Table */}
        <DynamicTable
          columns={[
            { key: "name", label: "Name", sortable: true },
            { key: "email", label: "Email", sortable: true },
            {
              key: "role",
              label: "Role",
              sortable: true,
              render: (value) => {
                const color =
                  value === "administrator"
                    ? "bg-emerald-100 text-emerald-700"
                    : value === "admin"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700";
                return (
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${color}`}
                  >
                    {value?.toUpperCase()}
                  </span>
                );
              },
            },
            { key: "created_at", label: "Created At", sortable: true },
            { key: "actions", label: "Actions" },
          ]}
          data={accessData}
          loading={loading}
          error={error}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          renderCell={(key, value, row) => {
            if (key === "created_at")
              return new Date(value).toLocaleDateString();
            if (key === "actions") {
              return (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className=" cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <BiEditAlt size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(row.id)}
                    className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <BiTrash size={18} />
                  </button>
                </div>
              );
            }
            return value || "—";
          }}
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
          doctorData={accessData}
          error={error}
        />
      </div>

      {/* Create / Edit Access Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <CreateAccess
          form={form}
          setForm={setForm}
          editMode={editMode}
          handleSubmitAccess={handleSubmitAccess}
          selectedAccess={selectedAccess}
          setSelectedAccess={setSelectedAccess}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <DeleteModal
        isOpen={deleteModalOpen}
        title="Delete Access User?"
        message="Are you sure you want to delete this access user? This action cannot be undone."
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
};

export default Access;
