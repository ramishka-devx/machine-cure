import React from 'react'
import { FiChevronLeft, FiChevronRight, FiSearch, FiBell, FiMenu } from 'react-icons/fi'

const Topbar = ({ query, setQuery, onBack, onMenu, collapsed = false }) => {
  return (
    <header className="h-16 border-b border-b-gray-200 bg-white flex items-center justify-between px-3 sm:px-5">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Mobile menu toggle */}
        <button onClick={onMenu} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Open menu">
          <FiMenu />
        </button>
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
        <div className="relative flex-1 max-w-[34rem]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e)=> setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 pl-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100" aria-label="Notifications">
          <FiBell />
          <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] bg-rose-500 text-white rounded-full flex items-center justify-center">2</span>
        </button>
        <div className="flex items-center gap-2">
          <img className="h-9 w-9 rounded-full" src="https://i.pravatar.cc/100" />
          <div className="leading-tight hidden sm:block">
            <div className="text-sm font-medium">Ramishka Geenath</div>
            <div className="text-xs text-gray-500">Engineer</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
