import React, { useState, useEffect } from 'react';
import { divisionTypesService } from '../../../services/divisionTypes.js';
import CreateDivisionTypeModal from './components/CreateDivisionTypeModal.jsx';
import EditDivisionTypeModal from './components/EditDivisionTypeModal.jsx';
import DeleteDivisionTypeModal from './components/DeleteDivisionTypeModal.jsx';

const DivisionTypesModal = ({ isOpen, onClose }) => {
  const [divisionTypes, setDivisionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDivisionType, setSelectedDivisionType] = useState(null);

  // Fetch division types from API
  const fetchDivisionTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await divisionTypesService.getAllDivisionTypes();
      
      if (response.success) {
        setDivisionTypes(response.data);
      } else {
        setError(response.message || 'Failed to fetch division types');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch division types');
      console.error('Error fetching division types:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load division types when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDivisionTypes();
    }
  }, [isOpen]);

  // Handle successful division type creation
  const handleDivisionTypeCreated = (newDivisionType) => {
    setDivisionTypes(prev => [...prev, newDivisionType]);
    setIsCreateModalOpen(false);
  };

  // Handle division type edit
  const handleEdit = (divisionType) => {
    setSelectedDivisionType(divisionType);
    setIsEditModalOpen(true);
  };

  // Handle successful division type update
  const handleDivisionTypeUpdated = (updatedDivisionType) => {
    setDivisionTypes(prev => 
      prev.map(type => 
        type.division_type_id === updatedDivisionType.division_type_id ? updatedDivisionType : type
      )
    );
    setIsEditModalOpen(false);
    setSelectedDivisionType(null);
  };

  // Handle division type delete
  const handleDelete = (divisionType) => {
    setSelectedDivisionType(divisionType);
    setIsDeleteModalOpen(true);
  };

  // Handle successful division type deletion
  const handleDivisionTypeDeleted = (deletedDivisionType) => {
    setDivisionTypes(prev => 
      prev.filter(type => type.division_type_id !== deletedDivisionType.division_type_id)
    );
    setIsDeleteModalOpen(false);
    setSelectedDivisionType(null);
  };

  // Handle modal close
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDivisionType(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDivisionType(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 mx-auto p-5  w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
          {/* Modal Header */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-300">
            <h3 className="text-xl font-semibold text-gray-900">Manage Division Types</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="mt-4">
            {/* Create Button */}
            <div className="mb-4">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Division Type</span>
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-32">
                <div className="text-lg">Loading division types...</div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-800">
                  <h4 className="font-medium">Error</h4>
                  <p>{error}</p>
                  <button 
                    onClick={fetchDivisionTypes}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Division Types Table */}
            {!loading && !error && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {divisionTypes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No division types found. Create your first division type to get started.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {divisionTypes.map((divisionType) => (
                          <tr key={divisionType.division_type_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {divisionType.division_type_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {divisionType.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(divisionType)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(divisionType)}
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
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-300">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      <CreateDivisionTypeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDivisionTypeCreated={handleDivisionTypeCreated}
      />

      <EditDivisionTypeModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onDivisionTypeUpdated={handleDivisionTypeUpdated}
        divisionType={selectedDivisionType}
      />

      <DeleteDivisionTypeModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDivisionTypeDeleted={handleDivisionTypeDeleted}
        divisionType={selectedDivisionType}
      />
    </>
  );
};

export default DivisionTypesModal;