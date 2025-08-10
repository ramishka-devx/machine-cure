import { FiHome, FiCpu, FiDatabase, FiTool, FiAlertTriangle, FiZap, FiUsers } from 'react-icons/fi'

// Central source of truth for dashboard navigation
export const navItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    to: '/dashboard',
    icon: FiHome,
    children: [
      { key: 'overview', label: 'Overview', to: '/dashboard' },
      { key: 'insights', label: 'Insights', to: '/dashboard' },
    ],
  },
  {
    key: 'machines',
    label: 'Machines',
    to: '/dashboard/machines',
    icon: FiCpu,
    children: [
      { key: 'machines-all', label: 'All machines', to: '/dashboard/machines' },
      { key: 'machines-status', label: 'Statuses', to: '/dashboard/machines' },
    ],
  },
  {
    key: 'records',
    label: 'Records',
    to: '/dashboard/records',
    icon: FiDatabase,
    children: [
      { key: 'records-production', label: 'Production records', to: '/dashboard/records' },
      { key: 'records-energy', label: 'Energy usage', to: '/dashboard/records' },
    ],
  },
  {
    key: 'maintenance',
    label: 'Maintenance',
    to: '/dashboard/maintenance',
    icon: FiTool,
    children: [
      { key: 'maintenance-schedule', label: 'Schedules', to: '/dashboard/maintenance' },
      { key: 'maintenance-requests', label: 'Requests', to: '/dashboard/maintenance' },
    ],
  },
  {
    key: 'breakdown',
    label: 'Breakdown',
    to: '/dashboard/breakdown',
    icon: FiAlertTriangle,
    children: [
      { key: 'breakdown-reports', label: 'Reports', to: '/dashboard/breakdown' },
    ],
  },
  {
    key: 'kaizen',
    label: 'Kaizen',
    to: '/dashboard/kaizen',
    icon: FiZap,
    children: [
      { key: 'kaizen-ideas', label: 'Ideas', to: '/dashboard/kaizen' },
    ],
  },
  {
    key: 'users',
    label: 'Users',
    to: '/dashboard/users',
    icon: FiUsers,
    children: [
      { key: 'users-all', label: 'All users', to: '/dashboard/users' },
    ],
  },
]

export default navItems
