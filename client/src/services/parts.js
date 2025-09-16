import { http, createResource } from '../lib/apiClient.js';

// Create a resource for parts CRUD operations
const partsResource = createResource('/parts');

// Parts API service
export const partsService = {
  // Get all parts with optional filters
  getAllParts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filter parameters
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.supplier) queryParams.append('supplier', params.supplier);
      if (params.low_stock !== undefined) queryParams.append('low_stock', params.low_stock);
      
      const url = `/parts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching parts:', error);
      throw error;
    }
  },

  // Get a specific part by ID
  getPart: async (id) => {
    try {
      return await partsResource.get(id);
    } catch (error) {
      console.error(`Error fetching part ${id}:`, error);
      throw error;
    }
  },

  // Create a new part
  createPart: async (data) => {
    try {
      const response = await http.post('/parts', data);
      return response;
    } catch (error) {
      console.error('Error creating part:', error);
      throw error;
    }
  },

  // Update an existing part
  updatePart: async (id, data) => {
    try {
      const response = await http.put(`/parts/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating part ${id}:`, error);
      throw error;
    }
  },

  // Delete a part
  deletePart: async (id) => {
    try {
      const response = await http.delete(`/parts/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting part ${id}:`, error);
      throw error;
    }
  },

  // Get low stock parts
  getLowStockParts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = `/parts/low-stock${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching low stock parts:', error);
      throw error;
    }
  },

  // Get parts by category
  getPartsByCategory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = `/parts/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching parts by category:', error);
      throw error;
    }
  },

  // Get inventory value
  getInventoryValue: async () => {
    try {
      const response = await http.get('/parts/inventory-value');
      return response;
    } catch (error) {
      console.error('Error fetching inventory value:', error);
      throw error;
    }
  },

  // Update part stock
  updatePartStock: async (id, data) => {
    try {
      const response = await http.post(`/parts/${id}/stock`, data);
      return response;
    } catch (error) {
      console.error(`Error updating part stock ${id}:`, error);
      throw error;
    }
  },

  // Get part usage history
  getPartUsageHistory: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);
      
      const url = `/parts/${id}/usage${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error(`Error fetching part usage history ${id}:`, error);
      throw error;
    }
  },

  // Record part usage for maintenance
  recordPartUsage: async (maintenanceId, partsUsed) => {
    try {
      const response = await http.post(`/parts/usage`, {
        maintenance_id: maintenanceId,
        parts_used: partsUsed
      });
      return response;
    } catch (error) {
      console.error('Error recording part usage:', error);
      throw error;
    }
  }
};

export default partsService;