import { http, createResource } from '../lib/apiClient.js';

// Create a resource for kaizens CRUD operations
const kaizensResource = createResource('/kaizens');

// Kaizens API service
export const kaizensService = {
  // Get all kaizens with filters
  getAllKaizens: async (params = {}) => {
    try {
      const response = await http.get('/kaizens', { params });
      return response;
    } catch (error) {
      console.error('Error fetching kaizens:', error);
      throw error;
    }
  },

  // Get a specific kaizen by ID
  getKaizen: async (id) => {
    try {
      return await kaizensResource.get(id);
    } catch (error) {
      console.error(`Error fetching kaizen ${id}:`, error);
      throw error;
    }
  },

  // Create a new kaizen
  createKaizen: async (kaizenData) => {
    try {
      const response = await kaizensResource.create(kaizenData);
      return response;
    } catch (error) {
      console.error('Error creating kaizen:', error);
      throw error;
    }
  },

  // Update a kaizen
  updateKaizen: async (id, kaizenData) => {
    try {
      const response = await http.patch(`/kaizens/${id}`, kaizenData);
      return response;
    } catch (error) {
      console.error(`Error updating kaizen ${id}:`, error);
      throw error;
    }
  },

  // Delete a kaizen
  deleteKaizen: async (id) => {
    try {
      return await kaizensResource.remove(id);
    } catch (error) {
      console.error(`Error deleting kaizen ${id}:`, error);
      throw error;
    }
  },

  // Update kaizen status
  updateKaizenStatus: async (id, statusData) => {
    try {
      const response = await http.patch(`/kaizens/${id}/status`, statusData);
      return response;
    } catch (error) {
      console.error(`Error updating kaizen status ${id}:`, error);
      throw error;
    }
  },

  // Assign kaizen to user
  assignKaizen: async (id, assignData) => {
    try {
      const response = await http.patch(`/kaizens/${id}/assign`, assignData);
      return response;
    } catch (error) {
      console.error(`Error assigning kaizen ${id}:`, error);
      throw error;
    }
  },

  // Get kaizen categories
  getCategories: async () => {
    try {
      const response = await http.get('/kaizens/categories');
      return response;
    } catch (error) {
      console.error('Error fetching kaizen categories:', error);
      throw error;
    }
  },

  // Get kaizen statuses
  getStatuses: async () => {
    try {
      const response = await http.get('/kaizens/statuses');
      return response;
    } catch (error) {
      console.error('Error fetching kaizen statuses:', error);
      throw error;
    }
  },

  // Get kaizen comments
  getComments: async (id) => {
    try {
      const response = await http.get(`/kaizens/${id}/comments`);
      return response;
    } catch (error) {
      console.error(`Error fetching kaizen comments ${id}:`, error);
      throw error;
    }
  },

  // Add comment to kaizen
  addComment: async (id, commentData) => {
    try {
      const response = await http.post(`/kaizens/${id}/comments`, commentData);
      return response;
    } catch (error) {
      console.error(`Error adding comment to kaizen ${id}:`, error);
      throw error;
    }
  },

  // Get kaizen history
  getHistory: async (id) => {
    try {
      const response = await http.get(`/kaizens/${id}/history`);
      return response;
    } catch (error) {
      console.error(`Error fetching kaizen history ${id}:`, error);
      throw error;
    }
  },

  // Get kaizen statistics
  getStats: async () => {
    try {
      const response = await http.get('/kaizens/stats');
      return response;
    } catch (error) {
      console.error('Error fetching kaizen stats:', error);
      throw error;
    }
  }
};