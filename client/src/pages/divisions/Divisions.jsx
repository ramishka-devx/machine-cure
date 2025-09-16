import React, { useState, useEffect } from 'react';
import { divisionsService } from '../../services/divisions.js';
import CreateDivisionModal from './components/CreateDivisionModal.jsx';
import EditDivisionModal from './components/EditDivisionModal.jsx';
import DeleteDivisionModal from './components/DeleteDivisionModal.jsx';
import DivisionsTree from './components/DivisionsTree.jsx';
import DivisionTypesModal from './divisionTypes/DivisionTypesModal.jsx';

const Divisions = () => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDivisionTypesModalOpen, setIsDivisionTypesModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

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

  // Load divisions on component mount
  useEffect(() => {
    fetchDivisions();
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

  if (loading) {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Divisions</h1>
            <p className="text-gray-600 mt-1">Manage your organization's division hierarchy</p>
          </div>
          <div className="flex space-x-3">
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Manage Division Types</span>
            </button>
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Division</span>
            </button>
          </div>
        </div>

        {/* Loading Skeleton for Divisions Tree */}
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
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Divisions</h1>
          <p className="text-gray-600 mt-1">Manage your organization's division hierarchy</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsDivisionTypesModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Manage Division Types</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Division</span>
          </button>
        </div>
      </div>

      {/* Divisions Tree */}
      <DivisionsTree
        divisions={divisions}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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

      {/* Division Types Modal */}
      <DivisionTypesModal
        isOpen={isDivisionTypesModalOpen}
        onClose={() => setIsDivisionTypesModalOpen(false)}
      />
    </div>
  );
};

export default Divisions;
