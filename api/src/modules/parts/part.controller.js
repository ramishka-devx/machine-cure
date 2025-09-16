import PartService from './part.service.js';
import { success, fail } from '../../utils/apiResponse.js';

const PartController = {
  // Get all parts
  getAllParts: async (req, res) => {
    try {
      const filters = {
        category: req.query.category,
        supplier: req.query.supplier,
        search: req.query.search,
        low_stock: req.query.low_stock === 'true'
      };

      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const parts = await PartService.getAllParts(filters);
      return success(res, parts, 'Parts retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get part by ID
  getPartById: async (req, res) => {
    try {
      const { id } = req.params;
      const part = await PartService.getPartById(id);
      return success(res, part, 'Part retrieved successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 500);
    }
  },

  // Create new part
  createPart: async (req, res) => {
    try {
      const part = await PartService.createPart(req.body);
      return success(res, part, 'Part created successfully', 201);
    } catch (error) {
      if (error.message.includes('already exists')) {
        return fail(res, error.message, 409);
      }
      return fail(res, error.message, 500);
    }
  },

  // Update part
  updatePart: async (req, res) => {
    try {
      const { id } = req.params;
      const part = await PartService.updatePart(id, req.body);
      return success(res, part, 'Part updated successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      if (error.message.includes('already exists')) {
        return fail(res, error.message, 409);
      }
      return fail(res, error.message, 500);
    }
  },

  // Delete part
  deletePart: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await PartService.deletePart(id);
      return success(res, result, 'Part deleted successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      if (error.message.includes('being used')) {
        return fail(res, error.message, 409);
      }
      return fail(res, error.message, 500);
    }
  },

  // Update part stock
  updatePartStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity, operation = 'set' } = req.body;

      if (quantity === undefined || quantity === null) {
        return fail(res, 'Quantity is required', 400);
      }

      const part = await PartService.updatePartStock(id, quantity, operation);
      return success(res, part, 'Part stock updated successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 400);
    }
  },

  // Get low stock parts
  getLowStockParts: async (req, res) => {
    try {
      const parts = await PartService.getLowStockParts();
      return success(res, parts, 'Low stock parts retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get parts by category
  getPartsByCategory: async (req, res) => {
    try {
      const categories = await PartService.getPartsByCategory();
      return success(res, categories, 'Parts by category retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get parts for machine
  getPartsForMachine: async (req, res) => {
    try {
      const { machineId } = req.params;
      const parts = await PartService.getPartsForMachine(machineId);
      return success(res, parts, 'Machine parts retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get part usage history
  getPartUsageHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const history = await PartService.getPartUsageHistory(id, limit);
      return success(res, history, 'Part usage history retrieved successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 500);
    }
  },

  // Get inventory value
  getInventoryValue: async (req, res) => {
    try {
      const value = await PartService.getInventoryValue();
      return success(res, value, 'Inventory value retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Search parts
  searchParts: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return fail(res, 'Search query is required', 400);
      }

      const parts = await PartService.searchParts(q);
      return success(res, parts, 'Parts search completed successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Record part usage
  recordPartUsage: async (req, res) => {
    try {
      const { maintenance_id, parts_used } = req.body;

      if (!maintenance_id || !parts_used || !Array.isArray(parts_used)) {
        return fail(res, 'Maintenance ID and parts used array are required', 400);
      }

      const result = await PartService.recordPartUsage(maintenance_id, parts_used);
      return success(res, result, 'Part usage recorded successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  }
};

export default PartController;
