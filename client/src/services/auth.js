import { http, setAuthToken } from '../lib/apiClient';

// Auth-related API calls
export const AuthService = {
  login: async ({ email, password }) => {
    const res = await http.post('/users/login', { email, password });
    const token = res?.data?.token ?? res?.token; // support both shapes
    if (token) setAuthToken(token);
    return token;
  },
  register: async ({ first_name, last_name, email, password }) => {
    // API returns created user in res.data
    const res = await http.post('/users/register', { first_name, last_name, email, password });
    return res?.data ?? res;
  },
  me: () => http.get('/users/me'),
};

export default AuthService;
