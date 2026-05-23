import axios from 'axios';

/**
 * Central Axios instance with 401 interceptor.
 *
 * Flow:
 * 1. Every request goes out with `withCredentials: true` so HTTP-only cookies are sent.
 * 2. On 401 response → automatically calls POST /api/auth/refresh to get a new access token.
 * 3. Retries the original request once with the fresh token.
 * 4. If refresh also fails (refresh token expired) → redirects to /login.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,   // CRITICAL: sends HTTP-only cookies on every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track whether a refresh is already in progress to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: boolean) => void)[] = [];

function subscribeTokenRefresh(cb: (success: boolean) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshComplete(success: boolean) {
  refreshSubscribers.forEach(cb => cb(success));
  refreshSubscribers = [];
}

// ─── Response Interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  // Success: pass through
  (response) => response,

  // Error: handle 401
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401s that haven't already been retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/refresh') &&
      !originalRequest.url?.includes('/api/auth/login')
    ) {
      // Mark so we don't retry infinitely
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue subsequent 401s until refresh resolves
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((success) => {
            if (success) {
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh the access token using the refresh cookie
        await api.post('/api/auth/refresh');
        isRefreshing = false;
        onRefreshComplete(true);
        // Retry the original request with the new access token in cookie
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshComplete(false);
        // Refresh token is also expired → redirect to login (only if not already there and not a public guest route, and not logging out)
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          const isLoggingOut = localStorage.getItem('isLoggingOut') === 'true';
          if (
            !isLoggingOut &&
            path !== '/' &&
            path !== '/join' &&
            !path.startsWith('/login') &&
            !path.startsWith('/register')
          ) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
