/**
 * Utility functions for building and managing division trees
 */

/**
 * Converts flat division array into hierarchical tree structure
 * @param {Array} divisions - Flat array of division objects
 * @returns {Array} Hierarchical tree structure
 */
export const buildDivisionTree = (divisions) => {
  if (!divisions || !Array.isArray(divisions)) {
    return [];
  }

  // Create a map for quick lookup
  const divisionMap = new Map();
  const roots = [];

  // First pass: create map and initialize children arrays
  divisions.forEach(division => {
    divisionMap.set(division.division_id, {
      ...division,
      children: []
    });
  });

  // Second pass: build parent-child relationships
  divisions.forEach(division => {
    const divisionNode = divisionMap.get(division.division_id);
    
    if (division.parent_id === null || division.parent_id === undefined) {
      // This is a root node
      roots.push(divisionNode);
    } else {
      // This has a parent, add it to parent's children
      const parent = divisionMap.get(division.parent_id);
      if (parent) {
        parent.children.push(divisionNode);
      } else {
        // Parent not found, treat as root (orphaned node)
        roots.push(divisionNode);
      }
    }
  });

  return roots;
};

/**
 * Flattens tree structure back to flat array (useful for updates)
 * @param {Array} tree - Hierarchical tree structure
 * @returns {Array} Flat array of divisions
 */
export const flattenDivisionTree = (tree) => {
  const result = [];
  
  const traverse = (nodes) => {
    nodes.forEach(node => {
      const { children, ...division } = node;
      result.push(division);
      if (children && children.length > 0) {
        traverse(children);
      }
    });
  };
  
  traverse(tree);
  return result;
};

/**
 * Finds a division in the tree by ID
 * @param {Array} tree - Hierarchical tree structure
 * @param {number} divisionId - ID to search for
 * @returns {Object|null} Found division node or null
 */
export const findDivisionInTree = (tree, divisionId) => {
  const search = (nodes) => {
    for (const node of nodes) {
      if (node.division_id === divisionId) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = search(node.children);
        if (found) return found;
      }
    }
    return null;
  };
  
  return search(tree);
};

/**
 * Counts total number of divisions in tree
 * @param {Array} tree - Hierarchical tree structure
 * @returns {number} Total count
 */
export const countDivisionsInTree = (tree) => {
  let count = 0;
  
  const traverse = (nodes) => {
    nodes.forEach(node => {
      count++;
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  
  traverse(tree);
  return count;
};

/**
 * Gets all root divisions (divisions with no parent)
 * @param {Array} divisions - Flat array of division objects
 * @returns {Array} Array of root divisions
 */
export const getRootDivisions = (divisions) => {
  return divisions.filter(division => 
    division.parent_id === null || division.parent_id === undefined
  );
};

/**
 * Gets all child divisions for a given parent ID
 * @param {Array} divisions - Flat array of division objects
 * @param {number} parentId - Parent division ID
 * @returns {Array} Array of child divisions
 */
export const getChildDivisions = (divisions, parentId) => {
  return divisions.filter(division => division.parent_id === parentId);
};
