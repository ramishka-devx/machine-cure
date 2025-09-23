import React from 'react'

export const RoleSelector = ({ value, onChange, disabled = false, className = '', roles = [], loading = false, error = '' }) => {
  const handleChange = (e) => {
    const selectedRoleId = Number(e.target.value)
    if (!selectedRoleId) return;
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