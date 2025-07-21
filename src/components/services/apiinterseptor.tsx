// import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
// import Cookies from 'js-cookie';
// import { toast } from 'sonner';

// const url = import.meta.env.VITE_APP_BACKEND;

// interface CustomAxiosRequestConfig extends AxiosRequestConfig {
//   _retry?: boolean;
// }

// const axiosInstance = axios.create({
//   baseURL: url,
//   withCredentials: true, // Ensures cookies are sent with requests
// });

// const setAuthToken = (token) => {
//   if (token) {
//     axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
//   } else {
//     delete axiosInstance.defaults.headers.Authorization;
//   }
// };

// // Initialize axios with stored token on app load
// const initializeAuth = () => {
//   const storedToken = Cookies.get('accessToken') || null;
//   if (storedToken) {
//     setAuthToken(storedToken);
//   }
// };
// initializeAuth();

// // -- Auth Helpers --
// export async function logout() {
//   try {
//     await axios.post(`${url}/auth/logout`, {}, { withCredentials: true });
//   } catch (error) {
//     toast.error('Logout failed:');
//   } finally {
//     setAuthToken(null); // Clear token before redirect
//     window.location.href = '/login';
//   }
// }

// export async function refreshAccessToken(): Promise<string> {
//   try {
//     const response = await axios.post(`${url}/auth/refresh-token`, {}, { withCredentials: true });
//     const accessToken = response.data?.data?.accessToken;

//     if (!accessToken) {
//       throw new Error('No access token returned');
//     }

//     setAuthToken(accessToken); // Update token in headers and storage

//     return accessToken;
//   } catch (error) {
//     toast.error('Your session has expired. Please log in again.');
//     throw error;
//   }
// }

// // -- Response Interceptor --
// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse): AxiosResponse => response,
//   async (error: AxiosError): Promise<AxiosResponse> => {
//     const originalRequest = error.config as CustomAxiosRequestConfig;

//     if (error.response) {
//       const { status, data } = error.response;
//       const message = typeof data === 'object' && data !== null && 'message' in data ? (data as { message: string }).message : undefined;

//       const pathname = window.location.pathname;

//       // Case 1: Token is missing or refresh is invalid
//       const dataMessage =
//         typeof data === 'object' && data !== null && 'message' in data
//           ? (data as { message: string }).message
//           : undefined;
//     if (
//   dataMessage === 'Access denied. No token provided.' ||
//   dataMessage === 'Invalid refresh token'
// ) {
//   // Allow public access to specific pages (e.g., assessments)
//   const isPublicPage = pathname.startsWith('/assessment/');
// console.log("isPublicPage",isPublicPage);
//   if (pathname.includes('/signup') || isPublicPage) {
//     return Promise.reject(error); // Don't logout or redirect
//   } else if (!pathname.includes('/login')) {
//     toast.error('Logging out invalid/missing token...');
//     await logout();
//   }

//   return Promise.reject(error);
// }

//       // Case 2: Access Token expired, try to refresh once
//       if (
//         status === 401 &&
//         (data as { message: string }).message === 'Token is not valid.' &&
//         !originalRequest._retry
//       ) {
//         originalRequest._retry = true;

//         try {
//           const newToken = await refreshAccessToken();
//           if (newToken) {
//             originalRequest.headers = {
//               ...originalRequest.headers,
//               Authorization: `Bearer ${newToken}`,
//             };
//             return axiosInstance(originalRequest);
//           }
//         } catch (refreshError) {
//           if (!pathname.includes('/login')) {
//             await logout();
//           }
//           return Promise.reject(refreshError);
//         }
//       }
//     }

//     // Default: Reject with original error
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const url = import.meta.env.VITE_APP_BACKEND;

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true, // Ensures cookies are sent with requests
});

// Define public API endpoints that don't require authentication
const publicApiEndpoints = [
  /^\/assessment\/[^/]+$/, // Matches /assessments/:id
];

const setAuthToken = (token: string | null) => {
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
    toast.error('Logout failed');
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

    setAuthToken(accessToken); // Update token in headers and storage

    return accessToken;
  } catch (error) {
    toast.error('Your session has expired. Please log in again.');
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
      const pathname = window.location.pathname;

      // Check if the request is to a public API endpoint
      const isPublicApi = originalRequest.url
        ? publicApiEndpoints.some(route => {
            const relativeUrl = originalRequest.url?.replace(url, '') || '';
            return route.test(relativeUrl);
          })
        : false;

      // Case 1: Token is missing or refresh is invalid
      const dataMessage =
        typeof data === 'object' && data !== null && 'message' in data
          ? (data as { message: string }).message
          : undefined;
      if (
        dataMessage === 'Access denied. No token provided.' ||
        dataMessage === 'Invalid refresh token'
      ) {
        if (isPublicApi || pathname.includes('/login') || pathname.includes('/signup')) {
          // Skip logout for public APIs or login/signup pages
          return Promise.reject(error);
        }
        toast.error('Logging out due to invalid/missing token...');
        await logout();
        return Promise.reject(error);
      }

      // Case 2: Access Token expired, try to refresh once
      if (
        status === 401 &&
        (data as { message: string }).message === 'Token is not valid.' &&
        !originalRequest._retry
      ) {
        if (isPublicApi) {
          // Skip token refresh for public APIs
          return Promise.reject(error);
        }

        originalRequest._retry = true;

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