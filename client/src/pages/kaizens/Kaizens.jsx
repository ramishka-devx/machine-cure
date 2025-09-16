import React, { useState, useEffect } from 'react';
import { kaizensService } from '../../services/kaizens.js';
import CreateKaizenModal from './components/CreateKaizenModal.jsx';
import EditKaizenModal from './components/EditKaizenModal.jsx';
import ViewKaizenModal from './components/ViewKaizenModal.jsx';
import DeleteKaizenModal from './components/DeleteKaizenModal.jsx';
import StatusUpdateModal from './components/StatusUpdateModal.jsx';
import AssignKaizenModal from './components/AssignKaizenModal.jsx';
import KaizenFilters from './components/KaizenFilters.jsx';
import KaizenStats from './components/KaizenStats.jsx';

const Kaizens = () => {
  const [kaizens, setKaizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState({});
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedKaizen, setSelectedKaizen] = useState(null);

  // Fetch kaizens from API
  const fetchKaizens = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await kaizensService.getAllKaizens(params);
      
      if (response.success) {
        setKaizens(response.data.rows);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      } else {
        setError(response.message || 'Failed to fetch kaizens');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch kaizens');
      console.error('Error fetching kaizens:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load kaizens on component mount and when filters/pagination change
  useEffect(() => {
    fetchKaizens();
  }, [pagination.page, pagination.limit, filters]);

  // Handle successful kaizen creation
  const handleKaizenCreated = (newKaizen) => {
    fetchKaizens(); // Refresh the list
    setIsCreateModalOpen(false);
  };

  // Handle kaizen update
  const handleKaizenUpdated = (updatedKaizen) => {
    fetchKaizens(); // Refresh the list
    setIsEditModalOpen(false);
    setSelectedKaizen(null);
  };

  // Handle kaizen deletion
  const handleKaizenDeleted = () => {
    fetchKaizens(); // Refresh the list
    setIsDeleteModalOpen(false);
    setSelectedKaizen(null);
  };

  // Handle status update
  const handleStatusUpdated = () => {
    fetchKaizens(); // Refresh the list
    setIsStatusModalOpen(false);
    setSelectedKaizen(null);
  };

  // Handle assignment
  const handleKaizenAssigned = () => {
    fetchKaizens(); // Refresh the list
    setIsAssignModalOpen(false);
    setSelectedKaizen(null);
  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Handle filters change
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Modal handlers
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (kaizen) => {
    setSelectedKaizen(kaizen);
    setIsEditModalOpen(true);
  };

  const openViewModal = (kaizen) => {
    setSelectedKaizen(kaizen);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (kaizen) => {
    setSelectedKaizen(kaizen);
    setIsDeleteModalOpen(true);
  };

  const openStatusModal = (kaizen) => {
    setSelectedKaizen(kaizen);
    setIsStatusModalOpen(true);
  };

  const openAssignModal = (kaizen) => {
    setSelectedKaizen(kaizen);
    setIsAssignModalOpen(true);
  };

  const closeAllModals = () => {
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsStatusModalOpen(false);
    setIsAssignModalOpen(false);
    setSelectedKaizen(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in progress': return 'text-blue-600 bg-blue-50';
      case 'approved': return 'text-purple-600 bg-purple-50';
      case 'under review': return 'text-yellow-600 bg-yellow-50';
      case 'submitted': return 'text-gray-600 bg-gray-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'on hold': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading && kaizens.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kaizen Management</h1>
          <p className="text-gray-600 mt-1">Manage continuous improvement suggestions</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + New Kaizen
        </button>
      </div>

      {/* Statistics */}
      <KaizenStats />

      {/* Filters */}
      <KaizenFilters onFiltersChange={handleFiltersChange} />

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Kaizens Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Est. Savings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kaizens.map((kaizen) => (
                <tr key={kaizen.kaizen_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {kaizen.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {kaizen.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{kaizen.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(kaizen.priority)}`}>
                      {kaizen.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(kaizen.status)}`}>
                      {kaizen.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {kaizen.submitted_by_first_name} {kaizen.submitted_by_last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {kaizen.assigned_to_first_name ? 
                      `${kaizen.assigned_to_first_name} ${kaizen.assigned_to_last_name}` : 
                      'Unassigned'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${kaizen.estimated_savings?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(kaizen)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(kaizen)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openStatusModal(kaizen)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => openAssignModal(kaizen)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => openDeleteModal(kaizen)}
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

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </span>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="ml-4 text-sm border-gray-300 rounded-md"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                  {pagination.page}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!loading && kaizens.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No kaizens found</div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create your first kaizen
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateKaizenModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onKaizenCreated={handleKaizenCreated}
      />

      <EditKaizenModal
        isOpen={isEditModalOpen}
        onClose={closeAllModals}
        kaizen={selectedKaizen}
        onKaizenUpdated={handleKaizenUpdated}
      />

      <ViewKaizenModal
        isOpen={isViewModalOpen}
        onClose={closeAllModals}
        kaizen={selectedKaizen}
      />

      <DeleteKaizenModal
        isOpen={isDeleteModalOpen}
        onClose={closeAllModals}
        kaizen={selectedKaizen}
        onKaizenDeleted={handleKaizenDeleted}
      />

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={closeAllModals}
        kaizen={selectedKaizen}
        onStatusUpdated={handleStatusUpdated}
      />

      <AssignKaizenModal
        isOpen={isAssignModalOpen}
        onClose={closeAllModals}
        kaizen={selectedKaizen}
        onKaizenAssigned={handleKaizenAssigned}
      />
    </div>
  );
};

export default Kaizens;