import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          '/api/auth/refresh',
          {},
          {
            baseURL: '/api',
            withCredentials: true,
          },
        );

        const { accessToken } = response.data;
        Cookies.set('accessToken', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

