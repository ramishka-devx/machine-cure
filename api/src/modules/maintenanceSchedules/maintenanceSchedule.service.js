import MaintenanceSchedule from './maintenanceSchedule.model.js';

const MaintenanceScheduleService = {
  // Get all maintenance schedules
  getAllMaintenanceSchedules: async (filters = {}) => {
    try {
      return await MaintenanceSchedule.getAll(filters);
    } catch (error) {
      throw new Error(`Failed to fetch maintenance schedules: ${error.message}`);
    }
  },

  // Get maintenance schedule by ID
  getMaintenanceScheduleById: async (id) => {
    try {
      const schedule = await MaintenanceSchedule.getById(id);
      if (!schedule) {
        throw new Error('Maintenance schedule not found');
      }
      return schedule;
    } catch (error) {
      throw new Error(`Failed to fetch maintenance schedule: ${error.message}`);
    }
  },

  // Create new maintenance schedule
  createMaintenanceSchedule: async (scheduleData) => {
    try {
      // Validate required fields
      if (!scheduleData.machine_id || !scheduleData.maintenance_type_id || !scheduleData.frequency_days) {
        throw new Error('Machine ID, maintenance type ID, and frequency days are required');
      }

      if (scheduleData.frequency_days <= 0) {
        throw new Error('Frequency days must be greater than 0');
      }

      // Check for duplicate schedule
      const isDuplicate = await MaintenanceSchedule.checkDuplicate(
        scheduleData.machine_id, 
        scheduleData.maintenance_type_id
      );

      if (isDuplicate) {
        throw new Error('An active schedule already exists for this machine and maintenance type');
      }

      // If no next_due_date provided, calculate it
      if (!scheduleData.next_due_date) {
        const currentDate = new Date();
        const nextDueDate = new Date(currentDate.getTime() + (scheduleData.frequency_days * 24 * 60 * 60 * 1000));
        scheduleData.next_due_date = nextDueDate.toISOString().split('T')[0];
      }

      const scheduleId = await MaintenanceSchedule.create(scheduleData);
      return await MaintenanceSchedule.getById(scheduleId);
    } catch (error) {
      throw new Error(`Failed to create maintenance schedule: ${error.message}`);
    }
  },

  // Update maintenance schedule
  updateMaintenanceSchedule: async (id, scheduleData) => {
    try {
      // Check if schedule exists
      const existingSchedule = await MaintenanceSchedule.getById(id);
      if (!existingSchedule) {
        throw new Error('Maintenance schedule not found');
      }

      // Validate required fields
      if (!scheduleData.machine_id || !scheduleData.maintenance_type_id || !scheduleData.frequency_days) {
        throw new Error('Machine ID, maintenance type ID, and frequency days are required');
      }

      if (scheduleData.frequency_days <= 0) {
        throw new Error('Frequency days must be greater than 0');
      }

      // Check for duplicate schedule (excluding current one)
      const isDuplicate = await MaintenanceSchedule.checkDuplicate(
        scheduleData.machine_id, 
        scheduleData.maintenance_type_id, 
        id
      );

      if (isDuplicate) {
        throw new Error('An active schedule already exists for this machine and maintenance type');
      }

      const updated = await MaintenanceSchedule.update(id, scheduleData);
      if (!updated) {
        throw new Error('Failed to update maintenance schedule');
      }

      return await MaintenanceSchedule.getById(id);
    } catch (error) {
      throw new Error(`Failed to update maintenance schedule: ${error.message}`);
    }
  },

  // Delete maintenance schedule
  deleteMaintenanceSchedule: async (id) => {
    try {
      // Check if schedule exists
      const existingSchedule = await MaintenanceSchedule.getById(id);
      if (!existingSchedule) {
        throw new Error('Maintenance schedule not found');
      }

      const deleted = await MaintenanceSchedule.delete(id);
      if (!deleted) {
        throw new Error('Failed to delete maintenance schedule');
      }

      return { message: 'Maintenance schedule deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete maintenance schedule: ${error.message}`);
    }
  },

  // Get schedules by machine
  getSchedulesByMachine: async (machineId) => {
    try {
      return await MaintenanceSchedule.getByMachine(machineId);
    } catch (error) {
      throw new Error(`Failed to fetch schedules for machine: ${error.message}`);
    }
  },

  // Get overdue schedules
  getOverdueSchedules: async () => {
    try {
      return await MaintenanceSchedule.getAll({ overdue: true });
    } catch (error) {
      throw new Error(`Failed to fetch overdue schedules: ${error.message}`);
    }
  },

  // Get schedules due within specified days
  getSchedulesDueWithin: async (days) => {
    try {
      return await MaintenanceSchedule.getAll({ due_within_days: days });
    } catch (error) {
      throw new Error(`Failed to fetch schedules due within ${days} days: ${error.message}`);
    }
  },

  // Mark maintenance as completed and update next due date
  completeMaintenanceSchedule: async (scheduleId, completedDate = null) => {
    try {
      const schedule = await MaintenanceSchedule.getById(scheduleId);
      if (!schedule) {
        throw new Error('Maintenance schedule not found');
      }

      const completionDate = completedDate || new Date().toISOString().split('T')[0];
      
      const updated = await MaintenanceSchedule.updateNextDueDate(scheduleId, completionDate);
      if (!updated) {
        throw new Error('Failed to update schedule completion');
      }

      return await MaintenanceSchedule.getById(scheduleId);
    } catch (error) {
      throw new Error(`Failed to complete maintenance schedule: ${error.message}`);
    }
  }
};

export default MaintenanceScheduleService;