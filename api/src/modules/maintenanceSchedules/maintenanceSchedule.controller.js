import MaintenanceScheduleService from './maintenanceSchedule.service.js';
import { success, fail } from '../../utils/apiResponse.js';
import { validationResult } from 'express-validator';

const MaintenanceScheduleController = {
  // Get all maintenance schedules
  getAllMaintenanceSchedules: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const filters = {
        machine_id: req.query.machine_id,
        maintenance_type_id: req.query.maintenance_type_id,
        is_active: req.query.is_active,
        overdue: req.query.overdue === 'true',
        due_within_days: req.query.due_within_days
      };

      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const schedules = await MaintenanceScheduleService.getAllMaintenanceSchedules(filters);

      return success(res, schedules, 'Maintenance schedules retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get maintenance schedule by ID
  getMaintenanceScheduleById: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const schedule = await MaintenanceScheduleService.getMaintenanceScheduleById(id);

      return success(res, schedule, 'Maintenance schedule retrieved successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 500);
    }
  },

  // Create new maintenance schedule
  createMaintenanceSchedule: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      // Add user ID as created_by if not provided
      if (!req.body.created_by) {
        req.body.created_by = req.user.user_id;
      }

      const schedule = await MaintenanceScheduleService.createMaintenanceSchedule(req.body);

      return success(res, schedule, 'Maintenance schedule created successfully', 201);
    } catch (error) {
      if (error.message.includes('already exists')) {
        return fail(res, error.message, 409);
      }
      return fail(res, error.message, 500);
    }
  },

  // Update maintenance schedule
  updateMaintenanceSchedule: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const schedule = await MaintenanceScheduleService.updateMaintenanceSchedule(id, req.body);

      return success(res, schedule, 'Maintenance schedule updated successfully');
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

  // Delete maintenance schedule
  deleteMaintenanceSchedule: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const result = await MaintenanceScheduleService.deleteMaintenanceSchedule(id);

      return success(res, result, 'Maintenance schedule deleted successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 500);
    }
  },

  // Get schedules by machine
  getSchedulesByMachine: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const { machineId } = req.params;
      const schedules = await MaintenanceScheduleService.getSchedulesByMachine(machineId);

      return success(res, schedules, 'Machine schedules retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get overdue schedules
  getOverdueSchedules: async (req, res) => {
    try {
      const schedules = await MaintenanceScheduleService.getOverdueSchedules();

      return success(res, schedules, 'Overdue schedules retrieved successfully');
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Get schedules due within specified days
  getSchedulesDueWithin: async (req, res) => {
    try {
      const days = parseInt(req.params.days) || 7;
      
      if (days < 1 || days > 365) {
        return fail(res, 'Days must be between 1 and 365', 400);
      }

      const schedules = await MaintenanceScheduleService.getSchedulesDueWithin(days);

      return success(res, schedules, `Schedules due within ${days} days retrieved successfully`);
    } catch (error) {
      return fail(res, error.message, 500);
    }
  },

  // Complete maintenance schedule
  completeMaintenanceSchedule: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return fail(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const { completed_date } = req.body;

      const schedule = await MaintenanceScheduleService.completeMaintenanceSchedule(id, completed_date);

      return success(res, schedule, 'Maintenance schedule completed successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return fail(res, error.message, 404);
      }
      return fail(res, error.message, 500);
    }
  }
};

export default MaintenanceScheduleController;
