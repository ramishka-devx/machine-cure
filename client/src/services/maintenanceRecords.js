import { http, createResource } from '../lib/apiClient.js';

// Create a resource for maintenance records CRUD operations
const maintenanceRecordsResource = createResource('/maintenance-records');

// Maintenance Records API service
export const maintenanceRecordsService = {
  // Get all maintenance records with optional filters
  getAllMaintenanceRecords: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filter parameters
      if (params.machine_id) queryParams.append('machine_id', params.machine_id);
      if (params.maintenance_type_id) queryParams.append('maintenance_type_id', params.maintenance_type_id);
      if (params.status) queryParams.append('status', params.status);
      if (params.technician_id) queryParams.append('technician_id', params.technician_id);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);
      
      const url = `/maintenance-records${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      throw error;
    }
  },

  // Get a specific maintenance record by ID
  getMaintenanceRecord: async (id) => {
    try {
      return await maintenanceRecordsResource.get(id);
    } catch (error) {
      console.error(`Error fetching maintenance record ${id}:`, error);
      throw error;
    }
  },

  // Create a new maintenance record
  createMaintenanceRecord: async (data) => {
    try {
      const response = await http.post('/maintenance-records', data);
      return response;
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      throw error;
    }
  },

  // Update an existing maintenance record
  updateMaintenanceRecord: async (id, data) => {
    try {
      const response = await http.put(`/maintenance-records/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating maintenance record ${id}:`, error);
      throw error;
    }
  },

  // Delete a maintenance record
  deleteMaintenanceRecord: async (id) => {
    try {
      const response = await http.delete(`/maintenance-records/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting maintenance record ${id}:`, error);
      throw error;
    }
  },

  // Start a maintenance work order
  startMaintenanceRecord: async (id) => {
    try {
      const response = await http.post(`/maintenance-records/${id}/start`);
      return response;
    } catch (error) {
      console.error(`Error starting maintenance record ${id}:`, error);
      throw error;
    }
  },

  // Complete a maintenance work order
  completeMaintenanceRecord: async (id, data) => {
    try {
      const response = await http.post(`/maintenance-records/${id}/complete`, data);
      return response;
    } catch (error) {
      console.error(`Error completing maintenance record ${id}:`, error);
      throw error;
    }
  },

  // Get maintenance records statistics
  getMaintenanceRecordStats: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.machine_id) queryParams.append('machine_id', params.machine_id);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);
      
      const url = `/maintenance-records/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching maintenance record stats:', error);
      throw error;
    }
  },

  // Get maintenance records for a specific machine
  getMachineMaintenanceRecords: async (machineId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      
      const url = `/maintenance-records/machine/${machineId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error(`Error fetching maintenance records for machine ${machineId}:`, error);
      throw error;
    }
  }
};

export default maintenanceRecordsService;