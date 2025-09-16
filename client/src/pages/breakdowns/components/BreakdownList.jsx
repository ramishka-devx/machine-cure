import React, { useState, useEffect } from 'react';
import { breakdownService } from '../../../services/breakdowns';
import { machinesService } from '../../../services/machines.js';
import { divisionsService } from '../../../services/divisions.js';
import BreakdownDetail from './BreakdownDetail';
import FilterModal from './FilterModal';

const BreakdownList = ({ refreshTrigger }) => {
  const [breakdowns, setBreakdowns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    q: '',
    machine_id: '',
    division_id: '',
    status_id: '',
    category_id: '',
    severity: '',
    is_active: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  // Dropdown data
  const [machines, setMachines] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  
  // Modal state
  const [selectedBreakdownId, setSelectedBreakdownId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  
  // Message state
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [machinesRes, divisionsRes, categoriesRes, statusesRes] = await Promise.all([
          machinesService.getAllMachines(),
          divisionsService.getAllDivisions(),
          breakdownService.getCategories(),
          breakdownService.getStatuses()
        ]);
        
        setMachines(machinesRes?.data?.rows || []);
        setDivisions(divisionsRes?.data || []);
        setCategories(categoriesRes?.data || []);
        setStatuses(statusesRes?.data || []);
      } catch (error) {
        console.error('Error loading dropdown data:', error);
      }
    };

    loadDropdownData();
  }, []);

  // Load breakdowns
  const loadBreakdowns = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit: pagination.limit
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await breakdownService.getAllBreakdowns(params);
      
      if (response?.data) {
        setBreakdowns(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          page: response.data.pagination?.page || page,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Error loading breakdowns:', error);
      setBreakdowns([]);
    } finally {
      setLoading(false);
    }
  };

  // Load breakdowns on component mount and when filters change
  useEffect(() => {
    loadBreakdowns(1);
  }, [filters, refreshTrigger]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageChange = (newPage) => {
    loadBreakdowns(newPage);
  };

  const handleStatusUpdate = async (breakdownId, newStatusId) => {
    if (!newStatusId) return; // Don't process empty selections
    
    try {
      setLoading(true);
      await breakdownService.updateBreakdownStatus(breakdownId, newStatusId);
      await loadBreakdowns(pagination.page); // Refresh current page
      setMessage({ type: 'success', text: 'Status updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage({ type: 'error', text: 'Error updating status. Please try again.' });
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-400 text-gray-900';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusBadgeClass = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case 'reported': return 'bg-purple-600 text-white';
      case 'assigned': return 'bg-cyan-400 text-gray-900';
      case 'in repair': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-green-600 text-white';
      case 'verified': return 'bg-teal-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (startTime, endTime) => {
    if (!endTime) return 'Ongoing';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return `${diffHours.toFixed(1)} hours`;
    } else {
      const diffDays = diffHours / 24;
      return `${diffDays.toFixed(1)} days`;
    }
  };

  // Modal functions
  const handleViewBreakdown = (breakdown) => {
    setSelectedBreakdownId(breakdown.breakdown_id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBreakdownId(null);
  };

  const handleModalStatusUpdate = () => {
    // Refresh the list when status is updated from modal
    loadBreakdowns(pagination.page);
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      machine_id: '',
      division_id: '',
      status_id: '',
      category_id: '',
      severity: '',
      is_active: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      
      {/* Success/Error Messages */}
      {message.text && (
        <div className={`p-3 mb-5 rounded-md font-medium border animate-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Filters Button */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowFiltersModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v6.586a.5.5 0 01-.707.35l-4-2A.5.5 0 018 18.586v-5.172a1 1 0 00-.293-.707L1.293 6.293A1 1 0 011 5.586V4z" />
          </svg>
          Filters & Search
        </button>
        
        {/* Active Filters Count */}
        {Object.values(filters).some(value => value && value !== 'created_at' && value !== 'desc') && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {Object.values(filters).filter(value => value && value !== 'created_at' && value !== 'desc').length} active filters
          </span>
        )}
      </div>

      {/* Filters Modal */}
      <FilterModal
        showModal={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        machines={machines}
        divisions={divisions}
        statuses={statuses}
        categories={categories}
      />

      {/* Loading */}
      {loading && <div className="text-center py-10 text-gray-600 text-base">Loading breakdowns...</div>}

      {/* Breakdowns Table */}
      {!loading && (
        <div className="overflow-x-auto mb-5">
          <table className="w-full border-collapse bg-white text-sm md:text-base">
            <thead>
              <tr>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">ID</th>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Title</th>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Machine</th>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Category</th>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Severity</th>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Status</th>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Reported</th>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Duration</th>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Assigned To</th>
                <th className="bg-gray-50 p-2 md:p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {breakdowns.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-gray-600 italic py-10">No breakdowns found</td>
                </tr>
              ) : (
                breakdowns.map(breakdown => (
                  <tr key={breakdown.breakdown_id} className="hover:bg-gray-50">
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">#{breakdown.breakdown_id}</td>
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">
                      <div className="font-semibold text-gray-700">
                        {breakdown.title}
                      </div>
                    </td>
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">
                      <div className="text-gray-700">
                        <div className="font-semibold">{breakdown.machine?.title}</div>
                        <small className="text-gray-600 text-xs">{breakdown.machine?.division?.title}</small>
                      </div>
                    </td>
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">{breakdown.category?.name}</td>
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">
                      <span className={`px-2 py-1 rounded-xl text-xs font-semibold uppercase whitespace-nowrap ${getSeverityBadgeClass(breakdown.severity)}`}>
                        {breakdown.severity}
                      </span>
                    </td>
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">
                      <span className={`px-2 py-1 rounded-xl text-xs font-semibold uppercase whitespace-nowrap ${getStatusBadgeClass(breakdown.status?.name)}`}>
                        {breakdown.status?.name}
                      </span>
                    </td>
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">
                      <div className="text-gray-700">
                        <div className="text-sm">{formatDateTime(breakdown.reported_at)}</div>
                        <small className="text-gray-600 text-xs">by {breakdown.reported_by?.first_name} {breakdown.reported_by?.last_name}</small>
                      </div>
                    </td>
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">
                      {formatDuration(breakdown.breakdown_start_time, breakdown.breakdown_end_time)}
                    </td>
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">
                      {breakdown.assigned_to ? (
                        `${breakdown.assigned_to.first_name} ${breakdown.assigned_to.last_name}`
                      ) : (
                        <span className="text-red-600 italic text-sm">Unassigned</span>
                      )}
                    </td>
                    <td className="p-2 md:p-3 border-b border-gray-200 align-top">
                      <div className="flex flex-col gap-2 min-w-[80px] md:min-w-[120px]">
                        <button
                          onClick={() => handleViewBreakdown(breakdown)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                        
                        <select
                          onChange={(e) => handleStatusUpdate(breakdown.breakdown_id, e.target.value)}
                          value=""
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Change Status</option>
                          {statuses.map(status => (
                            <option 
                              key={status.status_id} 
                              value={status.status_id}
                              disabled={status.status_id === breakdown.status?.status_id}
                            >
                              {status.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-5 mt-5">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-5 py-2.5 bg-gray-600 text-white rounded border-none cursor-pointer text-sm font-semibold hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <span className="text-gray-600 text-sm">
            Page {pagination.page} of {pagination.totalPages} 
            ({pagination.total} total results)
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-5 py-2.5 bg-gray-600 text-white rounded border-none cursor-pointer text-sm font-semibold hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Breakdown Detail Modal */}
      {showModal && selectedBreakdownId && (
        <BreakdownDetail
          breakdownId={selectedBreakdownId}
          onClose={handleCloseModal}
          onStatusUpdate={handleModalStatusUpdate}
        />
      )}
    </div>
  );
};

export default BreakdownList;