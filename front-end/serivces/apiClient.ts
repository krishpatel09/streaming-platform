import { API_ENDPOINTS } from "@/config/api";
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function createApiClient(service?: string): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("auth-storage");
        if (raw) {
          try {
            const { state } = JSON.parse(raw);
            const token = state?.tokens?.accessToken;
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (e) {
            console.error("Error parsing auth storage", e);
          }
        }
      }
      return config;
    },
    (err) => Promise.reject(err),
  );

  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const raw = localStorage.getItem("auth-storage");
          if (raw) {
            const { state } = JSON.parse(raw);
            const refreshToken = state?.tokens?.refreshToken;

            if (!refreshToken) throw new Error("No refresh token");

            const { data } = await axios.post(
              `${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
              {
                refreshToken,
              },
            );

            const newAccessToken = data.data.accessToken;

            // Update localStorage directly since we can't easily access the store here without circular deps
            const newState = {
              ...state,
              tokens: { ...state.tokens, accessToken: newAccessToken },
            };
            localStorage.setItem(
              "auth-storage",
              JSON.stringify({ state: newState, version: 0 }),
            );

            original.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(original);
          }
        } catch (refreshError) {
          localStorage.removeItem("auth-storage");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
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
