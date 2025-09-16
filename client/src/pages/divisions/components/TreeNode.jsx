import React, { useState } from 'react';

const TreeNode = ({ 
  node, 
  level = 0, 
  onEdit, 
  onDelete, 
  onToggleExpand,
  isExpanded: externalIsExpanded = true,
  expandedNodes = new Set()
}) => {
  // Use external expansion state if provided, otherwise fall back to internal state
  const nodeIsExpanded = expandedNodes.has(node.division_id);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand(node.division_id, !nodeIsExpanded);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(node);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(node);
    }
  };

  return (
    <div className="select-none">
      {/* Current Node */}
      <div 
        className={`flex items-center py-2 px-3 hover:bg-gray-50 border-l-2 ${
          level === 0 ? 'border-blue-500' : 'border-gray-200'
        }`}
        style={{ marginLeft: `${level * 20}px` }}
      >
        {/* Expand/Collapse Button */}
        <div className="flex items-center mr-3">
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-transform duration-200"
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  nodeIsExpanded ? 'rotate-90' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Node Content */}
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Division Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
              level === 0 ? 'bg-blue-500' : 'bg-gray-400'
            }`}>
              {node.title.charAt(0).toUpperCase()}
            </div>
            
            {/* Division Info */}
            <div>
              <div className="font-medium text-gray-900">{node.title}</div>
              <div className="text-sm text-gray-500">
                ID: {node.division_id} | Type: {node.division_type_id}
                {node.parent_id && ` | Parent: ${node.parent_id}`}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit division"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete division"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Children Nodes */}
      {hasChildren && nodeIsExpanded && (
        <div className="ml-2">
          {node.children.map((child) => (
            <TreeNode
              key={child.division_id}
              node={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleExpand={onToggleExpand}
              expandedNodes={expandedNodes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;