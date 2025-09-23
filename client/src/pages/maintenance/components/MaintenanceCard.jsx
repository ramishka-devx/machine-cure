import React from 'react'
import { Play, CheckCircle, X, Edit, Trash2 } from 'lucide-react'

const MaintenanceCard = ({ maintenance, onEdit, onDelete, onStatusUpdate, loading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600'
      case 'medium': return 'bg-blue-100 text-blue-600'
      case 'high': return 'bg-orange-100 text-orange-600'
      case 'critical': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'preventive': return 'bg-green-100 text-green-700'
      case 'corrective': return 'bg-yellow-100 text-yellow-700'
      case 'predictive': return 'bg-purple-100 text-purple-700'
      case 'emergency': return 'bg-red-100 text-red-700'
      case 'routine': return 'bg-blue-100 text-blue-700'
      case 'overhaul': return 'bg-indigo-100 text-indigo-700'
      default: return 'bg-gray-100 text-gray-700'
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
      currency: 'LKR'
    }).format(amount)
  }

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(maintenance.maintenance_id, newStatus)
  }

  return (
    <div className="bg-white  border border-gray-300 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{maintenance.title}</h3>
        <div className="flex gap-1 flex-wrap">
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

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-700">
          <p><span className="font-medium">Machine:</span> {maintenance.machine_title}</p>
          <p><span className="font-medium">Scheduled by:</span> {maintenance.scheduled_by_name}</p>
        </div>

        <p className="text-sm text-gray-600">{maintenance.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="space-y-1">
            <div>Scheduled: <span className="font-medium text-gray-900">{formatDate(maintenance.scheduled_date)}</span></div>
            {maintenance.due_date && <div>Due: <span className="font-medium text-gray-900">{formatDate(maintenance.due_date)}</span></div>}
            {maintenance.started_at && <div>Started: <span className="font-medium text-gray-900">{formatDate(maintenance.started_at)}</span></div>}
            {maintenance.completed_at && <div>Completed: <span className="font-medium text-gray-900">{formatDate(maintenance.completed_at)}</span></div>}
          </div>

          <div className="space-y-1">
            <div>Est. Duration: <span className="font-medium text-gray-900">{maintenance.estimated_duration_hours}h</span></div>
            {maintenance.actual_duration_hours && (
              <div>Actual Duration: <span className="font-medium text-gray-900">{maintenance.actual_duration_hours}h</span></div>
            )}
            <div>Est. Cost: <span className="font-medium text-gray-900">{formatCurrency(maintenance.estimated_cost)}</span></div>
            {maintenance.actual_cost && (
              <div>Actual Cost: <span className="font-medium text-gray-900">{formatCurrency(maintenance.actual_cost)}</span></div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with ID and actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
        {/* Left side - ID */}
        <div className="text-xs text-gray-500">ID: {maintenance.maintenance_id}</div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          {/* Status Actions */}
          {maintenance.status !== 'completed' && maintenance.status !== 'cancelled' && (
            <>
              {maintenance.status === 'scheduled' && (
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  disabled={loading}
                  className="p-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center"
                  title="Start Maintenance"
                >
                  <Play size={14} />
                </button>
              )}
              {maintenance.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={loading}
                  className="p-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                  title="Complete Maintenance"
                >
                  <CheckCircle size={14} />
                </button>
              )}
              <button
                onClick={() => handleStatusChange('cancelled')}
                disabled={loading}
                className="p-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center"
                title="Cancel Maintenance"
              >
                <X size={14} />
              </button>
            </>
          )}

          {/* CRUD Actions */}
          <button
            onClick={() => onEdit(maintenance)}
            disabled={loading}
            className="p-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            title="Edit Maintenance"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(maintenance)}
            disabled={loading}
            className="p-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
            title="Delete Maintenance"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceCard
