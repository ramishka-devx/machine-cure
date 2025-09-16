import { http, createResource } from '../lib/apiClient.js';

// Create a resource for divisions CRUD operations
const divisionsResource = createResource('/divisions');

// Divisions API service
export const divisionsService = {
  // Get all divisions
  getAllDivisions: async () => {
    try {
      const response = await http.get('/divisions');
      return response;
    } catch (error) {
      console.error('Error fetching divisions:', error);
      throw error;
    }
  },

  // Get a specific division by ID
  getDivision: async (id) => {
    try {
      return await divisionsResource.get(id);
    } catch (error) {
      console.error(`Error fetching division ${id}:`, error);
      throw error;
    }
  },

  // Create a new division
  createDivision: async (divisionData) => {
    try {
      const response = await http.post('/divisions', divisionData);
      return response;
    } catch (error) {
      console.error('Error creating division:', error);
      throw error;
    }
  },

  // Update a division
  updateDivision: async (id, divisionData) => {
    try {
      const response = await http.put(`/divisions/${id}`, divisionData);
      return response;
    } catch (error) {
      console.error(`Error updating division ${id}:`, error);
      throw error;
    }
  },

  // Delete a division
  deleteDivision: async (id) => {
    try {
      const response = await http.delete(`/divisions/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting division ${id}:`, error);
      throw error;
    }
  }
};

export default divisionsService;
