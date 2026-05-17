import apiClient from './axios';

/**
 * Profile API Endpoints
 */
export const getProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};
