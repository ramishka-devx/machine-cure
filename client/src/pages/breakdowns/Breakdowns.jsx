import React, { useState } from 'react';
import CreateBreakdown from './components/CreateBreakdown';
import BreakdownList from './components/BreakdownList';

export const Breakdowns = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBreakdownCreated = (newBreakdown) => {
    // Trigger refresh of the breakdown list
    setRefreshTrigger(prev => prev + 1);
    // Switch to list view to see the new breakdown
    setActiveTab('list');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      {/* Tab Navigation */}
      <div className="flex border-b-2 border-gray-200 mb-5 flex-col md:flex-row">
        <button
          className={`px-6 py-3 border-none bg-none cursor-pointer text-base border-b-3 border-transparent transition-all duration-300 text-left md:text-center ${
            activeTab === 'list' 
              ? 'text-blue-600 border-b-blue-600 font-semibold' 
              : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => handleTabChange('list')}
        >
          Breakdown Management
        </button>
        <button
          className={`px-6 py-3 border-none bg-none cursor-pointer text-base border-b-3 border-transparent transition-all duration-300 text-left md:text-center ${
            activeTab === 'create' 
              ? 'text-blue-600 border-b-blue-600 font-semibold' 
              : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => handleTabChange('create')}
        >
           Report New Breakdown
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'list' && (
          <BreakdownList
            refreshTrigger={refreshTrigger}
          />
        )}
        
        {activeTab === 'create' && (
          <CreateBreakdown
            onBreakdownCreated={handleBreakdownCreated}
            onCancel={() => setActiveTab('list')}
          />
        )}
      </div>
    </div>
  );
};
