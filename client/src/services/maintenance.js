import { http, createResource } from '../lib/apiClient.js';

// Create a resource for maintenance CRUD operations
const maintenanceResource = createResource('/maintenance');

// Maintenance API service
export const maintenanceService = {
  // Get all maintenance records with optional filters
  getAllMaintenance: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filter parameters
      if (params.q) queryParams.append('q', params.q);
      if (params.machine_id) queryParams.append('machine_id', params.machine_id);
      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.scheduled_by) queryParams.append('scheduled_by', params.scheduled_by);
      
      const url = `/maintenance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      throw error;
    }
  },

  // Get a specific maintenance record by ID
  getMaintenance: async (id) => {
    try {
      return await maintenanceResource.get(id);
    } catch (error) {
      console.error(`Error fetching maintenance ${id}:`, error);
      throw error;
    }
  },

  // Create a new maintenance record
  createMaintenance: async (maintenanceData) => {
    try {
      const response = await http.post('/maintenance', maintenanceData);
      return response;
    } catch (error) {
      console.error('Error creating maintenance:', error);
      throw error;
    }
  },

  // Update a maintenance record
  updateMaintenance: async (id, maintenanceData) => {
    try {
      const response = await http.put(`/maintenance/${id}`, maintenanceData);
      return response;
    } catch (error) {
      console.error(`Error updating maintenance ${id}:`, error);
      throw error;
    }
  },

  // Update maintenance status
  updateMaintenanceStatus: async (id, status) => {
    try {
      const response = await http.put(`/maintenance/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error(`Error updating maintenance status ${id}:`, error);
      throw error;
    }
  },

  // Delete a maintenance record
  deleteMaintenance: async (id) => {
    try {
      const response = await http.delete(`/maintenance/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting maintenance ${id}:`, error);
      throw error;
    }
  },

  // Get maintenance by machine
  getMaintenanceByMachine: async (machineId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add machine filter
      queryParams.append('machine_id', machineId);
      
      const url = `/maintenance?${queryParams.toString()}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error(`Error fetching maintenance for machine ${machineId}:`, error);
      throw error;
    }
  },

  // Get scheduled maintenance
  getScheduledMaintenance: async (params = {}) => {
    try {
      return await maintenanceService.getAllMaintenance({
        ...params,
        status: 'scheduled'
      });
    } catch (error) {
      console.error('Error fetching scheduled maintenance:', error);
      throw error;
    }
  },

  // Get overdue maintenance
  getOverdueMaintenance: async (params = {}) => {
    try {
      return await maintenanceService.getAllMaintenance({
        ...params,
        status: 'overdue'
      });
    } catch (error) {
      console.error('Error fetching overdue maintenance:', error);
      throw error;
    }
  }
};