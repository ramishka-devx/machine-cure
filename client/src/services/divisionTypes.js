import { http, createResource } from '../lib/apiClient.js';

// Create a resource for division types CRUD operations
const divisionTypesResource = createResource('/division-types');

// Division Types API service
export const divisionTypesService = {
  // Get all division types
  getAllDivisionTypes: async () => {
    try {
      const response = await http.get('/division-types');
      return response;
    } catch (error) {
      console.error('Error fetching division types:', error);
      throw error;
    }
  },

  // Get a specific division type by ID
  getDivisionType: async (id) => {
    try {
      return await divisionTypesResource.get(id);
    } catch (error) {
      console.error(`Error fetching division type ${id}:`, error);
      throw error;
    }
  },

  // Create a new division type
  createDivisionType: async (divisionTypeData) => {
    try {
      const response = await http.post('/division-types', divisionTypeData);
      return response;
    } catch (error) {
      console.error('Error creating division type:', error);
      throw error;
    }
  },

  // Update a division type
  updateDivisionType: async (id, divisionTypeData) => {
    try {
      const response = await http.put(`/division-types/${id}`, divisionTypeData);
      return response;
    } catch (error) {
      console.error(`Error updating division type ${id}:`, error);
      throw error;
    }
  },

  // Delete a division type
  deleteDivisionType: async (id) => {
    try {
      const response = await http.delete(`/division-types/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting division type ${id}:`, error);
      throw error;
    }
  }
};

export default divisionTypesService;