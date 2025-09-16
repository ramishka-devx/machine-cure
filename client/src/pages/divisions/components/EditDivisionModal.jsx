import React, { useState, useEffect } from 'react';
import { divisionsService } from '../../../services/divisions.js';
import DivisionTypeSelect from './DivisionTypeSelect.jsx';
import ParentDivisionSelect from './ParentDivisionSelect.jsx';

const EditDivisionModal = ({ isOpen, onClose, onDivisionUpdated, division }) => {
  const [formData, setFormData] = useState({
    title: '',
    division_type_id: '',
    parent_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form when division prop changes
  useEffect(() => {
    if (division) {
      setFormData({
        title: division.title || '',
        division_type_id: division.division_type_id || '',
        parent_id: division.parent_id || ''
      });
    }
  }, [division]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle division type select change
  const handleDivisionTypeChange = (divisionTypeId) => {
    setFormData(prev => ({
      ...prev,
      division_type_id: divisionTypeId
    }));
  };

  // Handle parent division select change
  const handleParentDivisionChange = (parentId) => {
    setFormData(prev => ({
      ...prev,
      parent_id: parentId
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.division_type_id) {
      setError('Division type ID is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare data for API
      const submitData = {
        title: formData.title.trim(),
        division_type_id: formData.division_type_id,
        parent_id: formData.parent_id || null
      };

      const response = await divisionsService.updateDivision(division.division_id, submitData);

      if (response.success) {
        // Notify parent component
        onDivisionUpdated(response.data);
      } else {
        setError(response.message || 'Failed to update division');
      }
    } catch (err) {
      setError(err.message || 'Failed to update division');
      console.error('Error updating division:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen || !division) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-medium text-gray-900">Edit Division</h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Division Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            <strong>Division ID:</strong> {division.division_id}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Current Title:</strong> {division.title}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter division title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Division Type ID Field */}
          <div>
            <label htmlFor="division_type_id" className="block text-sm font-medium text-gray-700 mb-1">
              Division Type *
            </label>
            <DivisionTypeSelect
              value={formData.division_type_id}
              onChange={handleDivisionTypeChange}
              disabled={loading}
              required={true}
              placeholder="Select a division type..."
            />
          </div>

          {/* Parent ID Field */}
          <div>
            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-1">
              Parent Division (optional)
            </label>
            <ParentDivisionSelect
              value={formData.parent_id}
              onChange={handleParentDivisionChange}
              disabled={loading}
              placeholder="Select a parent division (optional)..."
              excludeDivisionId={division?.division_id} // Prevent self-selection
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Updating...' : 'Update Division'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDivisionModal;