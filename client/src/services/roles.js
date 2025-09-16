import { http } from '../lib/apiClient';

export const RolesService = {
  list: async () => {
    const res = await http.get('/roles');
    // API returns { success, message, data: { rows, total } }
    return res?.data ?? res; // return { rows, total }
  },

  getAll: async () => {
    const res = await http.get('/roles/all');
    // API returns { success, message, data: [...roles] }
    return res?.data ?? res; // return roles array
  },

  getById: async (roleId) => {
    const res = await http.get(`/roles/${roleId}`);
    return res?.data ?? res;
  },

  create: async (roleData) => {
    const res = await http.post('/roles', roleData);
    return res?.data ?? res;
  },

  update: async (roleId, roleData) => {
    const res = await http.put(`/roles/${roleId}`, roleData);
    return res?.data ?? res;
  },

  delete: async (roleId) => {
    const res = await http.delete(`/roles/${roleId}`);
    return res?.data ?? res;
  },
};

export default RolesService;