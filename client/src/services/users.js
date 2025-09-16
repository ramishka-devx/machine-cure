import { http } from '../lib/apiClient.js';

export const usersService = {
  getAllUsers: async (params = { page: 1, limit: 10 }) => {
    try {
      const response = await http.get('/users', { params });
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  list: async (params = { page: 1, limit: 10 }) => {
    const res = await http.get('/users', { params });
    // API returns { success, message, data: { rows, total } }
    return res?.data ?? res; // return { rows, total }
  },
  me: async () => {
    const res = await http.get('/users/me');
    // API returns { success, message, data: <user> }
    return res?.data ?? res;
  },
  analytics: async () => {
    const res = await http.get('/users/analytics');
    // API returns { success, message, data: { total, verified, pending, deleted } }
    return res?.data ?? res;
  },
  updateStatus: async (user_id, status) => {
    const res = await http.put(`/users/${user_id}/status`, { status });
    // API returns { success, message, data: <user> }
    return res?.data ?? res;
  },
  updateRole: async (user_id, role_id) => {
    const res = await http.put(`/users/${user_id}/role`, { role_id });
    // API returns { success, message, data: <user> }
    return res?.data ?? res;
  },
};

// Keep both exports for backward compatibility
export const UsersService = usersService;
export default usersService;
