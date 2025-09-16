import React, { useState } from 'react';
import { divisionTypesService } from '../../../../services/divisionTypes.js';

const DeleteDivisionTypeModal = ({ isOpen, onClose, onDivisionTypeDeleted, divisionType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');

  // Check if confirmation text matches the division type title
  const isConfirmationValid = confirmationText === divisionType?.title;

  // Handle deletion
  const handleDelete = async (e) => {
    e.preventDefault();
    
    if (!divisionType) {
      setError('No division type selected');
      return;
    }

    if (!isConfirmationValid) {
      setError('Please type the division type title to confirm deletion');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await divisionTypesService.deleteDivisionType(divisionType.division_type_id);

      if (response.success) {
        // Notify parent component
        onDivisionTypeDeleted(divisionType);
      } else {
        setError(response.message || 'Failed to delete division type');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete division type');
      console.error('Error deleting division type:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setError(null);
      setConfirmationText('');
      onClose();
    }
  };

  if (!isOpen || !divisionType) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 w-96 shadow-lg rounded-md bg-white">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-medium text-gray-900">Delete Division Type</h3>
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

        {/* Warning */}
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Warning
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This will permanently delete the division type and may affect related data.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Division Type Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            <strong>Division Type ID:</strong> {divisionType.division_type_id}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Title:</strong> <span className="font-mono bg-gray-200 px-1 rounded">{divisionType.title}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {/* Confirmation Form */}
        <form onSubmit={handleDelete} className="space-y-4">
          {/* Confirmation Input */}
          <div>
            <label htmlFor="confirmationText" className="block text-sm font-medium text-gray-700 mb-2">
              To confirm deletion, type the division type title: <span className="font-mono bg-gray-200 px-1 rounded">{divisionType.title}</span>
            </label>
            <input
              type="text"
              id="confirmationText"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type "${divisionType.title}" to confirm`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
              disabled={loading}
            />
            {confirmationText && !isConfirmationValid && (
              <p className="mt-1 text-sm text-red-600">
                Text doesn't match. Please type exactly: {divisionType.title}
              </p>
            )}
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
              disabled={loading || !isConfirmationValid}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Deleting...' : 'Delete Division Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteDivisionTypeModal;