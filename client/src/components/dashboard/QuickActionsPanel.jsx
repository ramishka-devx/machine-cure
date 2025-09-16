import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lightbulb, Calendar, AlertTriangle, FileText } from 'lucide-react';

const ActionButton = ({ title, description, icon, color = 'blue', onClick, disabled = false }) => {
  const colorClasses = {
    blue: {
      base: 'bg-white border-gray-200 text-gray-900 hover:bg-blue-50 hover:border-blue-300',
      icon: 'text-blue-600 bg-blue-50',
    },
    green: {
      base: 'bg-white border-gray-200 text-gray-900 hover:bg-green-50 hover:border-green-300',
      icon: 'text-green-600 bg-green-50',
    },
    red: {
      base: 'bg-white border-gray-200 text-gray-900 hover:bg-red-50 hover:border-red-300',
      icon: 'text-red-600 bg-red-50',
    },
    yellow: {
      base: 'bg-white border-gray-200 text-gray-900 hover:bg-yellow-50 hover:border-yellow-300',
      icon: 'text-yellow-600 bg-yellow-50',
    },
    purple: {
      base: 'bg-white border-gray-200 text-gray-900 hover:bg-purple-50 hover:border-purple-300',
      icon: 'text-purple-600 bg-purple-50',
    }
  };

  const colors = colorClasses[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group p-6 border rounded-xl transition-all duration-200 
        ${disabled 
          ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50' 
          : `${colors.base} shadow-sm hover:shadow-md hover:scale-105`
        }
        flex flex-col items-center text-center min-h-[140px] justify-center
      `}
    >
      <div className={`
        p-3 rounded-lg mb-3 transition-colors duration-200
        ${disabled ? 'bg-gray-100 text-gray-400' : colors.icon}
      `}>
        <span className="text-lg">{icon}</span>
      </div>
      <h3 className={`font-semibold text-sm mb-1 ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-xs leading-relaxed ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
    </button>
  );
};

const QuickActionsPanel = () => {
  const navigate = useNavigate();

  const handleReportBreakdown = () => {
    navigate('/dashboard/breakdown/new');
  };

  const handleSubmitKaizen = () => {
    navigate('/dashboard/kaizen/new');
  };

  const handleScheduleMaintenance = () => {
    navigate('/dashboard/maintenance/new');
  };

  const handleViewCriticalIssues = () => {
    navigate('/dashboard/breakdown?severity=critical&is_active=true');
  };

  const handleGenerateReports = () => {
    navigate('/reports');
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Lightbulb className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600 mt-1">Common tasks and navigation shortcuts</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <ActionButton
          title="Report Issue"
          description="Report a new machine breakdown or problem"
          icon={<AlertCircle className="w-5 h-5" />}
          color="red"
          onClick={handleReportBreakdown}
        />
        <ActionButton
          title="Submit Kaizen"
          description="Share improvement suggestion"
          icon={<Lightbulb className="w-5 h-5" />}
          color="green"
          onClick={handleSubmitKaizen}
        />
        <ActionButton
          title="Schedule Task"
          description="Plan maintenance activity"
          icon={<Calendar className="w-5 h-5" />}
          color="blue"
          onClick={handleScheduleMaintenance}
        />
        <ActionButton
          title="Critical Issues"
          description="View urgent problems"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="yellow"
          onClick={handleViewCriticalIssues}
        />
        <ActionButton
          title="Reports"
          description="Generate system reports"
          icon={<FileText className="w-5 h-5" />}
          color="purple"
          onClick={handleGenerateReports}
        />
      </div>
    </div>
  );
};

export default QuickActionsPanel;