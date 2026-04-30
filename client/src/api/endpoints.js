import apiClient from './axios';

/**
 * Examples of API calls
 * Since we set up an interceptor in axios.js, you do NOT need to manually
 * pass the token to endpoints that require it. The interceptor handles it.
 */

// Example: Endpoint that DOES NOT require a token (e.g., Public data, Login)
export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getPublicData = async () => {
  const response = await apiClient.get('/public-info');
  return response.data;
};

// Example: Endpoint that REQUIRES a token (e.g., User Profile, Dashboard Data)
export const getUserProfile = async () => {
  // We don't pass the token here, axios interceptor does it automatically
  const response = await apiClient.get('/user/profile');
  return response.data;
};

export const getDashboardData = async () => {
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
};
