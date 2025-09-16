import React, { useEffect, useState } from 'react'
import { RolesService } from '../../../services/roles'
import { toast } from 'react-toastify'
import { CreateRoleModal, EditRoleModal, DeleteRoleModal } from './modals'

export const RoleManager = ({ isOpen, onClose, onRoleUpdated }) => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  useEffect(() => {
    if (isOpen) {
      loadRoles()
    }
  }, [isOpen])

  const loadRoles = async () => {
    setLoading(true)
    try {
      const data = await RolesService.getAll()
      setRoles(data || [])
    } catch (error) {
      toast.error('Failed to load roles')
      console.error('Error loading roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleCreated = () => {
    loadRoles()
    onRoleUpdated?.()
  }

  const handleRoleUpdated = () => {
    loadRoles()
    onRoleUpdated?.()
  }

  const handleRoleDeleted = () => {
    loadRoles()
    onRoleUpdated?.()
  }

  const openEditModal = (role) => {
    setSelectedRole(role)
    setShowEditModal(true)
  }

  const openDeleteModal = (role) => {
    setSelectedRole(role)
    setShowDeleteModal(true)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Main Role Manager Modal */}
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Role Manager</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">All Roles</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add New Role
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading roles...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                        No roles found
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr key={role.role_id} className="border-t border-gray-100">
                        <td className="px-4 py-3">{role.role_id}</td>
                        <td className="px-4 py-3 font-medium">{role.name}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(role)}
                              className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(role)}
                              className="text-red-600 hover:text-red-800 px-2 py-1 rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Separate Modal Components */}
      <CreateRoleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRoleCreated={handleRoleCreated}
      />

      <EditRoleModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onRoleUpdated={handleRoleUpdated}
        role={selectedRole}
      />

      <DeleteRoleModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onRoleDeleted={handleRoleDeleted}
        role={selectedRole}
      />
    </>
  )
}