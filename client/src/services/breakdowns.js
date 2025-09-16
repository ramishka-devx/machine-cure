import { http } from '../lib/apiClient.js';

// Breakdown API service
export const breakdownService = {
  // Get all breakdowns with optional filters
  getAllBreakdowns: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filter parameters
      if (params.q) queryParams.append('q', params.q);
      if (params.machine_id) queryParams.append('machine_id', params.machine_id);
      if (params.division_id) queryParams.append('division_id', params.division_id);
      if (params.status_id) queryParams.append('status_id', params.status_id);
      if (params.category_id) queryParams.append('category_id', params.category_id);
      if (params.severity) queryParams.append('severity', params.severity);
      if (params.assigned_to) queryParams.append('assigned_to', params.assigned_to);
      if (params.reported_by) queryParams.append('reported_by', params.reported_by);
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      
      const url = `/breakdowns${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching breakdowns:', error);
      throw error;
    }
  },

  // Get a specific breakdown by ID
  getBreakdownById: async (id) => {
    try {
      const response = await http.get(`/breakdowns/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching breakdown:', error);
      throw error;
    }
  },

  // Create a new breakdown
  createBreakdown: async (breakdownData) => {
    try {
      const response = await http.post('/breakdowns', breakdownData);
      return response;
    } catch (error) {
      console.error('Error creating breakdown:', error);
      throw error;
    }
  },

  // Update a breakdown
  updateBreakdown: async (id, breakdownData) => {
    try {
      const response = await http.put(`/breakdowns/${id}`, breakdownData);
      return response;
    } catch (error) {
      console.error('Error updating breakdown:', error);
      throw error;
    }
  },

  // Update breakdown status
  updateBreakdownStatus: async (id, status_id) => {
    try {
      const response = await http.patch(`/breakdowns/${id}/status`, { status_id });
      return response;
    } catch (error) {
      console.error('Error updating breakdown status:', error);
      throw error;
    }
  },

  // Assign breakdown to user
  assignBreakdown: async (id, assigned_to) => {
    try {
      const response = await http.patch(`/breakdowns/${id}/assign`, { assigned_to });
      return response;
    } catch (error) {
      console.error('Error assigning breakdown:', error);
      throw error;
    }
  },

  // Start repair
  startRepair: async (id) => {
    try {
      const response = await http.patch(`/breakdowns/${id}/start-repair`);
      return response;
    } catch (error) {
      console.error('Error starting repair:', error);
      throw error;
    }
  },

  // Complete repair
  completeRepair: async (id, completionData = {}) => {
    try {
      const response = await http.patch(`/breakdowns/${id}/complete-repair`, completionData);
      return response;
    } catch (error) {
      console.error('Error completing repair:', error);
      throw error;
    }
  },

  // Delete breakdown
  deleteBreakdown: async (id) => {
    try {
      const response = await http.delete(`/breakdowns/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting breakdown:', error);
      throw error;
    }
  },

  // Get breakdown categories
  getCategories: async () => {
    try {
      const response = await http.get('/breakdown-categories');
      return response;
    } catch (error) {
      console.error('Error fetching breakdown categories:', error);
      throw error;
    }
  },

  // Get breakdown statuses
  getStatuses: async () => {
    try {
      const response = await http.get('/breakdown-statuses');
      return response;
    } catch (error) {
      console.error('Error fetching breakdown statuses:', error);
      throw error;
    }
  },

  // Get breakdown comments
  getBreakdownComments: async (breakdownId, includeInternal = true) => {
    try {
      const response = await http.get(`/breakdown/${breakdownId}/comments?include_internal=${includeInternal}`);
      return response;
    } catch (error) {
      console.error('Error fetching breakdown comments:', error);
      throw error;
    }
  },

  // Add breakdown comment
  addBreakdownComment: async (breakdownId, commentData) => {
    try {
      const response = await http.post(`/breakdown/${breakdownId}/comments`, commentData);
      return response;
    } catch (error) {
      console.error('Error adding breakdown comment:', error);
      throw error;
    }
  },

  // Get breakdown repairs
  getBreakdownRepairs: async (breakdownId) => {
    try {
      const response = await http.get(`/breakdown/${breakdownId}/repairs`);
      return response;
    } catch (error) {
      console.error('Error fetching breakdown repairs:', error);
      throw error;
    }
  },

  // Add breakdown repair
  addBreakdownRepair: async (breakdownId, repairData) => {
    try {
      const response = await http.post(`/breakdown/${breakdownId}/repairs`, repairData);
      return response;
    } catch (error) {
      console.error('Error adding breakdown repair:', error);
      throw error;
    }
  },

  // Update breakdown repair
  updateBreakdownRepair: async (repairId, repairData) => {
    try {
      const response = await http.put(`/repairs/${repairId}`, repairData);
      return response;
    } catch (error) {
      console.error('Error updating breakdown repair:', error);
      throw error;
    }
  },

  // Start breakdown repair
  startBreakdownRepair: async (repairId) => {
    try {
      const response = await http.patch(`/repairs/${repairId}/start`);
      return response;
    } catch (error) {
      console.error('Error starting breakdown repair:', error);
      throw error;
    }
  },

  // Complete breakdown repair
  completeBreakdownRepair: async (repairId, completionData = {}) => {
    try {
      const response = await http.patch(`/repairs/${repairId}/complete`, completionData);
      return response;
    } catch (error) {
      console.error('Error completing breakdown repair:', error);
      throw error;
    }
  },

  // Delete breakdown repair
  deleteBreakdownRepair: async (repairId) => {
    try {
      const response = await http.delete(`/repairs/${repairId}`);
      return response;
    } catch (error) {
      console.error('Error deleting breakdown repair:', error);
      throw error;
    }
  },

  // Get single breakdown repair by ID
  getBreakdownRepairById: async (repairId) => {
    try {
      const response = await http.get(`/repairs/${repairId}`);
      return response;
    } catch (error) {
      console.error('Error fetching breakdown repair:', error);
      throw error;
    }
  }
};

export default breakdownService;