import React, { useState, useEffect } from 'react';
import { kaizensService } from '../../../services/kaizens.js';
import { divisionsService } from '../../../services/divisions.js';
import { usersService } from '../../../services/users.js';

const KaizenFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    status_id: '',
    category_id: '',
    priority: '',
    division_id: '',
    submitted_by: '',
    assigned_to: '',
    q: ''
  });

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [users, setUsers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      const [categoriesRes, statusesRes, divisionsRes, usersRes] = await Promise.all([
        kaizensService.getCategories(),
        kaizensService.getStatuses(),
        divisionsService.getAllDivisions(),
        usersService.getAllUsers({ limit: 100 })
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (statusesRes.success) setStatuses(statusesRes.data);
      if (divisionsRes.success) setDivisions(divisionsRes.data);
      if (usersRes.success) setUsers(usersRes.data.rows || []);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([key, value]) => value !== '')
    );

    onFiltersChange(cleanFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      status_id: '',
      category_id: '',
      priority: '',
      division_id: '',
      submitted_by: '',
      assigned_to: '',
      q: ''
    };
    setFilters(emptyFilters);
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        </div>

        {/* Search Bar - Always visible */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search kaizens..."
            value={filters.q}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quick Filters - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status_id}
              onChange={(e) => handleFilterChange('status_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All statuses</option>
              {statuses.map((status) => (
                <option key={status.status_id} value={status.status_id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <select
              value={filters.division_id}
              onChange={(e) => handleFilterChange('division_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All divisions</option>
              {divisions.map((division) => (
                <option key={division.division_id} value={division.division_id}>
                  {division.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submitted By
              </label>
              <select
                value={filters.submitted_by}
                onChange={(e) => handleFilterChange('submitted_by', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All submitters</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select
                value={filters.assigned_to}
                onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All assignees</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.q && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{filters.q}"
                  <button
                    onClick={() => handleFilterChange('q', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.status_id && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {statuses.find(s => s.status_id == filters.status_id)?.name}
                  <button
                    onClick={() => handleFilterChange('status_id', '')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.category_id && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Category: {categories.find(c => c.category_id == filters.category_id)?.name}
                  <button
                    onClick={() => handleFilterChange('category_id', '')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.priority && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Priority: {filters.priority}
                  <button
                    onClick={() => handleFilterChange('priority', '')}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.division_id && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Division: {divisions.find(d => d.division_id == filters.division_id)?.title}
                  <button
                    onClick={() => handleFilterChange('division_id', '')}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KaizenFilters;