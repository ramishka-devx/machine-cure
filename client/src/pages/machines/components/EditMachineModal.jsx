import React from 'react'
import ParentDivisionSelect from '../../divisions/components/ParentDivisionSelect.jsx'

const EditMachineModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  selectedMachine, 
  operationLoading 
}) => {
  if (!isOpen || !selectedMachine) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    onSubmit(e)
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit Machine #{selectedMachine.machine_id}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Machine Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter machine title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <ParentDivisionSelect
              value={formData.division_id}
              onChange={(divisionId) => setFormData(prev => ({ ...prev, division_id: divisionId }))}
              placeholder="Select division (optional)..."
              className="w-full"
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
              type="submit"
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={operationLoading || !formData.title.trim()}
            >
              {operationLoading ? 'Updating...' : 'Update Machine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMachineModal