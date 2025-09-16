import React, { useState, useEffect } from 'react';
import TreeNode from './TreeNode.jsx';
import { buildDivisionTree, countDivisionsInTree } from '../../../utils/divisionsTree.js';

const DivisionsTree = ({ 
  divisions, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  // Build tree structure from flat data
  const treeData = buildDivisionTree(divisions);
  const totalCount = countDivisionsInTree(treeData);

  // Initialize expanded state with all nodes expanded by default
  useEffect(() => {
    if (treeData.length > 0) {
      const allIds = new Set();
      const collectIds = (nodes) => {
        nodes.forEach(node => {
          allIds.add(node.division_id);
          if (node.children && node.children.length > 0) {
            collectIds(node.children);
          }
        });
      };
      collectIds(treeData);
      setExpandedNodes(allIds);
    }
  }, [treeData.length]); // Changed dependency to avoid infinite loops

  const handleToggleExpand = (nodeId, isExpanded) => {
    const newExpanded = new Set(expandedNodes);
    if (isExpanded) {
      newExpanded.add(nodeId);
    } else {
      newExpanded.delete(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleExpandAll = () => {
    const allIds = new Set();
    const collectIds = (nodes) => {
      nodes.forEach(node => {
        allIds.add(node.division_id);
        if (node.children && node.children.length > 0) {
          collectIds(node.children);
        }
      });
    };
    collectIds(treeData);
    setExpandedNodes(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading divisions tree...</span>
        </div>
      </div>
    );
  }

  if (!divisions || divisions.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No divisions</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new division.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Divisions Hierarchy</h2>
            <p className="text-sm text-gray-500 mt-1">
              {totalCount} division{totalCount !== 1 ? 's' : ''} in {treeData.length} root categor{treeData.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
          
          {/* Tree Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExpandAll}
              className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="p-4">
        {treeData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No root divisions found. All divisions seem to have parents that don't exist.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {treeData.map((rootNode) => (
              <div key={rootNode.division_id} className="group">
                <TreeNode
                  node={rootNode}
                  level={0}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleExpand={handleToggleExpand}
                  expandedNodes={expandedNodes}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tree Statistics */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>
            {treeData.length} root node{treeData.length !== 1 ? 's' : ''} • {totalCount} total divisions
          </span>
          <span>
            Click nodes to expand/collapse • Hover for actions
          </span>
        </div>
      </div>
    </div>
  );
};

export default DivisionsTree;