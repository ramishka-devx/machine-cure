import React, { useState, useEffect } from 'react';
import { kaizensService } from '../../../services/kaizens.js';

const KaizenStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await kaizensService.getStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const totalKaizens = stats.byStatus?.reduce((sum, status) => sum + status.count, 0) || 0;
  const completedKaizens = stats.byStatus?.find(s => s.name.toLowerCase() === 'completed')?.count || 0;
  const inProgressKaizens = stats.byStatus?.find(s => s.name.toLowerCase() === 'in progress')?.count || 0;
  const completionRate = totalKaizens > 0 ? ((completedKaizens / totalKaizens) * 100).toFixed(1) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Kaizens */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Kaizens</p>
              <p className="text-2xl font-bold text-gray-900">{totalKaizens}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              <p className="text-xs text-gray-500">{completedKaizens} of {totalKaizens} completed</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressKaizens}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Savings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Est. Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.savings?.estimated_total)}
              </p>
              {stats.savings?.actual_total > 0 && (
                <p className="text-xs text-green-600">
                  {formatCurrency(stats.savings.actual_total)} realized
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      {stats.byStatus && stats.byStatus.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Status Breakdown</h4>
          <div className="flex flex-wrap gap-3">
            {stats.byStatus.map((status) => (
              <div key={status.name} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.name)}`}></div>
                <span className="text-sm text-gray-600">
                  {status.name}: <span className="font-medium">{status.count}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Categories */}
      {stats.topCategories && stats.topCategories.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Top Categories</h4>
          <div className="space-y-2">
            {stats.topCategories.slice(0, 3).map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{category.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(category.count / Math.max(...stats.topCategories.map(c => c.count))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (statusName) => {
  switch (statusName.toLowerCase()) {
    case 'completed': return 'bg-green-500';
    case 'in progress': return 'bg-blue-500';
    case 'approved': return 'bg-purple-500';
    case 'under review': return 'bg-yellow-500';
    case 'submitted': return 'bg-gray-500';
    case 'rejected': return 'bg-red-500';
    case 'on hold': return 'bg-orange-500';
    default: return 'bg-gray-400';
  }
};

export default KaizenStats;