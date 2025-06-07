import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Define the base URL for the API
export const BASE_URL = 'https://api.fuelflex.in/api/';
export const HOST_URL = "https://api.fuelflex.in/"
// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Attach Authorization Token)
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("TOKEN")
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
