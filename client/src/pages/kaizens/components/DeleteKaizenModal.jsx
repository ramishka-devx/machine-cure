import React, { useState } from 'react';
import { kaizensService } from '../../../services/kaizens.js';

const DeleteKaizenModal = ({ isOpen, onClose, kaizen, onKaizenDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await kaizensService.deleteKaizen(kaizen.kaizen_id);
      
      if (response.success) {
        onKaizenDeleted();
      } else {
        setError(response.message || 'Failed to delete kaizen');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete kaizen');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !kaizen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Delete Kaizen</h3>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete the kaizen <strong>"{kaizen.title}"</strong>?
            </p>
            <p className="text-sm text-gray-600 mt-2">
              This will permanently remove the kaizen and all associated comments and history.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete Kaizen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteKaizenModal;