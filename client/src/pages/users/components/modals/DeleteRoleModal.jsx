import React, { useState } from 'react'
import { RolesService } from '../../../../services/roles'
import { toast } from 'react-toastify'

export const DeleteRoleModal = ({ isOpen, onClose, onRoleDeleted, role }) => {
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!role) {
      toast.error('No role selected for deletion')
      return
    }

    if (deleteConfirmText !== role.name) {
      toast.error('Please type the role name exactly to confirm deletion')
      return
    }

    setSubmitting(true)
    try {
      await RolesService.delete(role.role_id)
      toast.success('Role deleted successfully')
      onClose()
      onRoleDeleted?.()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete role')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setDeleteConfirmText('')
    onClose()
  }

  if (!isOpen || !role) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-600">Delete Role</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete the role "{role.name}"?
              This action cannot be undone.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Type the role name <strong>{role.name}</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder={`Type "${role.name}" to confirm`}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={submitting || deleteConfirmText !== role.name}
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}