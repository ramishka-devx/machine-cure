import React, { useState, useEffect } from "react";
import { machinesService } from "../../services/machines.js";
import ParentDivisionSelect from "../divisions/components/ParentDivisionSelect.jsx";
import {
  CreateMachineModal,
  EditMachineModal,
  DeleteMachineModal,
  MachineCard,
} from "./components/index.js";

const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: "",
    division_id: null,
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  // CRUD state management
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: "",
    division_id: null,
  });

  // Fetch machines when component mounts or filters change
  useEffect(() => {
    fetchMachines();
  }, [filters]);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare parameters for API call
      const params = {};
      if (filters.q.trim()) params.q = filters.q.trim();
      if (filters.division_id) params.division_id = filters.division_id;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await machinesService.getAllMachines(params);

      if (response.success) {
        setMachines(response.data.rows || []);
        setPagination({
          total: response.data.total || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 10,
        });
      } else {
        setError(response.message || "Failed to fetch machines");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch machines");
      console.error("Error fetching machines:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      q: e.target.value,
      page: 1, // Reset to first page when searching
    }));
  };

  const handleDivisionFilterChange = (divisionId) => {
    setFilters((prev) => ({
      ...prev,
      division_id: divisionId,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      division_id: null,
      page: 1,
      limit: 10,
    });
  };

  // CRUD Operations
  const openCreateModal = () => {
    setFormData({ title: "", division_id: null });
    setShowCreateModal(true);
  };

  const openEditModal = (machine) => {
    setSelectedMachine(machine);
    setFormData({
      title: machine.title,
      division_id: machine.division_id,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (machine) => {
    setSelectedMachine(machine);
    setDeleteConfirmation("");
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedMachine(null);
    setDeleteConfirmation("");
    setFormData({ title: "", division_id: null });
  };

  const handleCreateMachine = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setOperationLoading(true);
      const response = await machinesService.createMachine({
        title: formData.title.trim(),
        division_id: formData.division_id || undefined,
      });

      if (response.success) {
        closeModals();
        fetchMachines(); // Refresh the list
      } else {
        setError(response.message || "Failed to create machine");
      }
    } catch (err) {
      setError(err.message || "Failed to create machine");
      console.error("Error creating machine:", err);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdateMachine = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !selectedMachine) return;

    try {
      setOperationLoading(true);
      const response = await machinesService.updateMachine(
        selectedMachine.machine_id,
        {
          title: formData.title.trim(),
          division_id: formData.division_id || undefined,
        }
      );

      if (response.success) {
        closeModals();
        fetchMachines(); // Refresh the list
      } else {
        setError(response.message || "Failed to update machine");
      }
    } catch (err) {
      setError(err.message || "Failed to update machine");
      console.error("Error updating machine:", err);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteMachine = async () => {
    if (!selectedMachine || deleteConfirmation !== selectedMachine.title)
      return;

    try {
      setOperationLoading(true);
      const response = await machinesService.deleteMachine(
        selectedMachine.machine_id
      );

      if (response.success || response == "") {
        closeModals();
        fetchMachines(); // Refresh the list
      } else {
        setError(response.message || "Failed to delete machine");
      }
    } catch (err) {
      setError(err.message || "Failed to delete machine");
      console.error("Error deleting machine:", err);
    } finally {
      setOperationLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={filters.q}
              onChange={handleSearchChange}
              placeholder="Search machines..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Division Filter */}
          <div className="w-64">
            <ParentDivisionSelect
              value={filters.division_id}
              onChange={handleDivisionFilterChange}
              placeholder="Filter by division..."
            />
          </div>

          {/* Clear Filters */}
          {(filters.q || filters.division_id) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center space-x-1"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Create Machine Button */}
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
        >
          <span> new</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse shadow-sm"
            >
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="ml-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Division Info */}
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>

              {/* Metadata */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Machines
              </h3>
            </div>
          </div>
          <div className="ml-8">
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchMachines}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Machines Grid */}
      {!loading && !error && (
        <>
          {machines.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-8">
                {machines.map((machine) => (
                  <MachineCard
                    key={machine.machine_id}
                    machine={machine}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}
                      </span>{" "}
                      of <span className="font-medium">{pagination.total}</span>{" "}
                      machines
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span>Previous</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        <span className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg">
                          {pagination.page}
                        </span>
                        <span className="text-sm text-gray-500">
                          of {Math.ceil(pagination.total / pagination.limit)}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={
                          pagination.page >=
                          Math.ceil(pagination.total / pagination.limit)
                        }
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No machines found
              </h3>
              <p className="text-gray-500 mb-6">
                {filters.q || filters.division_id
                  ? "Try adjusting your search criteria or clearing filters to see more machines."
                  : "Get started by creating your first machine."}
              </p>
              {!(filters.q || filters.division_id) && (
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Create Machine</span>
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateMachineModal
        isOpen={showCreateModal}
        onClose={closeModals}
        onSubmit={handleCreateMachine}
        formData={formData}
        setFormData={setFormData}
        operationLoading={operationLoading}
      />

      <EditMachineModal
        isOpen={showEditModal}
        onClose={closeModals}
        onSubmit={handleUpdateMachine}
        formData={formData}
        setFormData={setFormData}
        selectedMachine={selectedMachine}
        operationLoading={operationLoading}
      />

      <DeleteMachineModal
        isOpen={showDeleteModal}
        onClose={closeModals}
        onDelete={handleDeleteMachine}
        selectedMachine={selectedMachine}
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
        operationLoading={operationLoading}
      />
    </div>
  );
};

export default Machines;
