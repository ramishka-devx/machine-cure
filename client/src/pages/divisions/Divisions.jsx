import React, { useState, useEffect } from 'react';
import { divisionsService } from '../../services/divisions.js';
import { divisionTypesService } from '../../services/divisionTypes.js';
import CreateDivisionModal from './components/CreateDivisionModal.jsx';
import EditDivisionModal from './components/EditDivisionModal.jsx';
import DeleteDivisionModal from './components/DeleteDivisionModal.jsx';
import DivisionsTree from './components/DivisionsTree.jsx';
import CreateDivisionTypeModal from './divisionTypes/components/CreateDivisionTypeModal.jsx';
import EditDivisionTypeModal from './divisionTypes/components/EditDivisionTypeModal.jsx';
import DeleteDivisionTypeModal from './divisionTypes/components/DeleteDivisionTypeModal.jsx';

const Divisions = () => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [activeTab, setActiveTab] = useState('divisions');

  // Division Types state
  const [divisionTypes, setDivisionTypes] = useState([]);
  const [divisionTypesLoading, setDivisionTypesLoading] = useState(false);
  const [divisionTypesError, setDivisionTypesError] = useState(null);
  const [isCreateDivisionTypeModalOpen, setIsCreateDivisionTypeModalOpen] = useState(false);
  const [isEditDivisionTypeModalOpen, setIsEditDivisionTypeModalOpen] = useState(false);
  const [isDeleteDivisionTypeModalOpen, setIsDeleteDivisionTypeModalOpen] = useState(false);
  const [selectedDivisionType, setSelectedDivisionType] = useState(null);

  // Fetch divisions from API
  const fetchDivisions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await divisionsService.getAllDivisions();
      
      if (response.success) {
        setDivisions(response.data);
      } else {
        setError(response.message || 'Failed to fetch divisions');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch divisions');
      console.error('Error fetching divisions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch division types from API
  const fetchDivisionTypes = async () => {
    try {
      setDivisionTypesLoading(true);
      setDivisionTypesError(null);
      const response = await divisionTypesService.getAllDivisionTypes();
      
      if (response.success) {
        setDivisionTypes(response.data);
      } else {
        setDivisionTypesError(response.message || 'Failed to fetch division types');
      }
    } catch (err) {
      setDivisionTypesError(err.message || 'Failed to fetch division types');
      console.error('Error fetching division types:', err);
    } finally {
      setDivisionTypesLoading(false);
    }
  };

  // Load divisions and division types on component mount
  useEffect(() => {
    fetchDivisions();
    fetchDivisionTypes();
  }, []);

  // Handle successful division creation
  const handleDivisionCreated = (newDivision) => {
    setDivisions(prev => [...prev, newDivision]);
    setIsCreateModalOpen(false);
  };

  // Handle division edit
  const handleEdit = (division) => {
    setSelectedDivision(division);
    setIsEditModalOpen(true);
  };

  // Handle successful division update
  const handleDivisionUpdated = (updatedDivision) => {
    setDivisions(prev => 
      prev.map(div => 
        div.division_id === updatedDivision.division_id ? updatedDivision : div
      )
    );
    setIsEditModalOpen(false);
    setSelectedDivision(null);
  };

  // Handle division delete
  const handleDelete = (division) => {
    setSelectedDivision(division);
    setIsDeleteModalOpen(true);
  };

  // Handle successful division deletion
  const handleDivisionDeleted = (deletedDivision) => {
    setDivisions(prev => 
      prev.filter(div => div.division_id !== deletedDivision.division_id)
    );
    setIsDeleteModalOpen(false);
    setSelectedDivision(null);
  };

  // Handle modal close
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDivision(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDivision(null);
  };

  // Division Types handlers
  const handleDivisionTypeCreated = (newDivisionType) => {
    setDivisionTypes(prev => [...prev, newDivisionType]);
    setIsCreateDivisionTypeModalOpen(false);
  };

  const handleEditDivisionType = (divisionType) => {
    setSelectedDivisionType(divisionType);
    setIsEditDivisionTypeModalOpen(true);
  };

  const handleDivisionTypeUpdated = (updatedDivisionType) => {
    setDivisionTypes(prev => 
      prev.map(type => 
        type.division_type_id === updatedDivisionType.division_type_id ? updatedDivisionType : type
      )
    );
    setIsEditDivisionTypeModalOpen(false);
    setSelectedDivisionType(null);
  };

  const handleDeleteDivisionType = (divisionType) => {
    setSelectedDivisionType(divisionType);
    setIsDeleteDivisionTypeModalOpen(true);
  };

  const handleDivisionTypeDeleted = (deletedDivisionType) => {
    setDivisionTypes(prev => 
      prev.filter(type => type.division_type_id !== deletedDivisionType.division_type_id)
    );
    setIsDeleteDivisionTypeModalOpen(false);
    setSelectedDivisionType(null);
  };

  const handleCloseEditDivisionTypeModal = () => {
    setIsEditDivisionTypeModalOpen(false);
    setSelectedDivisionType(null);
  };

  const handleCloseDeleteDivisionTypeModal = () => {
    setIsDeleteDivisionTypeModalOpen(false);
    setSelectedDivisionType(null);
  };

  return (
    <div className="px-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('divisions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'divisions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Divisions
          </button>
          <button
            onClick={() => setActiveTab('divisionTypes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'divisionTypes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Division Types
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'divisions' && (
        <div className="mt-6">
          {/* Create Division Button */}
          <div className="mb-4 flex justify-end ">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
            >
              <span>new</span>
            </button>
          </div>

          {/* Divisions Content */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="animate-pulse">
                {/* Root level items */}
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="mb-6">
                    {/* Root division */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                      <div className="flex space-x-2 ml-auto">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Child divisions */}
                    <div className="ml-6 border-l border-gray-200 pl-4">
                      {[...Array(2)].map((_, childIndex) => (
                        <div key={childIndex} className="flex items-center space-x-3 mb-2">
                          <div className="w-5 h-5 bg-gray-200 rounded"></div>
                          <div className="h-5 bg-gray-200 rounded w-40"></div>
                          <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                          <div className="flex space-x-2 ml-auto">
                            <div className="h-7 w-7 bg-gray-200 rounded"></div>
                            <div className="h-7 w-7 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Sub-child divisions */}
                      <div className="ml-6 border-l border-gray-200 pl-4">
                        {[...Array(1)].map((_, subChildIndex) => (
                          <div key={subChildIndex} className="flex items-center space-x-3 mb-2">
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-12"></div>
                            <div className="flex space-x-2 ml-auto">
                              <div className="h-6 w-6 bg-gray-200 rounded"></div>
                              <div className="h-6 w-6 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">
                <h3 className="font-medium">Error</h3>
                <p>{error}</p>
                <button 
                  onClick={fetchDivisions}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <DivisionsTree
              divisions={divisions}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}
      {activeTab === 'divisionTypes' && (
        <div className="mt-6">
          {/* Create Division Type Button */}
          <div className="mb-4 flex justify-end ">
            <button
              onClick={() => setIsCreateDivisionTypeModalOpen(true)}
              className="px-4 py-2     bg-blue-600 text-white rounded-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"

            >
              <span>new</span>
            </button>
          </div>

          {/* Division Types Content */}
          {divisionTypesLoading && (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg">Loading division types...</div>
            </div>
          )}

          {divisionTypesError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">
                <h4 className="font-medium">Error</h4>
                <p>{divisionTypesError}</p>
                <button 
                  onClick={fetchDivisionTypes}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!divisionTypesLoading && !divisionTypesError && (
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
                                onClick={() => handleEditDivisionType(divisionType)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteDivisionType(divisionType)}
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
      )}

      {/* Create Division Modal */}
      <CreateDivisionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDivisionCreated={handleDivisionCreated}
      />

      {/* Edit Division Modal */}
      <EditDivisionModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onDivisionUpdated={handleDivisionUpdated}
        division={selectedDivision}
      />

      {/* Delete Division Modal */}
      <DeleteDivisionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDivisionDeleted={handleDivisionDeleted}
        division={selectedDivision}
      />

      {/* Division Type Modals */}
      <CreateDivisionTypeModal
        isOpen={isCreateDivisionTypeModalOpen}
        onClose={() => setIsCreateDivisionTypeModalOpen(false)}
        onDivisionTypeCreated={handleDivisionTypeCreated}
      />

      <EditDivisionTypeModal
        isOpen={isEditDivisionTypeModalOpen}
        onClose={handleCloseEditDivisionTypeModal}
        onDivisionTypeUpdated={handleDivisionTypeUpdated}
        divisionType={selectedDivisionType}
      />

      <DeleteDivisionTypeModal
        isOpen={isDeleteDivisionTypeModalOpen}
        onClose={handleCloseDeleteDivisionTypeModal}
        onDivisionTypeDeleted={handleDivisionTypeDeleted}
        divisionType={selectedDivisionType}
      />
    </div>
  );
};

export default Divisions;
