import React, { useState, useEffect } from 'react';
import { kaizensService } from '../../../services/kaizens.js';

const StatusUpdateModal = ({ isOpen, onClose, kaizen, onStatusUpdated }) => {
  const [statuses, setStatuses] = useState([]);
  const [formData, setFormData] = useState({
    status_id: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatuses();
      setFormData({
        status_id: kaizen?.status_id || '',
        notes: ''
      });
    }
  }, [isOpen, kaizen]);

  const fetchStatuses = async () => {
    try {
      const response = await kaizensService.getStatuses();
      if (response.success) {
        setStatuses(response.data);
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await kaizensService.updateKaizenStatus(kaizen.kaizen_id, formData);
      
      if (response.success) {
        onStatusUpdated(response.data);
      } else {
        setError(response.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      status_id: '',
      notes: ''
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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

  if (!isOpen || !kaizen) return null;

  const currentStatus = statuses.find(s => s.status_id === kaizen.status_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Update Status</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Kaizen Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{kaizen.title}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Current Status:</span>
              {currentStatus && (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(currentStatus.name)}`}>
                  {currentStatus.name}
                </span>
              )}
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status *
            </label>
            <select
              name="status_id"
              value={formData.status_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select new status</option>
              {statuses.map((status) => (
                <option key={status.status_id} value={status.status_id}>
                  {status.name}
                </option>
              ))}
            </select>
            {formData.status_id && (
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(statuses.find(s => s.status_id == formData.status_id)?.name)}`}>
                  {statuses.find(s => s.status_id == formData.status_id)?.name}
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes about this status change..."
            />
          </div>

          {/* Status Descriptions */}
          {formData.status_id && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Description:</strong>{' '}
                {statuses.find(s => s.status_id == formData.status_id)?.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.status_id}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;