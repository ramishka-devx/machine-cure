import { http, createResource } from '../lib/apiClient.js';

// Create a resource for maintenance schedules CRUD operations
const maintenanceSchedulesResource = createResource('/maintenance-schedules');

// Maintenance Schedules API service
export const maintenanceSchedulesService = {
  // Get all maintenance schedules with optional filters
  getAllMaintenanceSchedules: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filter parameters
      if (params.machine_id) queryParams.append('machine_id', params.machine_id);
      if (params.maintenance_type_id) queryParams.append('maintenance_type_id', params.maintenance_type_id);
      if (params.status) queryParams.append('status', params.status);
      if (params.overdue) queryParams.append('overdue', params.overdue);
      
      const url = `/maintenance-schedules${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching maintenance schedules:', error);
      throw error;
    }
  },

  // Get a specific maintenance schedule by ID
  getMaintenanceSchedule: async (id) => {
    try {
      return await maintenanceSchedulesResource.get(id);
    } catch (error) {
      console.error(`Error fetching maintenance schedule ${id}:`, error);
      throw error;
    }
  },

  // Create a new maintenance schedule
  createMaintenanceSchedule: async (data) => {
    try {
      const response = await http.post('/maintenance-schedules', data);
      return response;
    } catch (error) {
      console.error('Error creating maintenance schedule:', error);
      throw error;
    }
  },

  // Update an existing maintenance schedule
  updateMaintenanceSchedule: async (id, data) => {
    try {
      const response = await http.put(`/maintenance-schedules/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating maintenance schedule ${id}:`, error);
      throw error;
    }
  },

  // Delete a maintenance schedule
  deleteMaintenanceSchedule: async (id) => {
    try {
      const response = await http.delete(`/maintenance-schedules/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting maintenance schedule ${id}:`, error);
      throw error;
    }
  },

  // Get overdue maintenance schedules
  getOverdueSchedules: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.machine_id) queryParams.append('machine_id', params.machine_id);
      
      const url = `/maintenance-schedules/overdue${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching overdue schedules:', error);
      throw error;
    }
  },

  // Complete a maintenance schedule
  completeSchedule: async (id, data) => {
    try {
      const response = await http.post(`/maintenance-schedules/${id}/complete`, data);
      return response;
    } catch (error) {
      console.error(`Error completing maintenance schedule ${id}:`, error);
      throw error;
    }
  },

  // Get maintenance schedule history for a machine
  getMachineScheduleHistory: async (machineId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = `/maintenance-schedules/machine/${machineId}/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error(`Error fetching schedule history for machine ${machineId}:`, error);
      throw error;
    }
  }
};

export default maintenanceSchedulesService;