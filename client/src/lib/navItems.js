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
    key: 'divisions',
    label: 'Divisions',
    to: '/dashboard/divisions',
    icon: FiHome,
    children: [
      { key: 'divisions', label: 'divisions', to: '/dashboard/divisions' },
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
  // {
  //   key: 'records',
  //   label: 'Records',
  //   to: '/dashboard/records',
  //   icon: FiDatabase,
  //   children: [
  //     { key: 'records-production', label: 'Production records', to: '/dashboard/records' },
  //     { key: 'records-energy', label: 'Energy usage', to: '/dashboard/records' },
  //   ],
  // },
  {
    key: 'maintenance',
    label: 'Maintenance',
    to: '/dashboard/maintenance',
    icon: FiTool,
    children: [
      { key: 'maintenance-overview', label: 'Overview', to: '/dashboard/maintenance' },
      { key: 'maintenance-types', label: 'Types', to: '/dashboard/maintenance?tab=types' },
      { key: 'maintenance-schedules', label: 'Schedules', to: '/dashboard/maintenance?tab=schedules' },
      { key: 'maintenance-records', label: 'Work Orders', to: '/dashboard/maintenance?tab=records' },
      { key: 'maintenance-parts', label: 'Parts Inventory', to: '/dashboard/maintenance?tab=parts' },
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
    key: 'kaizens',
    label: 'Kaizens',
    to: '/dashboard/kaizens',
    icon: FiZap,
    children: [
      { key: 'kaizens-all', label: 'All Kaizens', to: '/dashboard/kaizens' },
      { key: 'kaizens-my', label: 'My Kaizens', to: '/dashboard/kaizens?submitted_by=me' },
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
