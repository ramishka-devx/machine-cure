import React, { useState, useEffect } from 'react';
import { maintenanceSchedulesService } from '../../../services/maintenanceSchedules.js';
import { maintenanceTypesService } from '../../../services/maintenanceTypes.js';
import { machinesService } from '../../../services/machines.js';
import { usersService } from '../../../services/users.js';
import { AuthService } from '../../../services/auth.js';

const MaintenanceSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    machine_id: '',
    maintenance_type_id: '',
    status: '',
    overdue: false,
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  });

  // Reference data
  const [machines, setMachines] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // CRUD state management
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    machine_id: '',
    maintenance_type_id: '',
    frequency_days: '',
    next_due_date: '',
    assigned_to: '',
    notes: ''
  });

  // Complete schedule form
  const [completeData, setCompleteData] = useState({
    completion_notes: '',
    actual_duration_hours: '',
    completed_by: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, [filters]);

  useEffect(() => {
    fetchReferenceData();
    fetchCurrentUser();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await maintenanceSchedulesService.getAllMaintenanceSchedules(filters);
      setSchedules(response.data || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch maintenance schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [machinesResponse, typesResponse, usersResponse] = await Promise.all([
        machinesService.getAllMachines({ limit: 1000 }),
        maintenanceTypesService.getAllMaintenanceTypes({ limit: 1000 }),
        usersService.getAllUsers({ limit: 1000 })
      ]);
      console.log(machinesResponse)
      setMachines(machinesResponse?.data?.rows || []);
      setMaintenanceTypes(typesResponse.data || []);
      setUsers(usersResponse?.data?.rows || []);
    } catch (err) {
      console.error('Error fetching reference data:', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await AuthService.me();
      setCurrentUser(response.data || response);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset page when filter changes
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleCreateSchedule = async () => {
    try {
      setOperationLoading(true);
      
      // Clean up formData to remove empty strings and undefined values
      const scheduleData = {
        machine_id: formData.machine_id || null,
        maintenance_type_id: formData.maintenance_type_id || null,
        frequency_days: formData.frequency_days ? parseInt(formData.frequency_days) : null,
        next_due_date: formData.next_due_date || null,
        assigned_to: formData.assigned_to || null,
        notes: formData.notes || null,
        created_by: currentUser?.user_id || null
      };
      
      await maintenanceSchedulesService.createMaintenanceSchedule(scheduleData);
      setShowCreateModal(false);
      resetForm();
      fetchSchedules();
    } catch (err) {
      setError(err.message || 'Failed to create maintenance schedule');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdateSchedule = async () => {
    try {
      setOperationLoading(true);
      
      // Clean up formData to remove empty strings and undefined values
      const scheduleData = {
        machine_id: formData.machine_id || null,
        maintenance_type_id: formData.maintenance_type_id || null,
        frequency_days: formData.frequency_days ? parseInt(formData.frequency_days) : null,
        next_due_date: formData.next_due_date || null,
        assigned_to: formData.assigned_to || null,
        notes: formData.notes || null
      };
      
      await maintenanceSchedulesService.updateMaintenanceSchedule(selectedSchedule.id, scheduleData);
      setShowEditModal(false);
      resetForm();
      fetchSchedules();
    } catch (err) {
      setError(err.message || 'Failed to update maintenance schedule');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      setOperationLoading(true);
      await maintenanceSchedulesService.deleteMaintenanceSchedule(selectedSchedule.id);
      setShowDeleteModal(false);
      setSelectedSchedule(null);
      fetchSchedules();
    } catch (err) {
      setError(err.message || 'Failed to delete maintenance schedule');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCompleteSchedule = async () => {
    try {
      setOperationLoading(true);
      await maintenanceSchedulesService.completeSchedule(selectedSchedule.schedule_id, completeData);
      setShowCompleteModal(false);
      setSelectedSchedule(null);
      setCompleteData({ completion_notes: '', actual_duration_hours: '', completed_by: '' });
      fetchSchedules();
    } catch (err) {
      setError(err.message || 'Failed to complete maintenance schedule');
    } finally {
      setOperationLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      machine_id: '',
      maintenance_type_id: '',
      frequency_days: '',
      next_due_date: '',
      assigned_to: '',
      notes: ''
    });
    setSelectedSchedule(null);
  };

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      machine_id: schedule.machine_id || '',
      maintenance_type_id: schedule.maintenance_type_id || '',
      frequency_days: schedule.frequency_days || '',
      next_due_date: schedule.next_due_date ? schedule.next_due_date.split('T')[0] : '',
      assigned_to: schedule.assigned_to || '',
      notes: schedule.notes || ''
    });
    setShowEditModal(true);
  };

  const openCompleteModal = (schedule) => {
    setSelectedSchedule(schedule);
    setShowCompleteModal(true);
  };

  const openDeleteModal = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (schedule) => {
    const today = new Date();
    const dueDate = new Date(schedule.next_due_date);
    const isOverdue = dueDate < today;
    
    if (schedule.status === 'completed') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
    } else if (isOverdue) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Overdue</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log(schedules)

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Maintenance Schedules</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Schedule
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <select
              value={filters.machine_id}
              onChange={(e) => handleFilterChange('machine_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Machines</option>
              {machines.map((machine) => (
                <option key={machine.machine_id} value={machine.machine_id}>
                  {machine.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.maintenance_type_id}
              onChange={(e) => handleFilterChange('maintenance_type_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {maintenanceTypes.map((type) => (
                <option key={type.maintenance_type_id} value={type.maintenance_type_id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.overdue}
                onChange={(e) => handleFilterChange('overdue', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show overdue only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Schedules Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Machine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Maintenance Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Due
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{schedule.machine_id}</div>
                  <div className="text-sm text-gray-500">{schedule.machine_code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{schedule.maintenance_type_name}</div>
                  <div className="text-sm text-gray-500">{schedule.maintenance_type_description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Every {schedule.frequency_days} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(schedule.next_due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(schedule)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {schedule.status !== 'completed' && (
                      <button
                        onClick={() => openCompleteModal(schedule)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(schedule)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(schedule)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {schedules.length === 0 && !loading && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No maintenance schedules found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create First Schedule
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} schedules
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 w-96 shadow-lg rounded-md bg-white mb-10">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Maintenance Schedule</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Machine</label>
                  <select
                    value={formData.machine_id}
                    onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Machine</option>
                    {machines.map((machine) => (
                      <option key={machine.machine_id} value={machine.machine_id}>
                        {machine.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Maintenance Type</label>
                  <select
                    value={formData.maintenance_type_id}
                    onChange={(e) => setFormData({...formData, maintenance_type_id: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {maintenanceTypes.map((type) => (
                      <option key={type.maintenance_type_id} value={type.maintenance_type_id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frequency (Days)</label>
                  <input
                    type="number"
                    value={formData.frequency_days}
                    onChange={(e) => setFormData({...formData, frequency_days: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Next Due Date</label>
                  <input
                    type="date"
                    value={formData.next_due_date}
                    onChange={(e) => setFormData({...formData, next_due_date: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select User (Optional)</option>
                    {users.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSchedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={operationLoading || !formData.machine_id || !formData.maintenance_type_id || !formData.frequency_days}
                >
                  {operationLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Maintenance Schedule</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Machine</label>
                  <select
                    value={formData.machine_id}
                    onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Machine</option>
                    {machines.map((machine) => (
                      <option key={machine.machine_id} value={machine.machine_id}>
                        {machine.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Maintenance Type</label>
                  <select
                    value={formData.maintenance_type_id}
                    onChange={(e) => setFormData({...formData, maintenance_type_id: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {maintenanceTypes.map((type) => (
                      <option key={type.maintenance_type_id} value={type.maintenance_type_id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frequency (Days)</label>
                  <input
                    type="number"
                    value={formData.frequency_days}
                    onChange={(e) => setFormData({...formData, frequency_days: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Next Due Date</label>
                  <input
                    type="date"
                    value={formData.next_due_date}
                    onChange={(e) => setFormData({...formData, next_due_date: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select User (Optional)</option>
                    {users.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSchedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={operationLoading || !formData.machine_id || !formData.maintenance_type_id || !formData.frequency_days}
                >
                  {operationLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5  w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Maintenance</h3>
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Machine: {selectedSchedule?.machine_name}</p>
                <p className="text-sm text-gray-600">Type: {selectedSchedule?.maintenance_type_name}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Completion Notes</label>
                  <textarea
                    value={completeData.completion_notes}
                    onChange={(e) => setCompleteData({...completeData, completion_notes: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Actual Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={completeData.actual_duration_hours}
                    onChange={(e) => setCompleteData({...completeData, actual_duration_hours: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Completed By</label>
                  <input
                    type="text"
                    value={completeData.completed_by}
                    onChange={(e) => setCompleteData({...completeData, completed_by: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setSelectedSchedule(null);
                    setCompleteData({ completion_notes: '', actual_duration_hours: '', completed_by: '' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteSchedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                  disabled={operationLoading || !completeData.completion_notes || !completeData.completed_by}
                >
                  {operationLoading ? 'Completing...' : 'Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Maintenance Schedule</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this maintenance schedule for "{selectedSchedule?.machine_name}"? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedSchedule(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSchedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                  disabled={operationLoading}
                >
                  {operationLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceSchedules;
