import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

    if (error.response?.status === 401 && !isLoginPage) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    if (!error.response) {
      error.userMessage =
        `Cannot reach the backend API at ${API_BASE_URL}. Make sure the backend is running and NEXT_PUBLIC_API_URL is correct.`;
    } else {
      error.userMessage = error.response.data?.message || `Request failed with status ${error.response.status}`;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
