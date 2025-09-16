import React from 'react'

const DeleteMachineModal = ({ 
  isOpen, 
  onClose, 
  onDelete, 
  selectedMachine, 
  deleteConfirmation, 
  setDeleteConfirmation, 
  operationLoading 
}) => {
  if (!isOpen || !selectedMachine) return null

  const handleDelete = () => {
    if (deleteConfirmation !== selectedMachine.title) return
    onDelete()
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Machine</h3>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete the machine <strong>"{selectedMachine.title}"</strong>?
          </p>
          <p className="text-sm text-gray-500 mb-4">
            This action cannot be undone. To confirm, please type the machine title exactly:
          </p>
          
          <div className="bg-gray-100 p-3 rounded mb-2">
            <strong>{selectedMachine.title}</strong>
          </div>
          
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type the machine title to confirm..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={operationLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={operationLoading || deleteConfirmation !== selectedMachine.title}
          >
            {operationLoading ? 'Deleting...' : 'Delete Machine'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteMachineModal