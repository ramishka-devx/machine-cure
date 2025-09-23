import { http } from '../lib/apiClient.js';

export const activitiesService = {
  list: async (params = { page: 1, limit: 10 }) => {
    const res = await http.get('/activities', { params });
    return res?.data ?? res;
  },

  getById: async (activity_id) => {
    const res = await http.get(`/activities/${activity_id}`);
    return res?.data ?? res;
  }
};