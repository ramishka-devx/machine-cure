import MaintenanceRecordService from './maintenanceRecord.service.js';
import { success, fail } from '../../utils/apiResponse.js';

const MaintenanceRecordController = {
  // Get all maintenance records
  getAllMaintenanceRecords: async (req, res) => {
    try {
      const filters = {
        machine_id: req.query.machine_id,
        maintenance_type_id: req.query.maintenance_type_id,
        status_id: req.query.status_id,
        priority: req.query.priority,
        assigned_to: req.query.assigned_to,
        performed_by: req.query.performed_by,
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };

      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const records = await MaintenanceRecordService.getAllMaintenanceRecords(filters);
      return success(res, records, 'Maintenance records retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get maintenance record by ID
  getMaintenanceRecordById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await MaintenanceRecordService.getMaintenanceRecordById(id);
      return success(res, record, 'Maintenance record retrieved successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 500);
    }
  },

  // Create new maintenance record
  createMaintenanceRecord: async (req, res) => {
    try {
      const record = await MaintenanceRecordService.createMaintenanceRecord(req.body);
      return success(res, record, 'Maintenance record created successfully', 201);
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Update maintenance record
  updateMaintenanceRecord: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await MaintenanceRecordService.updateMaintenanceRecord(id, req.body);
      return success(res, record, 'Maintenance record updated successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 500);
    }
  },

  // Delete maintenance record
  deleteMaintenanceRecord: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await MaintenanceRecordService.deleteMaintenanceRecord(id);
      return success(res, result, 'Maintenance record deleted successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 500);
    }
  },

  // Start maintenance work
  startMaintenanceWork: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await MaintenanceRecordService.startMaintenanceWork(id, req.user.user_id);
      return success(res, record, 'Maintenance work started successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 400);
    }
  },

  // Complete maintenance work
  completeMaintenanceWork: async (req, res) => {
    try {
      const { id } = req.params;
      const completionData = {
        performed_by: req.user.user_id,
        actual_duration_hours: req.body.actual_duration_hours,
        actual_cost: req.body.actual_cost,
        notes: req.body.notes
      };
      
      const record = await MaintenanceRecordService.completeMaintenanceWork(id, completionData);
      return success(res, record, 'Maintenance work completed successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 400);
    }
  },

  // Get maintenance records by machine
  getMaintenanceRecordsByMachine: async (req, res) => {
    try {
      const { machineId } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const records = await MaintenanceRecordService.getMaintenanceRecordsByMachine(machineId, limit);
      return success(res, records, 'Machine maintenance records retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get upcoming maintenance for user
  getUpcomingMaintenanceForUser: async (req, res) => {
    try {
      const userId = req.query.user_id || req.user.user_id;
      const days = parseInt(req.query.days) || 7;
      const records = await MaintenanceRecordService.getUpcomingMaintenanceForUser(userId, days);
      return success(res, records, 'Upcoming maintenance retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get maintenance statistics
  getMaintenanceStatistics: async (req, res) => {
    try {
      const filters = {
        date_from: req.query.date_from,
        date_to: req.query.date_to,
        machine_id: req.query.machine_id
      };

      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const statistics = await MaintenanceRecordService.getMaintenanceStatistics(filters);
      return success(res, statistics, 'Maintenance statistics retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  }
};

export default MaintenanceRecordController;
