import { http } from '../lib/apiClient.js';

export const notificationsService = {
  list: async (params = { page: 1, limit: 10 }) => {
    try {
      const response = await http.get('/notifications', { params });
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await http.get('/notifications/unread/count');
      return response;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await http.put(`/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await http.put('/notifications/read-all');
      return response;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  delete: async (notificationId) => {
    try {
      const response = await http.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};