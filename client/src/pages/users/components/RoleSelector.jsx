import React, { useEffect, useState } from 'react'
import { RolesService } from '../../../services/roles'

export const RoleSelector = ({ value, onChange, disabled = false, className = '' }) => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    const loadRoles = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await RolesService.getAll()
        if (!ignore) {
          setRoles(data || [])
        }
      } catch (e) {
        if (!ignore) {
          setError(e?.message || 'Failed to load roles')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadRoles()
    return () => { ignore = true }
  }, [])

  const handleChange = (e) => {
    const selectedRoleId = Number(e.target.value)
    console.log(selectedRoleId)
    if(!selectedRoleId) return;
    const selectedRole = roles.find(r => r.role_id === selectedRoleId)
    onChange(selectedRoleId, selectedRole)
  }

  if (loading) {
    return (
      <select disabled className={`${className} opacity-50`}>
        <option>Loading...</option>
      </select>
    )
  }

  if (error) {
    return (
      <select disabled className={`${className} opacity-50`}>
        <option>Error loading roles</option>
      </select>
    )
  }

  return (
    <select
      value={value || ''}
      onChange={handleChange}
      disabled={disabled}
      className={className}
    >
      <option value={null}>Select Role</option>
      {roles.map((role) => (
        <option key={role.role_id} value={role.role_id}>
          {role.name}
        </option>
      ))}
    </select>
  )
}

export default RoleSelector