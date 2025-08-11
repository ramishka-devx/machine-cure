import { http } from '../lib/apiClient';

export const UsersService = {
  list: async (params = { page: 1, limit: 10 }) => {
    const res = await http.get('/users', { params });
    // API returns { success, message, data: { rows, total } }
    return res?.data ?? res; // return { rows, total }
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

export default UsersService;
