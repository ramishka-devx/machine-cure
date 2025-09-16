import React from 'react'

const DeleteMaintenanceModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading,
  maintenance
}) => {
  if (!isOpen || !maintenance) return null

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Maintenance</h3>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this maintenance record? This action cannot be undone.
          </p>
          
          <div className="bg-gray-50 p-4 rounded border">
            <h4 className="font-medium text-gray-900 mb-2">{maintenance.title}</h4>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Machine:</span> {maintenance.machine_title}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Type:</span> {maintenance.type}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Status:</span> {maintenance.status}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Scheduled:</span> {
                new Date(maintenance.scheduled_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Maintenance'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteMaintenanceModal