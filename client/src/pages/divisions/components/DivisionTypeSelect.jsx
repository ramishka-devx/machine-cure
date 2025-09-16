import React, { useState, useEffect } from 'react';
import { divisionTypesService } from '../../../services/divisionTypes.js';

const DivisionTypeSelect = ({ 
  value, 
  onChange, 
  disabled = false, 
  required = false,
  className = "",
  placeholder = "Select division type..."
}) => {
  const [divisionTypes, setDivisionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch division types on component mount
  useEffect(() => {
    fetchDivisionTypes();
  }, []);

  const fetchDivisionTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await divisionTypesService.getAllDivisionTypes();
      
      if (response.success) {
        setDivisionTypes(response.data);
      } else {
        setError(response.message || 'Failed to fetch division types');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch division types');
      console.error('Error fetching division types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  };

  const handleRetry = () => {
    fetchDivisionTypes();
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <select 
          disabled 
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
        >
          <option>Loading division types...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <select 
          disabled 
          className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-500"
        >
          <option>Error loading division types</option>
        </select>
        <div className="mt-1 text-xs text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <select
        value={value || ''}
        onChange={handleSelectChange}
        disabled={disabled}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
      >
        <option value="">{placeholder}</option>
        {divisionTypes.map((type) => (
          <option key={type.division_type_id} value={type.division_type_id}>
            {type.title} (ID: {type.division_type_id})
          </option>
        ))}
      </select>
      
      {divisionTypes.length === 0 && !loading && !error && (
        <div className="mt-1 text-xs text-gray-500">
          No division types available
        </div>
      )}
    </div>
  );
};

export default DivisionTypeSelect;