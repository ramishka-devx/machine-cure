import React, { useState, useEffect } from 'react'
import { machinesService } from '../../services/machines.js'
import ParentDivisionSelect from '../divisions/components/ParentDivisionSelect.jsx'
import { 
  CreateMachineModal, 
  EditMachineModal, 
  DeleteMachineModal, 
  MachineCard 
} from './components/index.js'

const Machines = () => {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    q: '',
    division_id: null,
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  })

  // CRUD state management
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState(null)
  const [operationLoading, setOperationLoading] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    division_id: null
  })

  // Fetch machines when component mounts or filters change
  useEffect(() => {
    fetchMachines()
  }, [filters])

  const fetchMachines = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Prepare parameters for API call
      const params = {}
      if (filters.q.trim()) params.q = filters.q.trim()
      if (filters.division_id) params.division_id = filters.division_id
      params.page = filters.page
      params.limit = filters.limit

      const response = await machinesService.getAllMachines(params)
      
      if (response.success) {
        setMachines(response.data.rows || [])
        setPagination({
          total: response.data.total || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 10
        })
      } else {
        setError(response.message || 'Failed to fetch machines')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch machines')
      console.error('Error fetching machines:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      q: e.target.value,
      page: 1 // Reset to first page when searching
    }))
  }

  const handleDivisionFilterChange = (divisionId) => {
    setFilters(prev => ({
      ...prev,
      division_id: divisionId,
      page: 1 // Reset to first page when filtering
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const clearFilters = () => {
    setFilters({
      q: '',
      division_id: null,
      page: 1,
      limit: 10
    })
  }

  // CRUD Operations
  const openCreateModal = () => {
    setFormData({ title: '', division_id: null })
    setShowCreateModal(true)
  }

  const openEditModal = (machine) => {
    setSelectedMachine(machine)
    setFormData({
      title: machine.title,
      division_id: machine.division_id
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (machine) => {
    setSelectedMachine(machine)
    setDeleteConfirmation('')
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedMachine(null)
    setDeleteConfirmation('')
    setFormData({ title: '', division_id: null })
  }

  const handleCreateMachine = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    try {
      setOperationLoading(true)
      const response = await machinesService.createMachine({
        title: formData.title.trim(),
        division_id: formData.division_id || undefined
      })

      if (response.success) {
        closeModals()
        fetchMachines() // Refresh the list
      } else {
        setError(response.message || 'Failed to create machine')
      }
    } catch (err) {
      setError(err.message || 'Failed to create machine')
      console.error('Error creating machine:', err)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleUpdateMachine = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !selectedMachine) return

    try {
      setOperationLoading(true)
      const response = await machinesService.updateMachine(selectedMachine.machine_id, {
        title: formData.title.trim(),
        division_id: formData.division_id || undefined
      })

      if (response.success) {
        closeModals()
        fetchMachines() // Refresh the list
      } else {
        setError(response.message || 'Failed to update machine')
      }
    } catch (err) {
      setError(err.message || 'Failed to update machine')
      console.error('Error updating machine:', err)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleDeleteMachine = async () => {
    if (!selectedMachine || deleteConfirmation !== selectedMachine.title) return

    try {
      setOperationLoading(true)
      const response = await machinesService.deleteMachine(selectedMachine.machine_id)

      if (response.success || response == '') {
        closeModals()
        fetchMachines() // Refresh the list
      } else {
        setError(response.message || 'Failed to delete machine')
      }
    } catch (err) {
      setError(err.message || 'Failed to delete machine')
      console.error('Error deleting machine:', err)
    } finally {
      setOperationLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Machines</h2>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Machine
        </button>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Machines
            </label>
            <input
              type="text"
              value={filters.q}
              onChange={handleSearchChange}
              placeholder="Search by machine title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Division Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Division
            </label>
            <ParentDivisionSelect
              value={filters.division_id}
              onChange={handleDivisionFilterChange}
              placeholder="Select division to filter..."
              className="w-full"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="ml-4">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
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
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-700 mb-2">Error loading machines:</div>
          <div className="text-red-600">{error}</div>
          <button
            onClick={fetchMachines}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Machines Grid */}
      {!loading && !error && (
        <>
          {machines.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
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
                <div className="flex justify-between items-center bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} machines
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
                    >
                      Previous
                    </button>
                    
                    <span className="px-3 py-1 bg-blue-500 text-white rounded">
                      {pagination.page}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No machines found</div>
              {(filters.q || filters.division_id) && (
                <div className="text-sm text-gray-400">
                  Try adjusting your search criteria or clearing filters
                </div>
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
  )
}

export default Machines
