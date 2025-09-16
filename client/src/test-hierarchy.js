// Test hierarchy building with more than 2 levels
import { buildDivisionTree } from './utils/divisionsTree.js';

// Sample data with 4 levels of hierarchy
const testDivisions = [
  { division_id: 1, title: 'Company', parent_id: null, divition_type: 'Organization' },
  { division_id: 2, title: 'Manufacturing', parent_id: 1, divition_type: 'Department' },
  { division_id: 3, title: 'Quality Control', parent_id: 1, divition_type: 'Department' },
  { division_id: 4, title: 'Production Line A', parent_id: 2, divition_type: 'Unit' },
  { division_id: 5, title: 'Production Line B', parent_id: 2, divition_type: 'Unit' },
  { division_id: 6, title: 'Testing Lab', parent_id: 3, divition_type: 'Unit' },
  { division_id: 7, title: 'Station 1', parent_id: 4, divition_type: 'Station' },
  { division_id: 8, title: 'Station 2', parent_id: 4, divition_type: 'Station' },
  { division_id: 9, title: 'Station 3', parent_id: 5, divition_type: 'Station' },
  { division_id: 10, title: 'Workbench A', parent_id: 7, divition_type: 'Workstation' },
  { division_id: 11, title: 'Workbench B', parent_id: 7, divition_type: 'Workstation' },
];

// Test the hierarchy building
const buildHierarchicalOptions = (divisions) => {
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
        ...node,
        level,
        displayName: currentPrefix + node.title,
        hasChildren: node.children && node.children.length > 0
      });

      if (node.children && node.children.length > 0) {
        result = result.concat(flattenWithHierarchy(node.children, level + 1, childPrefix));
      }
    });

    return result;
  };

  return flattenWithHierarchy(treeData);
};

// Test and display the results
console.log('Testing hierarchy with multiple levels:');
console.log('=====================================');

const hierarchicalOptions = buildHierarchicalOptions(testDivisions);
hierarchicalOptions.forEach((option, index) => {
  console.log(`${index + 1}. ${option.displayName} (Level: ${option.level}, ID: ${option.division_id})`);
});

export { testDivisions, buildHierarchicalOptions };