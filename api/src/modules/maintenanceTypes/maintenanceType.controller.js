import MaintenanceTypeService from './maintenanceType.service.js';
import {success, fail} from '../../utils/apiResponse.js';
import { validationResult } from 'express-validator';


const MaintenanceTypeController = {
  // Get all maintenance types
  getAllMaintenanceTypes: async (req, res) => {
    try {
      const includeStats = req.query.include_stats === 'true';
      
      let maintenanceTypes;
      if (includeStats) {
        maintenanceTypes = await MaintenanceTypeService.getMaintenanceTypesWithStats();
      } else {
        maintenanceTypes = await MaintenanceTypeService.getAllMaintenanceTypes();
      }

      return success(res, maintenanceTypes, 'Maintenance types retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get maintenance type by ID
  getMaintenanceTypeById: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const maintenanceType = await MaintenanceTypeService.getMaintenanceTypeById(id);

      return success(res, maintenanceType, 'Maintenance type retrieved successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 500);
    }
  },

  // Create new maintenance type
  createMaintenanceType: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const maintenanceType = await MaintenanceTypeService.createMaintenanceType(req.body);

      return success(res, maintenanceType, 'Maintenance type created successfully', 201);
    } catch (error) {
      if (error.message.includes('already exists')) {
        return fail(res, error.message, 409);
      }
      return fail(res, error.message, 500);
    }
  },

  // Update maintenance type
  updateMaintenanceType: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const maintenanceType = await MaintenanceTypeService.updateMaintenanceType(id, req.body);

      return success(res, maintenanceType, 'Maintenance type updated successfully');
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

  // Delete maintenance type
  deleteMaintenanceType: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const result = await MaintenanceTypeService.deleteMaintenanceType(id);

      return success(res, result, 'Maintenance type deleted successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      if (error.message.includes('being used')) {
        return fail(res, error.message, 409);
      }
      return fail(res, error.message, 500);
    }
  }
};

export default MaintenanceTypeController;
