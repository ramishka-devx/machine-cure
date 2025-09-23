import React, { useState, useRef } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import SearchResults from '../components/SearchResults'
import { navItems } from '../lib/navItems'

const DashboardLayout = () => {
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const searchWrapRef = useRef(null)

  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/dashboard/users')) return 'User Management'
    if (pathname.startsWith('/dashboard/machines')) return 'Machine Management'
    if (pathname.startsWith('/dashboard/divisions')) return 'Division Management'
    if (pathname.startsWith('/dashboard/maintenance')) return 'Maintenance Management'
    if (pathname.startsWith('/dashboard/breakdown')) return 'Breakdown Management'
    if (pathname.startsWith('/dashboard/kaizens')) return 'Kaizen Management'
    if (pathname === '/dashboard') return 'Dashboard'
    return 'Dashboard'
  }

  const onPickSearch = (opt) => {
    setQuery('')
    navigate(opt.to)
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={`min-h-screen bg-gray-100 grid grid-cols-1 lg:grid-cols-[auto_1fr]`}>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onNavigate={() => {}} />
      </div>

      {/* Off-canvas sidebar for mobile */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onNavigate={closeSidebar} />
      </div>
      {sidebarOpen && <div onClick={closeSidebar} className="lg:hidden fixed inset-0 bg-black/40 z-40" />}

      {/* Main column */}
      <div className="flex flex-col min-w-0">
        <div className="relative" ref={searchWrapRef}>
          <Topbar collapsed={collapsed} query={query} setQuery={setQuery} onBack={() => setCollapsed((v) => !v)} onMenu={() => setSidebarOpen(true)} />
          <div className="px-3 sm:px-5">
            <SearchResults query={query} data={navItems} onPick={onPickSearch} />
          </div>
        </div>
        <main className="flex-1 ">
          <div className='bg-blue-500 text-white p-6 mb-2'>
            <h1>{getPageTitle(location.pathname)}</h1>
          </div>
          <div className="m-3 sm:m-4 rounded-sm overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
