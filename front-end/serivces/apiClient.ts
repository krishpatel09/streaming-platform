import { API_ENDPOINTS } from "@/config/api";
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/stores/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      let token = useAuthStore.getState().tokens?.accessToken;

      // Fallback: If store is not yet hydrated, peek into localStorage
      if (!token && typeof window !== "undefined") {
        try {
          const storage = localStorage.getItem("auth-storage");
          if (storage) {
            const parsed = JSON.parse(storage);
            token = parsed.state?.tokens?.accessToken;
            if (token) {
              console.log(
                "[API Client] Using token from localStorage fallback (pre-hydration)",
              );
            }
          }
        } catch (e) {
          console.error("[API Client] Failed to peek into localStorage", e);
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        { hasToken: !!token },
      );
      return config;
    },
    (err) => Promise.reject(err),
  );

  client.interceptors.response.use(
    (res) => {
      console.log(`[API Response] ${res.status} ${res.config.url}`);
      return res;
    },
    async (error) => {
      const original = error.config;
      console.error(
        `[API Error] ${error.response?.status} ${original.url}`,
        error.response?.data,
      );

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const { tokens } = useAuthStore.getState();
          const refreshToken = tokens?.refreshToken;

          if (!refreshToken) {
            console.warn(
              "[API Refresh] No refresh token available, logging out...",
            );
            throw new Error("No refresh token");
          }

          console.log("[API Refresh] Attempting token refresh...");
          const { data } = await axios.post(
            `${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            { refreshToken },
          );

          const newTokens = data.data;

          if (newTokens.accessToken) {
            console.log("[API Refresh] Success, updating store...");
            useAuthStore.getState().setTokens(newTokens);
          }

          original.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return axios(original);
        } catch (refreshError: any) {
          console.error(
            "[API Refresh] Failed, performing logout redirect",
            refreshError.message,
          );
          const { logout, identifier } = useAuthStore.getState();

          logout();

          if (typeof window !== "undefined") {
            const errorMsg =
              refreshError.response?.data?.message || "SESSION_EXPIRED";
            const searchParams = new URLSearchParams();
            if (identifier) searchParams.set("identifier", identifier);
            searchParams.set("reverify", "true");
            searchParams.set("reason", errorMsg);

            window.location.href = `/login?${searchParams.toString()}`;
          }
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );

  return client;
}

// // One client per microservice
// export const authClient = createApiClient(API_SERVICES.AUTH);
// export const contentClient = createApiClient(API_SERVICES.CONTENT);
// export const userClient = createApiClient(API_SERVICES.USER);
// export const searchClient = createApiClient(API_SERVICES.SEARCH);
// export const paymentClient = createApiClient(API_SERVICES.PAYMENT);
// export const liveTVClient = createApiClient(API_SERVICES.LIVE_TV);
// export const analyticsClient = createApiClient(API_SERVICES.ANALYTICS);

export default createApiClient();
