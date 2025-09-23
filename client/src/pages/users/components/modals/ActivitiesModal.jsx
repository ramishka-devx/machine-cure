import React, { useEffect, useState } from 'react'
import { activitiesService } from '../../../../services/activities'
import { toast } from 'react-toastify'

export const ActivitiesModal = ({ isOpen, onClose, user }) => {
  const [loading, setLoading] = useState(false)
  const [activities, setActivities] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      loadActivities()
    }
  }, [isOpen, user, page])

  const loadActivities = async () => {
    if (!user) return

    setLoading(true)
    try {
      const params = {
        page,
        limit,
        user_id: user.user_id,
        sort_by: 'created_at',
        sort_order: 'desc'
      }
      const response = await activitiesService.list(params)
      setActivities(response.data || [])
      setTotal(response.pagination?.total || 0)
    } catch (error) {
      toast.error('Failed to load activities')
      console.error('Error loading activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getActivityDescription = (activity) => {
    const { method, path, status_code } = activity

    // Extract the resource from the path (e.g., "/api/users/123" -> "users")
    const pathParts = path.split('/').filter(p => p && p !== 'api')
    const resource = pathParts[0] || 'system'

    // Map HTTP methods to user actions
    const methodActions = {
      'GET': 'viewed',
      'POST': 'created',
      'PUT': 'updated',
      'PATCH': 'modified',
      'DELETE': 'deleted'
    }

    const action = methodActions[method] || 'accessed'

    // Map resources to readable names
    const resourceNames = {
      'users': 'user accounts',
      'roles': 'user roles',
      'permissions': 'permissions',
      'divisions': 'divisions',
      'division-types': 'division types',
      'machines': 'machines',
      'meters': 'meters',
      'parameters': 'parameters',
      'breakdowns': 'machine breakdowns',
      'breakdown-categories': 'breakdown categories',
      'breakdown-statuses': 'breakdown statuses',
      'breakdown-repairs': 'breakdown repairs',
      'breakdown-comments': 'breakdown comments',
      'breakdown-attachments': 'breakdown attachments',
      'kaizens': 'improvement suggestions',
      'maintenance': 'maintenance tasks',
      'notifications': 'notifications',
      'dashboard': 'dashboard',
      'analytics': 'analytics'
    }

    const readableResource = resourceNames[resource] || resource

    // Determine success/failure
    const wasSuccessful = status_code >= 200 && status_code < 300

    return {
      description: `${action} ${readableResource}`,
      wasSuccessful,
      statusText: wasSuccessful ? 'Success' : 'Failed'
    }
  }

  const ActivitySkeleton = () => (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      {showTechnicalDetails && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="col-span-2 h-3 bg-gray-200 rounded w-48"></div>
            <div className="col-span-2 h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      )}
    </div>
  )

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600'
    if (statusCode >= 400 && statusCode < 500) return 'text-orange-600'
    if (statusCode >= 500) return 'text-red-600'
    return 'text-gray-600'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-60">
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Recent Activity for {user?.first_name} {user?.last_name}
        </h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showTechnicalDetails}
              onChange={(e) => setShowTechnicalDetails(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show technical details
          </label>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
      </div>        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <ActivitySkeleton key={index} />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-gray-300 text-4xl mb-2">—</div>
              <div>No recent activity found for this user</div>
              <div className="text-sm mt-1">Activities will appear here as the user interacts with the system</div>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => {
                const { description, wasSuccessful, statusText } = getActivityDescription(activity)
                return (
                  <div key={activity.activity_id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {description}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            wasSuccessful 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {statusText}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(activity.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    {showTechnicalDetails && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-medium text-gray-600">Method:</span>
                            <span className="ml-1 font-mono">{activity.method}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Status:</span>
                            <span className={`ml-1 font-mono ${getStatusColor(activity.status_code)}`}>
                              {activity.status_code}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-gray-600">Path:</span>
                            <span className="ml-1 font-mono break-all">{activity.path}</span>
                          </div>
                          {activity.permission && (
                            <div className="col-span-2">
                              <span className="font-medium text-gray-600">Permission:</span>
                              <span className="ml-1">{activity.permission.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {total > limit && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {activities.length} of {total} recent activities
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm px-2">Page {page}</span>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}