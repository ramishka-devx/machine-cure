import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { maintenanceTypesService } from '../../services/maintenanceTypes.js';
import { maintenanceSchedulesService } from '../../services/maintenanceSchedules.js';
import { maintenanceRecordsService } from '../../services/maintenanceRecords.js';
import { partsService } from '../../services/parts.js';
import MaintenanceTypes from './components/MaintenanceTypes.jsx';
import MaintenanceSchedules from './components/MaintenanceSchedules.jsx';
import MaintenanceRecords from './components/MaintenanceRecords.jsx';
import PartsInventory from './components/PartsInventory.jsx';

const Maintenance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dashboardData, setDashboardData] = useState({
    overdueSchedules: [],
    recentRecords: [],
    lowStockParts: [],
    stats: {
      totalSchedules: 0,
      overdueCount: 0,
      completedToday: 0,
      lowStockCount: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabKey });
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard data in parallel
      const [overdueSchedules, recentRecords, lowStockParts, recordStats] = await Promise.all([
        maintenanceSchedulesService.getOverdueSchedules({ limit: 5 }),
        maintenanceRecordsService.getAllMaintenanceRecords({ 
          limit: 10, 
          sort: 'created_at',
          order: 'desc' 
        }),
        partsService.getLowStockParts({ limit: 10 }),
        maintenanceRecordsService.getMaintenanceRecordStats()
      ]);

      setDashboardData({
        overdueSchedules: overdueSchedules.data || [],
        recentRecords: recentRecords.data || [],
        lowStockParts: lowStockParts.data || [],
        stats: {
          totalSchedules: overdueSchedules.total || 0,
          overdueCount: overdueSchedules.data?.length || 0,
          completedToday: recordStats.completedToday || 0,
          lowStockCount: lowStockParts.data?.length || 0
        }
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">S</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Schedules</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.stats.totalSchedules}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">!</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-semibold text-red-600">{dashboardData.stats.overdueCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-semibold text-green-600">{dashboardData.stats.completedToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">P</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock Parts</p>
              <p className="text-2xl font-semibold text-orange-600">{dashboardData.stats.lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Schedules */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Overdue Maintenance</h3>
        </div>
        <div className="p-6">
          {dashboardData.overdueSchedules.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No overdue maintenance schedules</p>
          ) : (
            <div className="space-y-3">
              {dashboardData.overdueSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{schedule.machine_name}</p>
                    <p className="text-sm text-gray-600">{schedule.maintenance_type_name}</p>
                    <p className="text-xs text-red-600">Due: {new Date(schedule.next_due_date).toLocaleDateString()}</p>
                  </div>
                  <button 
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    onClick={() => handleTabChange('schedules')}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Parts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Low Stock Parts</h3>
        </div>
        <div className="p-6">
          {dashboardData.lowStockParts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">All parts are well stocked</p>
          ) : (
            <div className="space-y-3">
              {dashboardData.lowStockParts.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{part.name}</p>
                    <p className="text-sm text-gray-600">Current: {part.current_stock} | Min: {part.minimum_stock}</p>
                  </div>
                  <button 
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                    onClick={() => handleTabChange('parts')}
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage maintenance schedules, work orders, and inventory
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'types', label: 'Maintenance Types' },
            { key: 'schedules', label: 'Schedules' },
            { key: 'records', label: 'Work Orders' },
            { key: 'parts', label: 'Parts Inventory' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'types' && <MaintenanceTypes />}
        {activeTab === 'schedules' && <MaintenanceSchedules />}
        {activeTab === 'records' && <MaintenanceRecords />}
        {activeTab === 'parts' && <PartsInventory />}
      </div>
    </div>
  );
};

export default Maintenance;
