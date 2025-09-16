import React, { useState, useEffect } from 'react';
import { divisionTypesService } from '../../../../services/divisionTypes.js';

const EditDivisionTypeModal = ({ isOpen, onClose, onDivisionTypeUpdated, divisionType }) => {
  const [formData, setFormData] = useState({
    title: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form data when division type is selected
  useEffect(() => {
    if (divisionType) {
      setFormData({
        title: divisionType.title || ''
      });
      setError(null);
    }
  }, [divisionType]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!divisionType) {
      setError('No division type selected');
      return;
    }

    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare data for API
      const submitData = {
        title: formData.title.trim()
      };

      const response = await divisionTypesService.updateDivisionType(divisionType.division_type_id, submitData);

      if (response.success) {
        // Notify parent component
        onDivisionTypeUpdated(response.data);
      } else {
        setError(response.message || 'Failed to update division type');
      }
    } catch (err) {
      setError(err.message || 'Failed to update division type');
      console.error('Error updating division type:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: ''
      });
      setError(null);
      onClose();
    }
  };

  if (!isOpen || !divisionType) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 w-96 shadow-lg rounded-md bg-white">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-medium text-gray-900">Edit Division Type</h3>
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

        {/* Division Type Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            <strong>Division Type ID:</strong> {divisionType.division_type_id}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Current Title:</strong> {divisionType.title}
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
              placeholder="Enter division type title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
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
              {loading ? 'Updating...' : 'Update Division Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDivisionTypeModal;