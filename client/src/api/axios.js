import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Attempt to get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
// This runs when a response is received
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors (like 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - possible invalid token or expired session");
      // Optional: automatically clear token and redirect to login
      // localStorage.removeItem('token');
      // window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
