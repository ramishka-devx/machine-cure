import React from 'react'
import { Edit, Trash2 } from 'lucide-react'

const MachineCard = ({ machine, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border border-gray-300 bg-white p-4  hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-gray-500">
          Machine #{machine.machine_id}
        </div>
        {machine.division_id && (
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
             {machine.division}
          </div>
        )}
      </div>
      <div className="text-lg font-medium text-gray-900 mb-1">
        {machine.title}
      </div>
      <div className="text-sm text-gray-600 mb-3">
        {/* Status: {machine.maintenance_status == 'in_progress' ? machine.maintenance_status : machine.breakdown_status != 4 ? 'breakdown' : 'operational' } */}
      </div>
      
      {/* Action Buttons */}
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <button
          onClick={() => onEdit(machine)}
          className="p-1 bg-yellow-100 rounded-lg text-yellow-800 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(machine)}
          className="p-1 bg-red-100 rounded-lg  text-red-500 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default MachineCard