import { http, createResource } from '../lib/apiClient.js';

// Create a resource for machines CRUD operations
const machinesResource = createResource('/machines');

// Machines API service
export const machinesService = {
  // Get all machines with optional filters
  getAllMachines: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filter parameters
      if (params.q) queryParams.append('q', params.q);
      if (params.division_id) queryParams.append('division_id', params.division_id);
      
      const url = `/machines${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }
  },

  // Get a specific machine by ID
  getMachine: async (id) => {
    try {
      return await machinesResource.get(id);
    } catch (error) {
      console.error(`Error fetching machine ${id}:`, error);
      throw error;
    }
  },

  // Create a new machine
  createMachine: async (machineData) => {
    try {
      const response = await http.post('/machines', machineData);
      return response;
    } catch (error) {
      console.error('Error creating machine:', error);
      throw error;
    }
  },

  // Update a machine
  updateMachine: async (id, machineData) => {
    try {
      const response = await http.put(`/machines/${id}`, machineData);
      return response;
    } catch (error) {
      console.error(`Error updating machine ${id}:`, error);
      throw error;
    }
  },

  // Delete a machine
  deleteMachine: async (id) => {
    try {
      const response = await http.delete(`/machines/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting machine ${id}:`, error);
      throw error;
    }
  }
};