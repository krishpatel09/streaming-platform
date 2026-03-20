import { API_ENDPOINTS } from "@/config/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
} from "@/types";
import apiClient from "./apiClient";

export const authService = {
  sendOtp: async (
    identifier: string,
    type: string,
    purpose: string,
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, {
      identifier,
      identifier_type: type,
      purpose,
    });
  },

  verifyOtp: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data,
    );
    return response.data.data;
  },

  refreshToken: async (token: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken: token },
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getSessions: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      API_ENDPOINTS.AUTH.GET_SESSIONS,
    );
    return response.data.data;
  },

  revokeSession: async (id: string): Promise<void> => {
    await apiClient.delete(
      API_ENDPOINTS.AUTH.REVOKE_SESSION.replace(":id", id),
    );
  },
};
