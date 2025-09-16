import React, { useState, useEffect } from 'react';
import { divisionsService } from '../../../services/divisions.js';
import { buildDivisionTree } from '../../../utils/divisionsTree.js';
import CustomDropdown from '../../../components/CustomDropdown.jsx';

const ParentDivisionSelect = ({ 
  value, 
  onChange, 
  disabled = false, 
  required = false,
  className = "",
  placeholder = "Select parent division (optional)...",
  excludeDivisionId = null // Exclude a specific division (useful for edit to prevent self-selection)
}) => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch divisions on component mount
  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await divisionsService.getAllDivisions();
      
      if (response.success) {
        // Filter out the excluded division (usually the current division being edited)
        const filteredDivisions = excludeDivisionId 
          ? response.data.filter(div => div.division_id !== excludeDivisionId)
          : response.data;
        
        setDivisions(filteredDivisions);
      } else {
        setError(response.message || 'Failed to fetch divisions');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch divisions');
      console.error('Error fetching divisions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (selectedValue) => {
    if (onChange) {
      // Convert to number if not empty, otherwise pass null
      onChange(selectedValue ? parseInt(selectedValue, 10) : null);
    }
  };

  const handleRetry = () => {
    fetchDivisions();
  };

  // Build hierarchical structure and flatten for display
  const buildHierarchicalOptions = () => {
    if (divisions.length === 0) return [];

    // Build tree structure
    const treeData = buildDivisionTree(divisions);
    
    // Flatten tree with hierarchy indicators
    const flattenWithHierarchy = (nodes, level = 0, parentPrefix = '') => {
      let result = [];
      
      nodes.forEach((node, index) => {
        const isLast = index === nodes.length - 1;
        
        // Build the current prefix based on level and position
        let currentPrefix = '';
        if (level === 0) {
          currentPrefix = '';
        } else {
          // Add the connector for this level
          const connector = isLast ? '└── ' : '├── ';
          currentPrefix = parentPrefix + connector;
        }
        
        // Build the prefix for children (continuation of parent hierarchy)
        let childPrefix = '';
        if (level === 0) {
          childPrefix = '';
        } else {
          // If this is the last child, use spaces; otherwise use vertical line
          const continuation = isLast ? '    ' : '│   ';
          childPrefix = parentPrefix + continuation;
        }

        result.push({
          value: node.division_id,
          label: node.title,
          displayName: currentPrefix + node.title,
          subtitle: `(ID: ${node.division_id}) [${node.divition_type}]`,
          level,
          hasChildren: node.children && node.children.length > 0,
          customContent: (
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-mono text-sm">
                  {currentPrefix + node.title}
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-0 font-mono">
                ID: {node.division_id} • {node.divition_type}
              </div>
            </div>
          )
        });

        if (node.children && node.children.length > 0) {
          result = result.concat(flattenWithHierarchy(node.children, level + 1, childPrefix));
        }
      });

      return result;
    };

    return flattenWithHierarchy(treeData);
  };

  const hierarchicalOptions = buildHierarchicalOptions();

  // Debug: Log the hierarchical options
  useEffect(() => {
    if (hierarchicalOptions.length > 0) {
      console.log('ParentDivisionSelect hierarchicalOptions:', hierarchicalOptions);
      console.log('Hierarchy structure:');
      hierarchicalOptions.forEach((option, index) => {
        console.log(`${index + 1}. "${option.displayName}" (ID: ${option.value}) [${option.subtitle}] - Level: ${option.level}`);
      });
    }
  }, [hierarchicalOptions]);

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <select 
          disabled 
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
        >
          <option>Loading divisions...</option>
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
          <option>Error loading divisions</option>
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
      <CustomDropdown
        value={value || ''}
        onChange={handleSelectChange}
        options={hierarchicalOptions}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxHeight="300px"
        searchable={true}
        className="w-full"
      />
      
      {divisions.length === 0 && !loading && !error && (
        <div className="mt-1 text-xs text-gray-500">
          No divisions available as parent
        </div>
      )}
      
      {excludeDivisionId && (
        <div className="mt-1 text-xs text-gray-500">
          Current division excluded from parent options
        </div>
      )}

    </div>
  );
};

export default ParentDivisionSelect;