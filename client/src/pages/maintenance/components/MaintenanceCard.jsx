import React from 'react'

const MaintenanceCard = ({ maintenance, onEdit, onDelete, onStatusUpdate, loading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-600'
      case 'medium':
        return 'bg-blue-100 text-blue-600'
      case 'high':
        return 'bg-orange-100 text-orange-600'
      case 'critical':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'preventive':
        return 'bg-green-100 text-green-700'
      case 'corrective':
        return 'bg-yellow-100 text-yellow-700'
      case 'predictive':
        return 'bg-purple-100 text-purple-700'
      case 'emergency':
        return 'bg-red-100 text-red-700'
      case 'routine':
        return 'bg-blue-100 text-blue-700'
      case 'overhaul':
        return 'bg-indigo-100 text-indigo-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'Not set'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(maintenance.maintenance_id, newStatus)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with badges */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{maintenance.title}</h3>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(maintenance.status)}`}>
              {maintenance.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(maintenance.priority)}`}>
              {maintenance.priority.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(maintenance.type)}`}>
              {maintenance.type.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Machine Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Machine:</span> {maintenance.machine_title}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Scheduled by:</span> {maintenance.scheduled_by_name}
        </p>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-3">{maintenance.description}</p>
      </div>

      {/* Dates */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Scheduled:</span>
          <span className="text-gray-900">{formatDate(maintenance.scheduled_date)}</span>
        </div>
        {maintenance.due_date && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Due:</span>
            <span className="text-gray-900">{formatDate(maintenance.due_date)}</span>
          </div>
        )}
        {maintenance.started_at && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Started:</span>
            <span className="text-gray-900">{formatDate(maintenance.started_at)}</span>
          </div>
        )}
        {maintenance.completed_at && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed:</span>
            <span className="text-gray-900">{formatDate(maintenance.completed_at)}</span>
          </div>
        )}
      </div>

      {/* Cost and Duration */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Est. Duration:</span>
          <span className="text-gray-900">{maintenance.estimated_duration_hours}h</span>
        </div>
        {maintenance.actual_duration_hours && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Actual Duration:</span>
            <span className="text-gray-900">{maintenance.actual_duration_hours}h</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Est. Cost:</span>
          <span className="text-gray-900">{formatCurrency(maintenance.estimated_cost)}</span>
        </div>
        {maintenance.actual_cost && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Actual Cost:</span>
            <span className="text-gray-900">{formatCurrency(maintenance.actual_cost)}</span>
          </div>
        )}
      </div>

      {/* Status Actions */}
      {maintenance.status !== 'completed' && maintenance.status !== 'cancelled' && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {maintenance.status === 'scheduled' && (
              <button
                onClick={() => handleStatusChange('in_progress')}
                disabled={loading}
                className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                Start
              </button>
            )}
            {maintenance.status === 'in_progress' && (
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={loading}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Complete
              </button>
            )}
            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={loading}
              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          ID: {maintenance.maintenance_id}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(maintenance)}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(maintenance)}
            disabled={loading}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceCard