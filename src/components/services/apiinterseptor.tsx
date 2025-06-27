import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const url = import.meta.env.VITE_APP_BACKEND;

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true, // Ensures cookies are sent with requests
});

const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.Authorization;
  }
};

// Initialize axios with stored token on app load
const initializeAuth = () => {
  const storedToken = Cookies.get('accessToken') || null;
  if (storedToken) {
    setAuthToken(storedToken);
  }
};
initializeAuth();

// -- Auth Helpers --
export async function logout() {
  try {
    await axios.post(`${url}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    setAuthToken(null); // Clear token before redirect
    window.location.href = '/login';
  }
}

export async function refreshAccessToken(): Promise<string> {
  try {
    const response = await axios.post(`${url}/auth/refresh-token`, {}, { withCredentials: true });
    const accessToken = response.data?.data?.accessToken;

    if (!accessToken) {
      throw new Error('No access token returned');
    }

    console.log('✅ New Access Token:', accessToken);
    setAuthToken(accessToken); // Update token in headers and storage
    return accessToken;
  } catch (error) {
    console.error('❌ Failed to refresh access token:', error);
    throw error;
  }
}

// -- Response Interceptor --
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response) {
      const { status, data } = error.response;
      console.error('🚨 API Error:', { status, message: data?.message });

      const pathname = window.location.pathname;

      // Case 1: Token is missing or refresh is invalid
      if (
        data?.message === 'Access denied. No token provided.' ||
        data?.message === 'Invalid refresh token'
      ) {
        console.warn('🚫 Invalid or missing token');
        if (!pathname.includes('/login')) { // Avoid logout on login page
          console.warn('Logging out due to invalid/missing token...');
          await logout();
        }
        return Promise.reject(error);
      }

      // Case 2: Access Token expired, try to refresh once
      if (
        status === 401 &&
        data?.message === 'Access Token Expired' &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        console.log('🔄 Access token expired. Attempting refresh...');

        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('🔁 Token refresh failed:', refreshError);
          if (!pathname.includes('/login')) {
            await logout();
          }
          return Promise.reject(refreshError);
        }
      }
    }

    // Default: Reject with original error
    return Promise.reject(error);
  }
);

export default axiosInstance;