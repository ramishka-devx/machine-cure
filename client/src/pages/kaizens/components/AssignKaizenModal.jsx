import React, { useState, useEffect } from 'react';
import { kaizensService } from '../../../services/kaizens.js';
import { usersService } from '../../../services/users.js';

const AssignKaizenModal = ({ isOpen, onClose, kaizen, onKaizenAssigned }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    assigned_to: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setFormData({
        assigned_to: kaizen?.assigned_to || '',
        notes: ''
      });
    }
  }, [isOpen, kaizen]);

  const fetchUsers = async () => {
    try {
      const response = await usersService.getAllUsers({ limit: 100 });
      if (response.success) {
        setUsers(response.data.rows || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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
      const response = await kaizensService.assignKaizen(kaizen.kaizen_id, formData);
      
      if (response.success) {
        onKaizenAssigned(response.data);
      } else {
        setError(response.message || 'Failed to assign kaizen');
      }
    } catch (err) {
      setError(err.message || 'Failed to assign kaizen');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      assigned_to: '',
      notes: ''
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !kaizen) return null;

  const currentAssignee = users.find(u => u.user_id === kaizen.assigned_to);
  const selectedUser = users.find(u => u.user_id == formData.assigned_to);

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex  justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full  overflow-auto my-5">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assign Kaizen</h2>
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
            <div className="text-sm text-gray-600">
              <p><strong>Category:</strong> {kaizen.category}</p>
              <p><strong>Priority:</strong> {kaizen.priority}</p>
              <p>
                <strong>Currently assigned to:</strong>{' '}
                {currentAssignee 
                  ? `${currentAssignee.first_name} ${currentAssignee.last_name}` 
                  : 'Unassigned'
                }
              </p>
            </div>
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to User *
            </label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
            {selectedUser && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p className="text-sm text-blue-700">
                  <strong>{selectedUser.first_name} {selectedUser.last_name}</strong>
                </p>
                <p className="text-xs text-blue-600">{selectedUser.email}</p>
                {selectedUser.role && (
                  <p className="text-xs text-blue-600">Role: {selectedUser.role}</p>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes about this assignment..."
            />
          </div>

          {/* Estimated Implementation Info */}
          {kaizen.estimated_implementation_days > 0 && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-700">
                <strong>Estimated Implementation:</strong>{' '}
                {kaizen.estimated_implementation_days} days
              </p>
              {kaizen.estimated_cost > 0 && (
                <p className="text-sm text-yellow-700">
                  <strong>Estimated Cost:</strong> LKR {kaizen.estimated_cost.toLocaleString()}
                </p>
              )}
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
              disabled={loading || !formData.assigned_to}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Kaizen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignKaizenModal;