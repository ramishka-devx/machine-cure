import React from "react";
import { Factory, Users, AlertTriangle, Wrench } from "lucide-react";

const MetricCard = ({ title, value, icon, color = "blue", trend }) => {
  const colorClasses = {
    blue: {
      bg: "bg-white border-gray-200",
      text: "text-gray-900",
      accent: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    green: {
      bg: "bg-white border-gray-200",
      text: "text-gray-900",
      accent: "text-green-600",
      iconBg: "bg-green-50",
    },
    red: {
      bg: "bg-white border-red-200",
      text: "text-gray-900",
      accent: "text-red-600",
      iconBg: "bg-red-50",
    },
    purple: {
      bg: "bg-white border-gray-200",
      text: "text-gray-900",
      accent: "text-purple-600",
      iconBg: "bg-purple-50",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`${colors.bg} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${colors.text} mb-1`}>{value}</p>
          {trend && <p className="text-xs text-gray-500">{trend}</p>}
        </div>
        {icon && (
          <div className={`${colors.iconBg} p-3 rounded-lg`}>
            <div className={`${colors.accent}`}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricsSection = ({ metrics, loading = false }) => {
  if (loading) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
                  <div className="h-8 bg-gray-200 rounded mb-1 w-12"></div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Machines"
          value={metrics?.machine_count || 0}
          icon={<Factory className="w-5 h-5" />}
          color="blue"
          trend="Active equipment"
        />
        <MetricCard
          title="System Users"
          value={metrics?.user_count || 0}
          icon={<Users className="w-5 h-5" />}
          color="blue"
          trend="Registered users"
        />
        <MetricCard
          title="Active Issues"
          value={metrics?.active_breakdowns || 0}
          icon={<AlertTriangle className="w-5 h-5" />}
          color={metrics?.active_breakdowns > 0 ? "red" : "blue"}
          trend={
            metrics?.active_breakdowns > 0 ? "Requires attention" : "All clear"
          }
        />
        <MetricCard
          title="Today's Tasks"
          value={metrics?.today_maintenance || 0}
          icon={<Wrench className="w-5 h-5" />}
          color="blue"
          trend="Maintenance scheduled"
        />
      </div>
    </div>
  );
};

export default MetricsSection;
