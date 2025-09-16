import Part from './part.model.js';

const PartService = {
  // Get all parts
  getAllParts: async (filters = {}) => {
    try {
      return await Part.getAll(filters);
    } catch (error) {
      throw new Error(`Failed to fetch parts: ${error.message}`);
    }
  },

  // Get part by ID
  getPartById: async (id) => {
    try {
      const part = await Part.getById(id);
      if (!part) {
        throw new Error('Part not found');
      }
      return part;
    } catch (error) {
      throw new Error(`Failed to fetch part: ${error.message}`);
    }
  },

  // Create new part
  createPart: async (partData) => {
    try {
      // Validate required fields
      if (!partData.part_number || !partData.name) {
        throw new Error('Part number and name are required');
      }

      // Check if part number already exists
      const existingPart = await Part.getByPartNumber(partData.part_number);
      if (existingPart) {
        throw new Error('Part number already exists');
      }

      const partId = await Part.create(partData);
      return await Part.getById(partId);
    } catch (error) {
      throw new Error(`Failed to create part: ${error.message}`);
    }
  },

  // Update part
  updatePart: async (id, partData) => {
    try {
      // Check if part exists
      const existingPart = await Part.getById(id);
      if (!existingPart) {
        throw new Error('Part not found');
      }

      // Validate required fields
      if (!partData.part_number || !partData.name) {
        throw new Error('Part number and name are required');
      }

      // Check if part number already exists (excluding current part)
      if (partData.part_number !== existingPart.part_number) {
        const duplicatePart = await Part.getByPartNumber(partData.part_number);
        if (duplicatePart) {
          throw new Error('Part number already exists');
        }
      }

      const updated = await Part.update(id, partData);
      if (!updated) {
        throw new Error('Failed to update part');
      }

      return await Part.getById(id);
    } catch (error) {
      throw new Error(`Failed to update part: ${error.message}`);
    }
  },

  // Delete part
  deletePart: async (id) => {
    try {
      // Check if part exists
      const existingPart = await Part.getById(id);
      if (!existingPart) {
        throw new Error('Part not found');
      }

      const deleted = await Part.delete(id);
      if (!deleted) {
        throw new Error('Failed to delete part');
      }

      return { message: 'Part deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete part: ${error.message}`);
    }
  },

  // Update stock level
  updatePartStock: async (id, quantity, operation = 'set') => {
    try {
      // Check if part exists
      const existingPart = await Part.getById(id);
      if (!existingPart) {
        throw new Error('Part not found');
      }

      // Validate quantity
      if (typeof quantity !== 'number' || quantity < 0) {
        throw new Error('Quantity must be a non-negative number');
      }

      // Validate operation
      if (!['set', 'add', 'subtract'].includes(operation)) {
        throw new Error('Operation must be set, add, or subtract');
      }

      const updated = await Part.updateStock(id, quantity, operation);
      if (!updated) {
        throw new Error('Failed to update stock');
      }

      return await Part.getById(id);
    } catch (error) {
      throw new Error(`Failed to update part stock: ${error.message}`);
    }
  },

  // Get low stock parts
  getLowStockParts: async () => {
    try {
      return await Part.getLowStock();
    } catch (error) {
      throw new Error(`Failed to fetch low stock parts: ${error.message}`);
    }
  },

  // Get parts by category
  getPartsByCategory: async () => {
    try {
      return await Part.getByCategory();
    } catch (error) {
      throw new Error(`Failed to fetch parts by category: ${error.message}`);
    }
  },

  // Get parts for machine
  getPartsForMachine: async (machineId) => {
    try {
      return await Part.getForMachine(machineId);
    } catch (error) {
      throw new Error(`Failed to fetch parts for machine: ${error.message}`);
    }
  },

  // Get part usage history
  getPartUsageHistory: async (partId, limit = 10) => {
    try {
      const part = await Part.getById(partId);
      if (!part) {
        throw new Error('Part not found');
      }

      return await Part.getUsageHistory(partId, limit);
    } catch (error) {
      throw new Error(`Failed to fetch part usage history: ${error.message}`);
    }
  },

  // Get inventory value
  getInventoryValue: async () => {
    try {
      return await Part.getInventoryValue();
    } catch (error) {
      throw new Error(`Failed to fetch inventory value: ${error.message}`);
    }
  },

  // Search parts
  searchParts: async (searchTerm) => {
    try {
      return await Part.getAll({ search: searchTerm });
    } catch (error) {
      throw new Error(`Failed to search parts: ${error.message}`);
    }
  },

  // Record part usage in maintenance
  recordPartUsage: async (maintenanceId, partsUsed) => {
    try {
      const { pool: db } = await import('../../config/db.config.js');
      
      // Start transaction
      await db.execute('START TRANSACTION');
      
      for (const partUsage of partsUsed) {
        const { part_id, quantity_used, unit_cost, notes } = partUsage;
        
        // Insert usage record
        await db.execute(
          'INSERT INTO maintenance_parts_used (maintenance_id, part_id, quantity_used, unit_cost, notes) VALUES (?, ?, ?, ?, ?)',
          [maintenanceId, part_id, quantity_used, unit_cost || 0, notes || null]
        );
        
        // Update part stock
        await Part.updateStock(part_id, quantity_used, 'subtract');
      }
      
      // Commit transaction
      await db.execute('COMMIT');
      
      return { message: 'Part usage recorded successfully' };
    } catch (error) {
      // Rollback transaction on error
      const { pool: db } = await import('../../config/db.config.js');
      await db.execute('ROLLBACK');
      throw new Error(`Failed to record part usage: ${error.message}`);
    }
  }
};

export default PartService;