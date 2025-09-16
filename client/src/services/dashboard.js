import { http } from '../lib/apiClient.js';

export const dashboardService = {
  // Get dashboard metrics
  getMetrics: async () => {
    try {
      const response = await http.get('/dashboard/metrics');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  // Get critical issues
  getCriticalIssues: async () => {
    try {
      const response = await http.get('/dashboard/critical-issues');
      return response;
    } catch (error) {
      console.error('Error fetching critical issues:', error);
      throw error;
    }
  },

  // Get recent activity
  getRecentActivity: async () => {
    try {
      const response = await http.get('/dashboard/recent-activity');
      return response;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
};

export default dashboardService;