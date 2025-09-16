import MaintenanceType from './maintenanceType.model.js';

const MaintenanceTypeService = {
  // Get all maintenance types
  getAllMaintenanceTypes: async () => {
    try {
      return await MaintenanceType.getAll();
    } catch (error) {
      throw new Error(`Failed to fetch maintenance types: ${error.message}`);
    }
  },

  // Get maintenance type by ID
  getMaintenanceTypeById: async (id) => {
    try {
      const maintenanceType = await MaintenanceType.getById(id);
      if (!maintenanceType) {
        throw new Error('Maintenance type not found');
      }
      return maintenanceType;
    } catch (error) {
      throw new Error(`Failed to fetch maintenance type: ${error.message}`);
    }
  },

  // Create new maintenance type
  createMaintenanceType: async (maintenanceTypeData) => {
    try {
      // Validate required fields
      if (!maintenanceTypeData.name || !maintenanceTypeData.default_frequency_days) {
        throw new Error('Name and default frequency days are required');
      }

      if (maintenanceTypeData.default_frequency_days <= 0) {
        throw new Error('Default frequency days must be greater than 0');
      }

      const maintenanceTypeId = await MaintenanceType.create(maintenanceTypeData);
      return await MaintenanceType.getById(maintenanceTypeId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Maintenance type name already exists');
      }
      throw new Error(`Failed to create maintenance type: ${error.message}`);
    }
  },

  // Update maintenance type
  updateMaintenanceType: async (id, maintenanceTypeData) => {
    try {
      // Check if maintenance type exists
      const existingMaintenanceType = await MaintenanceType.getById(id);
      if (!existingMaintenanceType) {
        throw new Error('Maintenance type not found');
      }

      // Validate required fields
      if (!maintenanceTypeData.name || !maintenanceTypeData.default_frequency_days) {
        throw new Error('Name and default frequency days are required');
      }

      if (maintenanceTypeData.default_frequency_days <= 0) {
        throw new Error('Default frequency days must be greater than 0');
      }

      const updated = await MaintenanceType.update(id, maintenanceTypeData);
      if (!updated) {
        throw new Error('Failed to update maintenance type');
      }

      return await MaintenanceType.getById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Maintenance type name already exists');
      }
      throw new Error(`Failed to update maintenance type: ${error.message}`);
    }
  },

  // Delete maintenance type
  deleteMaintenanceType: async (id) => {
    try {
      // Check if maintenance type exists
      const existingMaintenanceType = await MaintenanceType.getById(id);
      if (!existingMaintenanceType) {
        throw new Error('Maintenance type not found');
      }

      const deleted = await MaintenanceType.delete(id);
      if (!deleted) {
        throw new Error('Failed to delete maintenance type');
      }

      return { message: 'Maintenance type deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete maintenance type: ${error.message}`);
    }
  },

  // Get maintenance types with statistics
  getMaintenanceTypesWithStats: async () => {
    try {
      return await MaintenanceType.getWithStats();
    } catch (error) {
      throw new Error(`Failed to fetch maintenance types with stats: ${error.message}`);
    }
  }
};

export default MaintenanceTypeService;