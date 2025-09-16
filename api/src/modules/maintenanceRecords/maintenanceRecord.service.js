import MaintenanceRecord from './maintenanceRecord.model.js';

const MaintenanceRecordService = {
  // Get all maintenance records
  getAllMaintenanceRecords: async (filters = {}) => {
    try {
      return await MaintenanceRecord.getAll(filters);
    } catch (error) {
      throw new Error(`Failed to fetch maintenance records: ${error.message}`);
    }
  },

  // Get maintenance record by ID
  getMaintenanceRecordById: async (id) => {
    try {
      const record = await MaintenanceRecord.getById(id);
      if (!record) {
        throw new Error('Maintenance record not found');
      }
      return record;
    } catch (error) {
      throw new Error(`Failed to fetch maintenance record: ${error.message}`);
    }
  },

  // Create new maintenance record
  createMaintenanceRecord: async (recordData) => {
    try {
      // Validate required fields
      if (!recordData.machine_id || !recordData.maintenance_type_id || !recordData.title || !recordData.scheduled_date) {
        throw new Error('Machine ID, maintenance type ID, title, and scheduled date are required');
      }

      // Set default status if not provided
      if (!recordData.status_id) {
        // Get 'scheduled' status ID
        const db = await import('../../config/db.config.js');
        const [statusRows] = await db.pool.execute("SELECT status_id FROM maintenance_statuses WHERE name = 'scheduled'");
        if (statusRows.length > 0) {
          recordData.status_id = statusRows[0].status_id;
        }
      }

      const recordId = await MaintenanceRecord.create(recordData);
      return await MaintenanceRecord.getById(recordId);
    } catch (error) {
      throw new Error(`Failed to create maintenance record: ${error.message}`);
    }
  },

  // Update maintenance record
  updateMaintenanceRecord: async (id, recordData) => {
    try {
      // Check if record exists
      const existingRecord = await MaintenanceRecord.getById(id);
      if (!existingRecord) {
        throw new Error('Maintenance record not found');
      }

      // Validate required fields
      if (!recordData.machine_id || !recordData.maintenance_type_id || !recordData.title) {
        throw new Error('Machine ID, maintenance type ID, and title are required');
      }

      const updated = await MaintenanceRecord.update(id, recordData);
      if (!updated) {
        throw new Error('Failed to update maintenance record');
      }

      return await MaintenanceRecord.getById(id);
    } catch (error) {
      throw new Error(`Failed to update maintenance record: ${error.message}`);
    }
  },

  // Delete maintenance record
  deleteMaintenanceRecord: async (id) => {
    try {
      // Check if record exists
      const existingRecord = await MaintenanceRecord.getById(id);
      if (!existingRecord) {
        throw new Error('Maintenance record not found');
      }

      const deleted = await MaintenanceRecord.delete(id);
      if (!deleted) {
        throw new Error('Failed to delete maintenance record');
      }

      return { message: 'Maintenance record deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete maintenance record: ${error.message}`);
    }
  },

  // Start maintenance work
  startMaintenanceWork: async (id, userId) => {
    try {
      const record = await MaintenanceRecord.getById(id);
      if (!record) {
        throw new Error('Maintenance record not found');
      }

      if (record.status_name !== 'scheduled') {
        throw new Error('Can only start maintenance that is scheduled');
      }

      const updated = await MaintenanceRecord.startMaintenance(id, userId);
      if (!updated) {
        throw new Error('Failed to start maintenance work');
      }

      return await MaintenanceRecord.getById(id);
    } catch (error) {
      throw new Error(`Failed to start maintenance work: ${error.message}`);
    }
  },

  // Complete maintenance work
  completeMaintenanceWork: async (id, completionData) => {
    try {
      const record = await MaintenanceRecord.getById(id);
      if (!record) {
        throw new Error('Maintenance record not found');
      }

      if (record.status_name !== 'in_progress') {
        throw new Error('Can only complete maintenance that is in progress');
      }

      const updated = await MaintenanceRecord.completeMaintenance(id, completionData);
      if (!updated) {
        throw new Error('Failed to complete maintenance work');
      }

      // If this was scheduled maintenance, update the schedule
      if (record.schedule_id) {
        const { default: MaintenanceSchedule } = await import('../maintenanceSchedules/maintenanceSchedule.model.js');
        await MaintenanceSchedule.updateNextDueDate(record.schedule_id, new Date().toISOString().split('T')[0]);
      }

      return await MaintenanceRecord.getById(id);
    } catch (error) {
      throw new Error(`Failed to complete maintenance work: ${error.message}`);
    }
  },

  // Get maintenance records by machine
  getMaintenanceRecordsByMachine: async (machineId, limit = 10) => {
    try {
      return await MaintenanceRecord.getByMachine(machineId, limit);
    } catch (error) {
      throw new Error(`Failed to fetch maintenance records for machine: ${error.message}`);
    }
  },

  // Get upcoming maintenance for user
  getUpcomingMaintenanceForUser: async (userId, days = 7) => {
    try {
      return await MaintenanceRecord.getUpcomingForUser(userId, days);
    } catch (error) {
      throw new Error(`Failed to fetch upcoming maintenance for user: ${error.message}`);
    }
  },

  // Get maintenance statistics
  getMaintenanceStatistics: async (filters = {}) => {
    try {
      return await MaintenanceRecord.getStatistics(filters);
    } catch (error) {
      throw new Error(`Failed to fetch maintenance statistics: ${error.message}`);
    }
  }
};

export default MaintenanceRecordService;