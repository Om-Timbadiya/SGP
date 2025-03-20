import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
  withCredentials: true,
});

// Retry failed requests
const retryRequest = async (error: AxiosError, retryCount: number = 0): Promise<any> => {
  const shouldRetry =
    retryCount < MAX_RETRIES &&
    (error.code === 'ECONNABORTED' ||
      error.response?.status === 408 ||
      error.response?.status === 429 ||
      !error.response);

  if (shouldRetry && error.config) {
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));

    // Clone the request config to retry
    const config: AxiosRequestConfig<any> = { ...error.config };
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

    switch (error.response.status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        return retryRequest(error);
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        const errorMessage =
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? (error.response.data as { message: string }).message
            : 'An error occurred';

        toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

const handleApiError = (error: AxiosError) => {
  if (
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return Promise.reject(new Error((error.response.data as { message: string }).message));
  }
  return Promise.reject(error);
};

export default api;
