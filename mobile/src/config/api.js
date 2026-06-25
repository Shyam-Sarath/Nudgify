import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/store';

function resolveApiUrl() {
  const configured =
    Constants.expoConfig?.extra?.apiUrl ||
    process.env.EXPO_PUBLIC_API_URL ||
    'http://localhost:5001';

  if (Platform.OS === 'android' && configured.includes('localhost')) {
    return configured.replace('localhost', '10.0.2.2');
  }

  return configured;
}

export const API_URL = resolveApiUrl();

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add a request interceptor to inject the token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth store on 401 Unauthorized
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
