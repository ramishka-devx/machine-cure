import React from 'react'

const MachineCard = ({ machine, onEdit, onDelete }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-gray-500">
          Machine #{machine.machine_id}
        </div>
        {machine.division_id && (
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Division: {machine.division_id}
          </div>
        )}
      </div>
      <div className="text-lg font-medium text-gray-900 mb-1">
        {machine.title}
      </div>
      <div className="text-sm text-gray-600 mb-3">
        Status: Operational
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(machine)}
          className="flex-1 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(machine)}
          className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default MachineCard