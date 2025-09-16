import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateBreakdown from './components/CreateBreakdown';
import BreakdownList from './components/BreakdownList';

// Loading Skeleton Component
const LoadingSkeleton = ({ isCreateForm = false }) => {
  if (isCreateForm) {
    // Create Form Skeleton
    return (
      <div className="max-w-6xl mx-auto p-5 animate-pulse">
        {/* Tab Navigation Skeleton */}
        <div className="flex border-gray-200 mb-5 flex-col md:flex-row">
          <div className="px-6 py-3">
            <div className="h-6 bg-gray-300 rounded w-40"></div>
          </div>
          <div className="px-6 py-3">
            <div className="h-6 bg-blue-300 rounded w-40"></div>
          </div>
        </div>

        {/* Create Form Skeleton */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
          
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <div className="h-10 w-20 bg-gray-300 rounded"></div>
            <div className="h-10 w-32 bg-blue-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // List View Skeleton
  return (
    <div className="max-w-6xl mx-auto p-5 animate-pulse">
      {/* Tab Navigation Skeleton */}
      <div className="flex border-gray-200 mb-5 flex-col md:flex-row">
        <div className="px-6 py-3">
          <div className="h-6 bg-blue-300 rounded w-40"></div>
        </div>
        <div className="px-6 py-3">
          <div className="h-6 bg-gray-300 rounded w-40"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        {/* Filter/Search Bar Skeleton */}
        <div className="bg-white p-4 rounded-lg shadow ">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="w-40">
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="w-32">
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Table Header Skeleton */}
        <div className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>

          {/* Table Rows Skeleton */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="px-6 py-4 border-b border-gray-100">
              <div className="grid grid-cols-7 gap-4 items-center">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-8 w-8 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Breakdowns = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine initial tab based on URL
  const getInitialTab = () => {
    if (location.pathname.includes('/new')) {
      return 'create';
    }
    return 'list';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Update active tab when URL changes
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  // Simulate initial loading (you can replace this with actual loading logic)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  const handleBreakdownCreated = (newBreakdown) => {
    // Trigger refresh of the breakdown list
    setRefreshTrigger(prev => prev + 1);
    // Switch to list view to see the new breakdown
    setActiveTab('list');
    navigate('/dashboard/breakdown');
  };

  const handleTabChange = (tab) => {
    setIsLoading(true);
    setActiveTab(tab);
    
    // Update URL based on tab
    if (tab === 'create') {
      navigate('/dashboard/breakdown/new');
    } else {
      navigate('/dashboard/breakdown');
    }
    
    // Simulate tab loading
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Show loading skeleton
  if (isLoading) {
    return <LoadingSkeleton isCreateForm={activeTab === 'create'} />;
  }

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
      <div className=''>
        {activeTab === 'list' && (
          <BreakdownList
            refreshTrigger={refreshTrigger}
          />
        )}
        
        {activeTab === 'create' && (
          <CreateBreakdown
            onBreakdownCreated={handleBreakdownCreated}
            onCancel={() => {
              setActiveTab('list');
              navigate('/dashboard/breakdown');
            }}
          />
        )}
      </div>
    </div>
  );
};
