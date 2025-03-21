import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
  withCredentials: true,
});

// Retry failed requests
const retryRequest = async (error: AxiosError, retryCount = 0): Promise<any> => {
  const shouldRetry =
    retryCount < MAX_RETRIES &&
    (error.code === 'ECONNABORTED' ||
      error.response?.status === 408 ||
      error.response?.status === 429 ||
      !error.response);

  if (shouldRetry && error.config) {
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));

    const config: AxiosRequestConfig = { ...error.config, headers: { ...error.config.headers } };
    
    return api.request(config).catch(err => retryRequest(err, retryCount + 1));
  }

  return Promise.reject(error);
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return retryRequest(error);
    }

    // Type assertion for error response data
    const errorData = error.response.data as { message?: string };

    switch (error.response.status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Unauthorized'));
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        return retryRequest(error);
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        const errorMessage = errorData.message || 'An error occurred';
        toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// Handle API errors properly
const handleApiError = (error: AxiosError) => {
  const errorData = error.response?.data as { message?: string };
  if (errorData?.message) {
    return Promise.reject(new Error(errorData.message));
  }
  return Promise.reject(error);
};

export default api;
