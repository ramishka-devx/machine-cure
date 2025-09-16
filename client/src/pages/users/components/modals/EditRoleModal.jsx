import React, { useState, useEffect } from 'react'
import { RolesService } from '../../../../services/roles'
import { toast } from 'react-toastify'

export const EditRoleModal = ({ isOpen, onClose, onRoleUpdated, role }) => {
  const [formData, setFormData] = useState({ name: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (role) {
      setFormData({ name: role.name })
    }
  }, [role])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Role name is required')
      return
    }

    if (!role) {
      toast.error('No role selected for editing')
      return
    }

    setSubmitting(true)
    try {
      await RolesService.update(role.role_id, { name: formData.name.trim() })
      toast.success('Role updated successfully')
      onClose()
      onRoleUpdated?.()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update role')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '' })
    onClose()
  }

  if (!isOpen || !role) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Role</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role name"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}