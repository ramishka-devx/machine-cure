import React, { useState, useEffect } from "react";
import { maintenanceService } from "../../services/maintenance.js";
import { machinesService } from "../../services/machines.js";
import {
  CreateMaintenanceModal,
  EditMaintenanceModal,
  DeleteMaintenanceModal,
  MaintenanceCard,
  MaintenanceFilterModal,
} from "./components/index.js";

const Maintenance = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: "",
    machine_id: null,
    type: "",
    status: "",
    priority: "",
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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    machine_id: null,
    title: "",
    description: "",
    type: "routine",
    status: "scheduled",
    priority: "medium",
    estimated_duration_hours: 0,
    actual_duration_hours: null,
    estimated_cost: 0,
    actual_cost: null,
    scheduled_date: "",
    due_date: "",
    started_at: null,
    completed_at: null,
  });

  // Fetch maintenance records when component mounts or filters change
  useEffect(() => {
    fetchMaintenanceRecords();
  }, [filters]);

  // Fetch machines for dropdown options
  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await maintenanceService.getAllMaintenance(filters);

      if (response.success) {
        setMaintenanceRecords(response.data.rows);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to fetch maintenance records");
      console.error("Error fetching maintenance records:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMachines = async () => {
    try {
      const response = await machinesService.getAllMachines({ limit: 100 });
      if (response.success) {
        setMachines(response.data.rows);
      }
    } catch (err) {
      console.error("Error fetching machines:", err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      q: "",
      machine_id: null,
      type: "",
      status: "",
      priority: "",
      page: 1,
      limit: 10,
    });
  };

  // Handle create maintenance
  const handleCreate = () => {
    setFormData({
      machine_id: null,
      title: "",
      description: "",
      type: "routine",
      status: "scheduled",
      priority: "medium",
      estimated_duration_hours: 0,
      actual_duration_hours: null,
      estimated_cost: 0,
      actual_cost: null,
      scheduled_date: "",
      due_date: "",
      started_at: null,
      completed_at: null,
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (data) => {
    try {
      setOperationLoading(true);
      const response = await maintenanceService.createMaintenance(data);

      if (response.success) {
        await fetchMaintenanceRecords();
        setShowCreateModal(false);
        // Show success message
      }
    } catch (err) {
      console.error("Error creating maintenance:", err);
      // Show error message
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle edit maintenance
  const handleEdit = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setFormData({
      machine_id: maintenance.machine_id,
      title: maintenance.title,
      description: maintenance.description,
      type: maintenance.type,
      status: maintenance.status,
      priority: maintenance.priority,
      estimated_duration_hours: maintenance.estimated_duration_hours,
      actual_duration_hours: maintenance.actual_duration_hours,
      estimated_cost: maintenance.estimated_cost,
      actual_cost: maintenance.actual_cost,
      scheduled_date: maintenance.scheduled_date
        ? new Date(maintenance.scheduled_date).toISOString().slice(0, 16)
        : "",
      due_date: maintenance.due_date
        ? new Date(maintenance.due_date).toISOString().slice(0, 16)
        : "",
      started_at: maintenance.started_at,
      completed_at: maintenance.completed_at,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data) => {
    try {
      setOperationLoading(true);
      const response = await maintenanceService.updateMaintenance(
        selectedMaintenance.maintenance_id,
        data
      );

      if (response.success) {
        await fetchMaintenanceRecords();
        setShowEditModal(false);
        setSelectedMaintenance(null);
      }
    } catch (err) {
      console.error("Error updating maintenance:", err);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle delete maintenance
  const handleDelete = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      setOperationLoading(true);
      const response = await maintenanceService.deleteMaintenance(
        selectedMaintenance.maintenance_id
      );

      if (response.success) {
        await fetchMaintenanceRecords();
        setShowDeleteModal(false);
        setSelectedMaintenance(null);
      }
    } catch (err) {
      console.error("Error deleting maintenance:", err);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (maintenanceId, newStatus) => {
    try {
      setOperationLoading(true);
      const response = await maintenanceService.updateMaintenanceStatus(
        maintenanceId,
        newStatus
      );

      if (response.success) {
        await fetchMaintenanceRecords();
      }
    } catch (err) {
      console.error("Error updating maintenance status:", err);
    } finally {
      setOperationLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-700">
          Error: {error}
          <button
            onClick={fetchMaintenanceRecords}
            className="ml-4 text-red-600 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-8 ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3 justify-end w-full">
          <button
            onClick={() => setShowFilterModal(true)}
            className=" text-gray-500 px-4 py-2 rounded-md hover:text-gray-900 transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
            Filters
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-3 rounded-sm hover:bg-blue-600 transition-colors"
          >
            Schedule
          </button>
        </div>
      </div>

      {/* Filter Summary */}
      {(filters.q ||
        filters.machine_id ||
        filters.type ||
        filters.status ||
        filters.priority) && (
        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {filters.q && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Search: "{filters.q}"
                  <button
                    onClick={() => handleFilterChange("q", "")}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.machine_id && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Machine:{" "}
                  {machines.find((m) => m.machine_id == filters.machine_id)
                    ?.title || "Unknown"}
                  <button
                    onClick={() => handleFilterChange("machine_id", null)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.type && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  Type: {filters.type}
                  <button
                    onClick={() => handleFilterChange("type", "")}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  Status: {filters.status}
                  <button
                    onClick={() => handleFilterChange("status", "")}
                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.priority && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                  Priority: {filters.priority}
                  <button
                    onClick={() => handleFilterChange("priority", "")}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {!filters.q &&
                !filters.machine_id &&
                !filters.type &&
                !filters.status &&
                !filters.priority && (
                  <span className="text-sm text-gray-500">
                    No filters applied
                  </span>
                )}
            </div>
            <div className="flex items-center space-x-3">
              {(filters.q ||
                filters.machine_id ||
                filters.type ||
                filters.status ||
                filters.priority) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilterModal(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Edit filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {maintenanceRecords.length} of {pagination.total} maintenance
          records
        </span>
        <span>
          Page {pagination.page} of{" "}
          {Math.ceil(pagination.total / pagination.limit)}
        </span>
      </div>

      {/* Maintenance Records Grid */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
            >
              {/* Row skeleton */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="flex gap-2 mb-2">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-14"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-18"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="flex gap-4 lg:min-w-[300px]">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-22"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex gap-2 lg:min-w-[200px]">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {maintenanceRecords.map((maintenance) => (
            <MaintenanceCard
              key={maintenance.maintenance_id}
              maintenance={maintenance}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
              loading={operationLoading}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && maintenanceRecords.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No maintenance records found
          </div>
          <p className="text-gray-400 mt-2">
            Try adjusting your filters or create a new maintenance record
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="px-4 py-2 text-sm text-gray-700">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateMaintenanceModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
          loading={operationLoading}
          machines={machines}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {showEditModal && (
        <EditMaintenanceModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
          loading={operationLoading}
          machines={machines}
          maintenance={selectedMaintenance}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {showDeleteModal && (
        <DeleteMaintenanceModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteSubmit}
          loading={operationLoading}
          maintenance={selectedMaintenance}
        />
      )}

      {showFilterModal && (
        <MaintenanceFilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          machines={machines}
          onClearFilters={clearFilters}
          onSearch={fetchMaintenanceRecords}
        />
      )}
    </div>
  );
};

export default Maintenance;
