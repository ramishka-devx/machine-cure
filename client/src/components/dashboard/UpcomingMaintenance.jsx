import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Wrench, AlertCircle } from 'lucide-react';
import { maintenanceService } from '../../services/maintenance';

const UpcomingMaintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingMaintenance = async () => {
      try {
        setLoading(true);
        const response = await maintenanceService.getUpcomingMaintenance({
          limit: 5 // Show only the next 5 upcoming maintenance items
        });
        setMaintenance(response.data.rows || []);
      } catch (err) {
        console.error('Error fetching upcoming maintenance:', err);
        setError('Failed to load upcoming maintenance');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMaintenance();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'preventive':
        return 'text-blue-600 bg-blue-50';
      case 'corrective':
        return 'text-purple-600 bg-purple-50';
      case 'predictive':
        return 'text-green-600 bg-green-50';
      case 'emergency':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleMaintenanceClick = (maintenanceId) => {
    navigate(`/dashboard/maintenance`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Maintenance</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-50 p-2 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Maintenance</h3>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 mb-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Maintenance</h3>
        </div>
        <span className="text-sm text-gray-500">
          {maintenance.length} scheduled
        </span>
      </div>

      {maintenance.length === 0 ? (
        <div className="text-center py-8">
          <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No upcoming maintenance scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {maintenance.map((item) => (
            <div key={item.maintenance_id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleMaintenanceClick(item.maintenance_id)}>
              <div className="flex-shrink-0">
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <Wrench className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {item.machine_title}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.scheduled_date)}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type}
                  </div>
                  {item.estimated_duration_hours > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.estimated_duration_hours}h</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMaintenance;