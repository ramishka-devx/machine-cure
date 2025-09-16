import { http, createResource } from '../lib/apiClient.js';

// Create a resource for maintenance types CRUD operations
const maintenanceTypesResource = createResource('/maintenance-types');

// Maintenance Types API service
export const maintenanceTypesService = {
  // Get all maintenance types with optional filters
  getAllMaintenanceTypes: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filter parameters
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      
      const url = `/maintenance-types${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching maintenance types:', error);
      throw error;
    }
  },

  // Get a specific maintenance type by ID
  getMaintenanceType: async (id) => {
    try {
      return await maintenanceTypesResource.get(id);
    } catch (error) {
      console.error(`Error fetching maintenance type ${id}:`, error);
      throw error;
    }
  },

  // Create a new maintenance type
  createMaintenanceType: async (data) => {
    try {
      const response = await http.post('/maintenance-types', data);
      return response;
    } catch (error) {
      console.error('Error creating maintenance type:', error);
      throw error;
    }
  },

  // Update an existing maintenance type
  updateMaintenanceType: async (id, data) => {
    try {
      const response = await http.put(`/maintenance-types/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating maintenance type ${id}:`, error);
      throw error;
    }
  },

  // Delete a maintenance type
  deleteMaintenanceType: async (id) => {
    try {
      const response = await http.delete(`/maintenance-types/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting maintenance type ${id}:`, error);
      throw error;
    }
  },

  // Get maintenance type usage statistics
  getMaintenanceTypeUsage: async (id) => {
    try {
      const response = await http.get(`/maintenance-types/${id}/usage`);
      return response;
    } catch (error) {
      console.error(`Error fetching maintenance type usage ${id}:`, error);
      throw error;
    }
  }
};

export default maintenanceTypesService;