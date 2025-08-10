import React from 'react'
import { NavLink } from 'react-router-dom'
import { navItems } from '../lib/navItems'
const Sidebar = ({ onNavigate, collapsed = false }) => {
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-72 lg:w-64'} bg-gray-50 border-r border-gray-200 h-full flex flex-col shadow-sm transition-[width] duration-300 ease-in-out`}>
      {/* Header */}
      <div className={`px-6 py-6 bg-white border-b border-gray-200 ${collapsed ? 'flex items-center justify-center' : ''} transition-[padding] duration-300 ease-in-out`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="h-10 w-10 flex items-center justify-center text-white rounded-xl shadow-sm">
           <img src="/logo.png" alt="" />
          </div>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <div className="font-semibold text-gray-900 text-base whitespace-nowrap">Machine Cure</div>
            <div className="text-xs text-gray-500 font-medium whitespace-nowrap">Machine Monitoring</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 bg-gray-50 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.key}
                to={item.to}
                onClick={onNavigate}
                title={item.label}
                className={({ isActive }) =>
                  `group w-full flex ${collapsed ? 'justify-center' : 'items-center gap-3'} px-3 py-2.5 rounded-xl transition-colors duration-200 ${
                    isActive 
                      ? 'bg-white text-blue-700 shadow-sm border border-blue-100' 
                      : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                  }`
                }
              >
                <Icon className={`text-lg transition-transform group-hover:scale-105`} />
                <span className={`text-sm font-medium overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-gray-200">
        <button className={`w-full flex ${collapsed ? 'justify-center' : 'items-center justify-center gap-2'} bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2.5 px-4 transition-colors duration-200 font-medium text-sm`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className={`${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'} overflow-hidden transition-all duration-300 ease-in-out`}>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar