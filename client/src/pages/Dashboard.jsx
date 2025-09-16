import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import MetricsSection from '../components/dashboard/MetricsSection';
import QuickActionsPanel from '../components/dashboard/QuickActionsPanel';
import dashboardService from '../services/dashboard';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const metricsData = await dashboardService.getMetrics();
        setMetrics(metricsData.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <span className="text-red-600">⚠️</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold text-sm">Unable to load dashboard</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor your facility's operations and performance
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Last updated</div>
              <div className="font-medium">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <MetricsSection metrics={metrics} loading={loading} />

        {/* Quick Actions Panel */}
        <QuickActionsPanel />

        {/* Additional Info */}
        {!loading && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-lg mr-4 mt-1">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-2">
                  Welcome to Machine Cure
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your comprehensive machine monitoring and maintenance management system. 
                  Use the metrics above to monitor system health and quick actions to manage operations efficiently.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;